# Jewelry Store Management System - Next.js Migration

This is the migrated Next.js application combining the Express.js backend and React Vite frontend into a unified Next.js application with MySQL database.

**Repository:** [https://github.com/sulaimanQasimi/jewelry-store-nextjs](https://github.com/sulaimanQasimi/jewelry-store-nextjs) (public)

---

## Docker (MySQL + PM2, recommended for dev/deploy)

Clone and run with Docker Compose. MySQL is auto-configured and the schema (`db.sql`) is applied on first run. The app runs with PM2 inside the container.

```bash
git clone https://github.com/sulaimanQasimi/jewelry-store-nextjs.git
cd jewelry-store-nextjs
```

Optional: copy env example and edit (defaults work for local dev):

```bash
cp .env.docker.example .env
```

Build and start:

```bash
docker compose up -d
```

- **App:** http://localhost:3000  
- **MySQL:** localhost:3306 (user `jewelry`, password `jewelrypass`, database `jewelry_store` by default)

Stop:

```bash
docker compose down
```

To persist MySQL data and use custom env values, set in `.env` before `docker compose up`:

- `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_PORT`
- `AUTH_SECRET` / `JWT_SECRET` (min 16 chars; required for auth in production)
- `APP_PORT` (default 3000)

---

## Setup Instructions (without Docker)

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

1. Create a MySQL database:
   ```sql
   CREATE DATABASE jewelry_store;
   ```

2. Run the SQL schema file:
   ```bash
   mysql -u root -p jewelry_store < db.sql
   ```
   
   Or import `db.sql` using your MySQL client (phpMyAdmin, MySQL Workbench, etc.)

3. Update `.env` file with your MySQL connection details:
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/jewelry_store"
   # OR use individual variables:
   DB_HOST="localhost"
   DB_USER="root"
   DB_PASSWORD="password"
   DB_NAME="jewelry_store"
   DB_PORT="3306"
   ```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Database Connection
DATABASE_URL="mysql://root:password@localhost:3306/jewelry_store"
# OR use individual variables:
DB_HOST="localhost"
DB_USER="root"
DB_PASSWORD="password"
DB_NAME="jewelry_store"
DB_PORT="3306"

# JWT
JWT_SECRET="galaxy"

# Admin
ADMIN_EMAIL="admin@gmail.com"
ADMIN_PASSWORD="admin"

# Upload Directory
NEXT_PUBLIC_UPLOAD_DIR="/uploads"
```

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
jewelry-store-nextjs/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (replaces Express routes)
│   ├── (dashboard)/      # Protected dashboard routes
│   ├── login/            # Login page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page (redirects to login)
├── components/           # React components (migrated from frontend)
├── lib/                  # Utilities
│   ├── db.ts            # MySQL connection pool
│   ├── utils.ts         # Utility functions
│   └── context/         # Context providers
│       └── AppContext.tsx
├── db.sql                # MySQL database schema
├── public/               # Static assets
│   └── assets/          # Images, fonts, etc.
└── middleware.ts         # Auth middleware
```

## Database

The project uses **MySQL** with raw SQL queries via `mysql2`. The database schema is defined in `db.sql`.

### Database Connection

The database connection is managed in `lib/db.ts` using a connection pool. You can use either:
- `DATABASE_URL` environment variable (MySQL connection string)
- Individual `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT` variables

### Query Helper

Use the `query` helper function from `lib/db.ts`:

```typescript
import { query } from '@/lib/db'

// Simple query
const results = await query('SELECT * FROM customers')

// Parameterized query
const results = await query('SELECT * FROM customers WHERE id = ?', [customerId])

// Insert
const result = await query(
  'INSERT INTO customers (customerName, phone) VALUES (?, ?)',
  [name, phone]
)
```

## Migration Status

### Completed

- ✅ Next.js project structure with TypeScript and Tailwind CSS
- ✅ MySQL database schema (db.sql)
- ✅ Database connection utility (mysql2)
- ✅ Core API routes (admin, company, customer, product, transaction, currency, expense, supplier)
- ✅ Authentication middleware
- ✅ File upload handling
- ✅ Context providers migrated
- ✅ Assets copied to public directory
- ✅ Next.js configuration
- ✅ Login page
- ✅ Dashboard layout
- ✅ Components copied (need import updates)

### Remaining Tasks

1. **Update Component Imports**: All components need their imports updated:
   - Change `import { AppContext } from '../context/AppContext'` to `import { AppContext } from '@/lib/context/AppContext'`
   - Change `import { assets } from '../assets/assets'` to use Next.js Image component or `/assets/...` paths
   - Update all `backendUrl + '/api/...'` to `/api/...`

2. **Migrate Pages**: Convert React Router pages to Next.js pages:
   - Create pages in `app/(dashboard)/` directory
   - Update routing from React Router to Next.js file-based routing
   - Update navigation from `useNavigate()` to `useRouter()` from `next/navigation`

3. **Update API Routes**: Convert remaining Prisma queries to raw SQL:
   - All API routes need to be updated to use `query()` from `lib/db.ts` instead of Prisma
   - Use parameterized queries to prevent SQL injection

4. **Update Component API Calls**: Update all axios calls in components:
   - Remove `backendUrl` usage
   - Use relative paths `/api/...`
   - Add proper TypeScript types

## Key Changes from Original

1. **Database**: MongoDB → MySQL with raw SQL queries
2. **Backend**: Express.js → Next.js API Routes
3. **Frontend**: React Router → Next.js App Router
4. **File Uploads**: Multer → Next.js FormData handling
5. **API Calls**: Absolute URLs → Relative paths
6. **Routing**: React Router → Next.js file-based routing
7. **ORM**: Prisma → Raw SQL with mysql2

## Development Notes

- All API routes are in `app/api/` directory
- Protected routes are in `app/(dashboard)/` directory
- Components are in `components/` directory
- Use `'use client'` directive for client components
- Use Next.js `Image` component instead of `<img>` tags
- Use `useRouter()` from `next/navigation` instead of `useNavigate()`
- Use parameterized SQL queries to prevent SQL injection
- Database connection uses connection pooling for better performance

## API Endpoints

All API endpoints maintain the same structure as the original Express.js backend:
- `/api/admin/login` - Admin login
- `/api/company/*` - Company information
- `/api/customer/*` - Customer management
- `/api/product/*` - Product management
- `/api/transaction/*` - Transaction management
- `/api/supplier/*` - Supplier management
- `/api/currency/*` - Currency rates
- `/api/expense/*` - Expense management

## Database Schema

All tables are defined in `db.sql`. The schema includes:
- companies
- products
- customers
- transactions
- suppliers
- product_masters
- purchases
- purchase_items
- traders
- trades
- fragments
- expenses
- currency_rates
- loan_reports
- persons
- personal_expenses
- storages
- supplier_products
- pasas
- receipt_pasas
- fragment_reports

## Next Steps

1. Update all API routes to use raw SQL queries instead of Prisma
2. Update all component imports and API calls
3. Migrate remaining pages to Next.js App Router
4. Test all functionality
5. Update image paths to use Next.js Image component
6. Add proper TypeScript types throughout
