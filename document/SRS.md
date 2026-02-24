# Software Requirements Specification (SRS)

**Project:** Gemify  
**Version:** 1.0  
**Last Updated:** 2025  

---

## 1. Introduction

### 1.1 Purpose

This document specifies the software requirements for **Gemify**, a web application for managing jewelry store operations including sales, purchases, inventory, customers, suppliers, expenses, and reporting.

### 1.2 Scope

- **In scope:** Web application for store staff and administrators; sales and purchase workflows; customer and product management; financial tracking (expenses, currency, loans); reports; user management; company profile.
- **Out of scope:** Mobile native apps (separate Flutter project may consume same API); accounting integration; e-commerce storefront.

### 1.3 Definitions and Acronyms

| Term | Definition |
|------|------------|
| AFN | Afghanis (local currency) |
| Bell (بل) | Transaction/receipt number |
| Fragment (شکسته) | Broken/piece jewelry (bought/sold by weight) |
| Karat (عیار) | Gold purity |
| NextAuth | Authentication library for Next.js |
| RTL | Right-to-left (Persian UI) |

### 1.4 References

- Next.js 16 App Router
- NextAuth.js v5
- MySQL 8
- Tailwind CSS 4

---

## 2. Overall Description

### 2.1 Product Perspective

The system is a single web application (Next.js) that provides:

- Dashboard and reporting
- Sales (point-of-sale) and sales list
- Purchases and purchase-from-supplier flows
- Product and product-master management
- Customer registration and loan management
- Supplier and supplier-product management
- Expenses (store and personal)
- Currency rates
- User management (admin-only)
- Company information

External systems: MySQL database; optional Flutter client using same API (Bearer token).

### 2.2 User Classes and Characteristics

| User Class | Description | Access |
|------------|-------------|--------|
| **Admin** | Full access; manages users, company, and all modules | All features including User Management |
| **User** | Store staff; no user management | All features except User Management (API returns 403) |

### 2.3 Operating Environment

- **Server:** Node.js 20+; MySQL 8
- **Client:** Modern browsers (Chrome, Firefox, Edge, Safari); RTL and Persian locale
- **Network:** HTTPS in production

### 2.4 Design and Implementation Constraints

- Next.js App Router and API Routes (no separate backend server)
- MySQL with raw SQL (no ORM)
- Authentication via NextAuth (Credentials + JWT); API may accept Bearer token for external clients
- UI in Persian (RTL) with optional English labels where applicable

---

## 3. System Features and Functional Requirements

### 3.1 Authentication and Authorization

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-AUTH-01 | System shall allow login with email or username and password | Must |
| FR-AUTH-02 | System shall persist session using JWT (e.g. 24h) | Must |
| FR-AUTH-03 | System shall redirect unauthenticated users to `/login` for protected pages | Must |
| FR-AUTH-04 | System shall support Bearer token for API access (e.g. Flutter client) | Must |
| FR-AUTH-05 | System shall assign role `admin` or `user` to each account | Must |
| FR-AUTH-06 | System shall allow only role `admin` to access user management APIs and UI | Must |

### 3.2 User Management (Admin Only)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-USER-01 | Admin shall list users with pagination and search (username/email) | Must |
| FR-USER-02 | Admin shall create user (username, email, password, role) | Must |
| FR-USER-03 | Admin shall update user (username, email, role, is_active, optional password) | Must |
| FR-USER-04 | Admin shall deactivate user (soft-delete: is_active = 0) | Must |
| FR-USER-05 | System shall prevent admin from deactivating or deleting their own account | Must |
| FR-USER-06 | System shall never return password hash in any API response | Must |

### 3.3 Company Information

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-COMP-01 | System shall store and display company name, slogan, phone, email, address, image | Must |
| FR-COMP-02 | Admin shall edit company information (form or API) | Must |
| FR-COMP-03 | Company data shall be available for invoice header and navbar | Must |

### 3.4 Customer Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-CUST-01 | System shall list customers with pagination and search (name/phone) | Must |
| FR-CUST-02 | User shall create customer (name, phone, email, address, image, secondary phone, company, notes, birth date, national ID, social links) | Must |
| FR-CUST-03 | User shall edit customer (same fields) on a dedicated edit page | Must |
| FR-CUST-04 | User shall view customer detail on a dedicated view page | Must |
| FR-CUST-05 | User shall delete customer | Should |
| FR-CUST-06 | Customer search shall be available for sale flow (select customer for transaction) | Must |

### 3.5 Sales (Point of Sale)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-SALE-01 | User shall search and add products to cart (by barcode/product search) | Must |
| FR-SALE-02 | User shall select a customer for the sale | Must |
| FR-SALE-03 | User shall enter bell number, date, paid amount, and optional note before confirming | Must |
| FR-SALE-04 | System shall create transaction (customer, products, receipt) and mark products as sold | Must |
| FR-SALE-05 | System shall convert USD to AFN using daily currency rate when sale is in dollar | Must |
| FR-SALE-06 | After successful sale, system shall show invoice modal and option to open print page | Must |
| FR-SALE-07 | User shall open invoice in a separate print-only page (no nav/sidebar) and print | Must |
| FR-SALE-08 | User shall print barcode labels for sold items (optional) | Should |

### 3.6 Sales List and Invoice Print

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-SALELIST-01 | User shall list all sales (transactions) with pagination | Must |
| FR-SALELIST-02 | User shall filter sales by search (customer name/phone) and date range | Must |
| FR-SALELIST-03 | User shall open invoice print for any sale from the list (same print page as POS) | Must |

### 3.7 Products and Inventory

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-PROD-01 | System shall list products with pagination and search | Must |
| FR-PROD-02 | User shall add product (name, type, gram, karat, purchase price, barcode, etc.) | Must |
| FR-PROD-03 | User shall edit and view product detail | Must |
| FR-PROD-04 | User shall mark product as sold via sale transaction (no manual toggle only) | Must |
| FR-PROD-05 | System shall support product types and product masters (templates) | Must |
| FR-PROD-06 | Warehouse/storage views shall list inventory | Should |

### 3.8 Purchases

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-PURCH-01 | User shall list purchases with optional supplier filter | Must |
| FR-PURCH-02 | User shall create purchase (supplier, items, amounts, bell, date) | Must |
| FR-PURCH-03 | User shall view and edit purchase detail | Must |

### 3.9 Suppliers and Supplier Products

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-SUP-01 | User shall list, create, update, delete suppliers | Must |
| FR-SUP-02 | User shall manage products-from-supplier (buy from supplier flow) and register supplier products | Must |

### 3.10 Fragments, Trades, Traders

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-FRAG-01 | User shall manage fragment (broken jewelry) records and fragment reports | Must |
| FR-TRADE-01 | User shall manage traders and trades | Must |

### 3.11 Expenses and Currency

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-EXP-01 | User shall list, add, edit, delete expenses (store) and personal expenses | Must |
| FR-CUR-01 | User shall manage currency rates (e.g. date, USD to AFN) | Must |
| FR-CUR-02 | System shall use daily rate for USD-to-AFN conversion in sales | Must |

### 3.12 Loans and Reports

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-LOAN-01 | User shall view customer loan balance and pay loan (transaction-based) | Must |
| FR-LOAN-02 | User shall manage loan reports | Must |
| FR-RPT-01 | User shall view daily report (transactions by date) | Must |
| FR-RPT-02 | User shall view general reports and sale reports (aggregates) | Must |

### 3.13 Dashboard

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-DASH-01 | Dashboard shall show summary stats (e.g. today sales, products, revenue) | Must |
| FR-DASH-02 | Dashboard shall provide quick links to main modules | Should |

### 3.14 Persons

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-PERS-01 | User shall list, create, update, delete persons (name, phone) | Must |

---

## 4. External Interface Requirements

### 4.1 User Interface

- **Language:** Primary Persian (RTL); numbers and dates in Persian where applicable
- **Layout:** Dashboard with sidebar navigation and top navbar; responsive (sidebar may collapse on small screens)
- **Components:** Tables with pagination, filters, modals/forms, toasts for success/error

### 4.2 API

- **Style:** REST; JSON request/response
- **Auth:** Session cookie (NextAuth) for browser; optional `Authorization: Bearer <token>` for API
- **Base path:** `/api/...`
- **Error responses:** HTTP 4xx/5xx with `{ success: false, message: string }` where applicable

### 4.3 Database

- **DBMS:** MySQL 8
- **Access:** Via `lib/db.ts` using `query()` with parameterized SQL only

---

## 5. Non-Functional Requirements

### 5.1 Performance

- List APIs shall support pagination (page, limit) to avoid large payloads
- Page load and API response should be acceptable for normal store usage (< 3s for typical operations)

### 5.2 Security

- Passwords shall be hashed (bcrypt) and never stored or returned in plain form
- All API routes under `/api/` (except public auth endpoints) shall require authentication
- User management APIs shall require role `admin`
- SQL shall use parameterized queries only (no concatenated user input)

### 5.3 Availability

- Application should run behind HTTPS in production
- Database connection uses pooling (`lib/db.ts`)

### 5.4 Maintainability

- Code in TypeScript; consistent use of App Router and shared components
- Database schema and migrations documented in `db.sql`

### 5.5 Usability

- RTL layout and Persian labels for primary users
- Clear feedback (toast, validation messages) on success and error

---

## 6. Data Requirements

- **Persistence:** All business data in MySQL (see `db.sql` for full schema)
- **Sensitive data:** Passwords hashed; no card data stored
- **Backup:** Database backup is operational responsibility (not implemented in app)

---

## 7. Appendices

### A. Main Application Routes (Pages)

- `/`, `/login` — Public
- `/dashboard` — Dashboard
- `/sale-product` — POS
- `/sales` — Sales list
- `/customer-registration`, `/customer-registration/new`, `/customer-registration/[id]`, `/customer-registration/[id]/edit`
- `/products`, `/products/new`, `/products/[id]`
- `/purchases`, `/purchases/new`, `/purchases/[id]`
- `/suppliers`, `/suppliers/[id]`
- `/product-from-supplier`, `/register-supplier-product`, `/register-product`, `/ware-house`
- `/expenses`, `/personal-expenses`, `/currency-rates`
- `/loan-management`, `/loan-reports`
- `/persons`, `/persons/[id]`
- `/new-trade`, `/new-trade/[id]`
- `/add-fragment`, `/daily-report`, `/report`
- `/company-information`
- `/users` — User management (admin)
- `/sale-product/print` — Invoice print (minimal layout, no nav/sidebar)

### B. User Roles Summary

- **admin:** Full access + user management
- **user:** Full access except user management (API 403 on user CRUD)
