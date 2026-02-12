# Jewelry Store Management System - Next.js Migration

This is the migrated Next.js application combining the Express.js backend and React Vite frontend into a unified Next.js application with MySQL database.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

1. Create a MySQL database named `jewelry_store`
2. Update `.env` file with your MySQL connection string:
   ```
   DATABASE_URL="mysql://user:password@localhost:3306/jewelry_store"
   ```

3. Generate Prisma client and run migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="mysql://root:password@localhost:3306/jewelry_store"
JWT_SECRET="galaxy"
ADMIN_EMAIL="admin@gmail.com"
ADMIN_PASSWORD="admin"
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
│   ├── db.ts            # Prisma client
│   ├── utils.ts         # Utility functions
│   └── context/         # Context providers
│       └── AppContext.tsx
├── prisma/               # Prisma schema and migrations
│   └── schema.prisma
├── public/               # Static assets
│   └── assets/          # Images, fonts, etc.
└── middleware.ts         # Auth middleware
```

## Migration Status

### Completed

- ✅ Next.js project structure with TypeScript and Tailwind CSS
- ✅ Prisma schema with all MySQL models
- ✅ Database connection utility
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
   - Change `import { assets } from '../assets/assets'` to `import { assets } from '@/../public/assets/assets'` or use Next.js Image component
   - Update all `backendUrl + '/api/...'` to `/api/...`

2. **Migrate Pages**: Convert React Router pages to Next.js pages:
   - Create pages in `app/(dashboard)/` directory
   - Update routing from React Router to Next.js file-based routing
   - Update navigation from `useNavigate()` to `useRouter()` from `next/navigation`

3. **Create Remaining API Routes**: Some routes still need to be created:
   - Purchase routes
   - Trader routes
   - Trade routes
   - Fragment routes
   - Loan report routes
   - Person routes
   - Personal expense routes
   - Storage routes
   - Supplier product routes
   - Pasa routes
   - Receipt pasa routes
   - Fragment report routes

4. **Update Component API Calls**: Update all axios calls in components:
   - Remove `backendUrl` usage
   - Use relative paths `/api/...`
   - Add proper TypeScript types

## Key Changes from Original

1. **Database**: MongoDB → MySQL with Prisma ORM
2. **Backend**: Express.js → Next.js API Routes
3. **Frontend**: React Router → Next.js App Router
4. **File Uploads**: Multer → Next.js FormData handling
5. **API Calls**: Absolute URLs → Relative paths
6. **Routing**: React Router → Next.js file-based routing

## Development Notes

- All API routes are in `app/api/` directory
- Protected routes are in `app/(dashboard)/` directory
- Components are in `components/` directory
- Use `'use client'` directive for client components
- Use Next.js `Image` component instead of `<img>` tags
- Use `useRouter()` from `next/navigation` instead of `useNavigate()`

## Database Schema

All models have been migrated to Prisma schema. See `prisma/schema.prisma` for details.

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

## Next Steps

1. Update all component imports and API calls
2. Migrate remaining pages to Next.js App Router
3. Create remaining API routes
4. Test all functionality
5. Update image paths to use Next.js Image component
6. Add proper TypeScript types throughout
