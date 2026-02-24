# System Architecture

**Project:** Gemify  

---

## 1. High-Level Architecture

- **Client:** Browser runs the Next.js React app (App Router, RTL, Persian).
- **Server:** Same Next.js app serves pages and API routes.
- **Database:** MySQL 8; single database `jewelry_store`.
- **Auth:** NextAuth (Credentials + JWT); middleware protects routes and API; Bearer token supported for external clients.

No separate backend process; no Redis/cache in current design.

---

## 2. Technology Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 20+ |
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4, Lucide React |
| Auth | NextAuth.js v5 (Credentials, JWT) |
| HTTP Client | Axios (browser) |
| Database | MySQL 8, mysql2 driver |
| Language | TypeScript |

---

## 3. Project Structure

- **app/** — App Router: layout.tsx, page.tsx, login, api/*, (dashboard)/*, (minimal)/*.
- **app/api/** — REST API routes per domain (auth, users, transactions, customer, product, purchase, supplier, expense, currency-rate, company, etc.).
- **app/(dashboard)/** — Protected layout with Navbar + SideBar; all main pages (dashboard, sale-product, sales, customer-registration, products, purchases, suppliers, expenses, users, reports, etc.).
- **app/(minimal)/** — Minimal layout (no nav/sidebar): sale-product/print (invoice only).
- **components/** — ui/*, sale/*, customer/*, Navbar, SideBar, etc.
- **lib/** — db.ts (MySQL pool, query), db-sp.ts (stored procedures/helpers), context/AppContext.
- **context/** — CartContext for POS cart.
- **auth.ts / auth.config.ts** — NextAuth config; middleware.ts for CORS and auth.
- **db.sql** — Full MySQL schema, functions, procedures.

---

## 4. Data Flow (Examples)

**Login:** Credentials → NextAuth authorize() → query users → bcrypt compare → JWT/session → redirect dashboard.

**Create Sale:** Client POST create-transaction with customerId, product[], receipt, bellNumber, note → API gets currency rate → spCreateTransaction (validate, mark products sold, insert transaction) → return transaction for invoice.

**Invoice Print:** Client writes transaction + company to localStorage, opens /sale-product/print in new tab → print page reads localStorage, renders SaleInvoice, triggers window.print(). Print page uses (minimal) layout (no nav/sidebar).

**User Management:** All /api/users/* call auth(), require role === 'admin'; list/create/update/delete with validation and no password in responses.

---

## 5. Security

- Authentication: NextAuth session cookie or Bearer JWT for API.
- Authorization: Middleware allows public paths; dashboard and API require auth; user management APIs require admin.
- Passwords: bcrypt; never returned.
- SQL: Parameterized queries only (lib/db query()).
- CORS: Handled in middleware for cross-origin clients.

---

## 6. Database

- MySQL 8, InnoDB, utf8mb4_unicode_ci.
- Single pool in lib/db.ts; query() and getConnection() for transactions.
- Stored procedures: sp_create_transaction, sp_return_product, sp_pay_loan, sp_get_daily_transactions, sp_get_customer_loans.
- Functions: fn_get_currency_rate, fn_next_bell_number.
- Schema in db.sql (tables, indexes, FKs, triggers).

---

## 7. Route Groups

- **(dashboard):** Navbar + SideBar + main content for all main app pages.
- **(minimal):** Full-page white layout for invoice print only; no nav/sidebar.

---

## 8. State and Context

- Auth: NextAuth useSession() and server auth().
- Cart: CartContext for sale-product page.
- Company: AppContext companyData for navbar and invoice.
- Print: localStorage key saleInvoicePrint for passing invoice data to print page.
