# Migration from Prisma to Raw SQL

## Changes Made

1. **Created `db.sql`**: Complete MySQL database schema file with all tables
2. **Updated `lib/db.ts`**: Changed from Prisma client to mysql2 connection pool
3. **Removed Prisma dependencies**: Updated `package.json` to remove `@prisma/client` and `prisma`
4. **Updated all API routes**: Converted all routes from Prisma to raw SQL queries
5. **Removed `prisma/` directory**: No longer needed (replaced by db.sql)

## Database Setup

1. Run the SQL file to create the database:
   ```bash
   mysql -u root -p < db.sql
   ```

2. Or import `db.sql` using your MySQL client

## API Routes - All Migrated

All API routes now use raw SQL via `query()` from `lib/db.ts`:

- ✅ `app/api/customer/registred-customers/route.ts`
- ✅ `app/api/customer/registered-customers/route.ts`
- ✅ `app/api/customer/new-customer/route.ts`
- ✅ `app/api/customer/search-customer/route.ts`
- ✅ `app/api/customer/update-customer/[customerId]/route.ts`
- ✅ `app/api/customer/delete-customer/[customerId]/route.ts`
- ✅ `app/api/customer/[customerId]/route.ts`
- ✅ `app/api/company/company-data/route.ts`
- ✅ `app/api/company/edit-company/route.ts`
- ✅ `app/api/product/exist-product/route.ts`
- ✅ `app/api/product/list/route.ts`
- ✅ `app/api/product/new-product/route.ts`
- ✅ `app/api/product/today/route.ts`
- ✅ `app/api/product/total/route.ts`
- ✅ `app/api/product/add-fragment/route.ts`
- ✅ `app/api/product/[id]/route.ts`
- ✅ `app/api/product/[id]/sold/route.ts`
- ✅ `app/api/product/delete-product/[productId]/route.ts`
- ✅ `app/api/product/search-barcode/[code]/route.ts`
- ✅ `app/api/currency/today/route.ts`
- ✅ `app/api/transaction/create-transaction/route.ts`
- ✅ `app/api/transaction/return/route.ts`
- ✅ `app/api/transaction/daily-report/route.ts`
- ✅ `app/api/transaction/loan-transaction/route.ts`
- ✅ `app/api/transaction/to-pay/route.ts`
- ✅ `app/api/transaction/sold/route.ts`
- ✅ `app/api/transaction/sale-report/route.ts`
- ✅ `app/api/transaction/pay-loan/route.ts`
- ✅ `app/api/transaction/daily-sum/route.ts`
- ✅ `app/api/transaction/loan-list/route.ts`
- ✅ `app/api/expense/add-expense/route.ts`
- ✅ `app/api/expense/daily/route.ts`
- ✅ `app/api/expense/search/route.ts`
- ✅ `app/api/expense/all/route.ts`
- ✅ `app/api/expense/total/route.ts`
- ✅ `app/api/expense/list/route.ts`
- ✅ `app/api/expense/[id]/route.ts`
- ✅ `app/api/expense/delete-spent/[spentId]/route.ts`
- ✅ `app/api/expense/update-spent/[id]/route.ts`
- ✅ `app/api/expense/get-spent/route.ts`
- ✅ All supplier, trader, supplier-product, storage routes

## Environment Variables

The `.env` file now supports both:
- `DATABASE_URL` (MySQL connection string)
- Individual variables: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`

## Query Helper Functions

Use the `query` helper from `lib/db.ts`:

```typescript
import { query } from '@/lib/db'

// SELECT
const results = await query('SELECT * FROM table_name WHERE id = ?', [id])

// INSERT
const result = await query(
  'INSERT INTO table_name (col1, col2) VALUES (?, ?)',
  [val1, val2]
)
// result.insertId contains the new ID

// UPDATE
await query('UPDATE table_name SET col1 = ? WHERE id = ?', [newVal, id])

// DELETE
await query('DELETE FROM table_name WHERE id = ?', [id])
```

## JSON Fields

For JSON fields (like `product` and `receipt` in transactions table), use `JSON.stringify()` when inserting. When reading, mysql2 typically returns parsed objects; use a fallback for robustness:

```typescript
function parseJson(val: unknown): any {
  if (typeof val === 'string') return JSON.parse(val)
  return val
}

// Insert
await query(
  'INSERT INTO transactions (customerId, product, receipt) VALUES (?, ?, ?)',
  [customerId, JSON.stringify(product), JSON.stringify(receipt)]
)

// Read
const transactions = await query('SELECT * FROM transactions') as any[]
transactions.forEach(t => {
  t.product = parseJson(t.product)
  t.receipt = parseJson(t.receipt)
})
```
