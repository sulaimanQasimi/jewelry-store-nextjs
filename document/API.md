# API Reference

**Base URL:** Same origin (e.g. `/api`).  
**Auth:** Session cookie (NextAuth) or `Authorization: Bearer <JWT>`.  
**Format:** JSON request/response unless noted (e.g. multipart for file upload).

---

## Authentication

### NextAuth (Browser)

- **Session:** `GET /api/auth/session` — returns current session (used by client).
- **Login:** POST to NextAuth Credentials (via signIn from client); no direct “login” API URL for form submit.
- **Token (for external clients):** `POST /api/auth/token` — body `{ "email": "user@example.com", "password": "..." }` → returns `{ success, token, user }`. Use `Authorization: Bearer <token>` for subsequent API calls.

---

## User Management (Admin Only)

All require authenticated user with `role === 'admin'`. Otherwise 403.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/list` | List users. Query: `page`, `limit`, `search` (username/email). Response: `{ success, data[], total, page, limit }`. No password in `data`. |
| POST | `/api/users/create` | Create user. Body: `username`, `email`, `password`, optional `role` ('admin'\|'user'). |
| GET | `/api/users/[id]` | Get one user (no password). |
| PUT | `/api/users/update/[id]` | Update user. Body: optional `username`, `email`, `role`, `is_active`, `password`. Self-deactivate not allowed. |
| DELETE | `/api/users/delete/[id]` | Soft-deactivate (set is_active=0). Cannot delete self. |

---

## Transactions (Sales)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions/list` | List sales. Query: `page`, `limit`, `search`, `dateFrom`, `dateTo`. Response: `{ success, data[], total, page, limit }`. `data[].product` and `data[].receipt` are parsed JSON. |
| POST | `/api/transaction/create-transaction` | Create sale. Body: `customerId`, `product[]`, `receipt`, `bellNumber`, `note`. Converts USD→AFN using daily rate; calls `sp_create_transaction`. Returns created transaction (for invoice). |

---

## Customers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customer/registered-customers` | List. Query: `page`, `limit`, `search`. |
| GET | `/api/customer/[customerId]` | Get one. |
| POST | `/api/customer/new-customer` | Create. Body: FormData (customerName, phone, email, address, image, secondaryPhone, companyName, notes, birthDate, nationalId, social URLs). |
| PUT | `/api/customer/update-customer/[customerId]` | Update. FormData same as create. |

---

## Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/product/list` | List products. Pagination and search. |
| GET | `/api/product/[id]` | Get one. |
| GET | `/api/product/search-barcode/[code]` | Find by barcode. |
| GET | `/api/product/exist-product` | Exists/availability (for POS). |
| POST | `/api/product/new-product` | Create product. |

---

## Purchases

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/purchase/list` | List. Query: `page`, `limit`, `supplierId`. |
| GET | `/api/purchase/[id]` | Get one. |
| POST | `/api/purchase/create` | Create. |
| PUT | `/api/purchase/update/[id]` | Update. |
| DELETE | `/api/purchase/delete/[id]` | Delete. |

---

## Suppliers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/supplier/get-all` | List (e.g. for dropdowns). |
| GET | `/api/supplier/get` | List. |
| GET | `/api/supplier/[id]` | Get one. |
| POST | `/api/supplier/create` | Create. |
| PUT | `/api/supplier/update/[id]` | Update. |
| DELETE | `/api/supplier/delete/[id]` | Delete. |

---

## Company

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/company/company-data` | Get company (single record). Response: `{ success, companyData }`. |
| POST | `/api/company/edit-company` | Update. FormData: companyName, slogan, phone, email, address, image. |

---

## Currency Rates

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/currency-rate/list` | List. Query: pagination, search. |
| GET | `/api/currency-rate/[id]` | Get one. |
| POST | `/api/currency-rate/create` | Create (date, usdToAfn). |
| PUT | `/api/currency-rate/update/[id]` | Update. |
| DELETE | `/api/currency-rate/delete/[id]` | Delete. |
| GET | `/api/currency/today` | Today’s rate (used for display). |

---

## Expenses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expense/list` | List expenses. |
| GET | `/api/expense/all` | All. |
| GET | `/api/expense/daily` | By day. |
| GET | `/api/expense/search` | Search. |
| GET | `/api/expense/[id]` | Get one. |
| POST | `/api/expense/add-expense` | Add. |
| PUT | `/api/expense/update-spent/[id]` | Update. |
| DELETE | `/api/expense/delete-spent/[id]` | Delete. |

Personal expenses: `/api/personal-expense/*` (list, create, update, delete, get by id).

---

## Reports and Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Dashboard summary stats. |
| GET | `/api/transaction/daily-report` | Daily transactions. Query: `date`. |
| GET | `/api/transaction/sale-report` | Sale report. Query: `dateFrom`, `dateTo`. |
| GET | `/api/transaction/daily-sum` | Daily sum. |
| GET | `/api/transaction/loan-list` | Loan list. |
| GET | `/api/transaction/to-pay` | To pay. |

---

## Other Domains (CRUD pattern)

- **Persons:** `/api/person/list`, `/api/person/create`, `/api/person/[id]`, `/api/person/update/[id]`, `/api/person/delete/[id]`.
- **Product masters:** `/api/product-master/list`, create, get, update, delete.
- **Loan reports:** `/api/loan-report/list`, create, get, update, delete.
- **Fragments:** `/api/fragment/list`, create, get, update, delete.
- **Traders:** `/api/trader/list`, create, get, update, delete.
- **Trades:** `/api/trade/list`.
- **Supplier products:** `/api/supplier-product/list`, get, add, update, delete.
- **Storage:** `/api/storage/list`, `/api/storage/get`, `/api/storage/set`.

---

## Common Response Shapes

- **Success list:** `{ success: true, data: T[], total?: number, page?: number, limit?: number }`.
- **Success one:** `{ success: true, data: T }`.
- **Success message:** `{ success: true, message: string }`.
- **Error:** `{ success: false, message: string }` with HTTP 4xx/5xx.

---

## Auth and Errors

- **401:** Missing or invalid session/token.
- **403:** Forbidden (e.g. non-admin calling user management).
- **400:** Validation error (e.g. duplicate username, invalid input).

Public (no auth): `/`, `/login`, `/api/auth/*`, `/api/auth/token` (POST). All other `/api/*` require auth (session or Bearer).
