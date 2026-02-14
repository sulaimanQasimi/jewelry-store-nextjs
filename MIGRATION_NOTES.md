# Migration from Prisma to Raw SQL

## Changes Made

1. **Created `db.sql`**: Complete MySQL database schema file with all tables
2. **Updated `lib/db.ts`**: Changed from Prisma client to mysql2 connection pool
3. **Removed Prisma dependencies**: Updated `package.json` to remove `@prisma/client` and `prisma`
4. **Updated API routes**: Converted example routes to use raw SQL queries

## Database Setup

1. Run the SQL file to create the database:
   ```bash
   mysql -u root -p < db.sql
   ```

2. Or import `db.sql` using your MySQL client

## API Route Updates Needed

All API routes need to be updated from Prisma to raw SQL. Here's the pattern:

### Before (Prisma):
```typescript
import { query } from '@/lib/db'

const products = await prisma.product.findMany({
  where: { isSold: false },
  orderBy: { createdAt: 'desc' }
})
```

### After (Raw SQL):
```typescript
import { query } from '@/lib/db'

const products = await query(
  'SELECT * FROM products WHERE isSold = ? ORDER BY createdAt DESC',
  [false]
) as any[]
```

## Files to Update

All files in `app/api/` that import from `@/lib/db` need to be updated:

- ✅ `app/api/customer/registred-customers/route.ts` - Updated
- ✅ `app/api/customer/new-customer/route.ts` - Updated
- ✅ `app/api/company/company-data/route.ts` - Updated
- ✅ `app/api/product/exist-product/route.ts` - Updated
- ✅ `app/api/currency/today/route.ts` - Updated
- ⚠️ All other API routes still need updating

## Prisma Files to Remove

- `prisma/schema.prisma` - Can be deleted (replaced by db.sql)
- `prisma/` directory - Can be deleted if empty
- `prisma.config.ts` - Already deleted

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

For JSON fields (like `product` and `receipt` in transactions table), use `JSON.stringify()` when inserting and `JSON.parse()` when reading:

```typescript
// Insert
await query(
  'INSERT INTO transactions (customerId, product, receipt) VALUES (?, ?, ?)',
  [customerId, JSON.stringify(product), JSON.stringify(receipt)]
)

// Read
const transactions = await query('SELECT * FROM transactions') as any[]
transactions.forEach(t => {
  t.product = JSON.parse(t.product)
  t.receipt = JSON.parse(t.receipt)
})
```
