# Quality Assurance (QA) — Test Plan and Documentation

**Project:** Gemify  
**Version:** 1.0  

---

## 1. QA Overview

### 1.1 Purpose

This document describes the quality assurance strategy, test levels, test cases, and acceptance criteria for Gemify.

### 1.2 Scope

- Functional testing of all major features (auth, sales, customers, products, purchases, expenses, users, reports)
- Security and access control (roles, API auth)
- UI/UX and RTL behavior
- API contract and error handling
- Data integrity (transactions, constraints)

### 1.3 Roles

| Role | Responsibility |
|------|----------------|
| Developer | Unit/integration tests where implemented; code review |
| QA / Tester | Manual and automated test execution; bug reporting |
| Admin | UAT and sign-off for production |

---

## 2. Test Strategy

### 2.1 Test Levels

| Level | Description | Tools/Approach |
|-------|-------------|----------------|
| **Unit** | Functions and small modules (e.g. db helpers, parsers) | Jest/Node (if adopted) or manual code review |
| **Integration** | API routes + database (e.g. create transaction, list sales) | Manual (Postman/curl) or automated API tests |
| **System** | End-to-end user flows (login → sale → invoice print) | Manual browser testing; optional Playwright/Cypress |
| **Security** | Auth, authorization, SQL injection, password handling | Manual + checklist |
| **Regression** | Critical paths after changes | Re-run smoke and core test cases |

### 2.2 Environment

- **Test environment:** Same stack as dev (Next.js, MySQL); separate DB recommended (e.g. `jewelry_store_test`)
- **Browsers:** Chrome, Firefox, Edge (latest); Safari if required
- **RTL:** Verify layout and alignment in Persian

### 2.3 Test Data

- Use dedicated test users (admin, user role)
- Seed test customers, products, suppliers, and a few transactions for list/detail tests
- Do not use production data in test

---

## 3. Test Cases

### 3.1 Authentication

| ID | Test Case | Steps | Expected Result |
|----|-----------|--------|------------------|
| TC-AUTH-01 | Valid login | Open `/login`, enter valid email/username and password, submit | Redirect to `/dashboard`; session established |
| TC-AUTH-02 | Invalid login | Submit wrong password or unknown user | Error message; no redirect; no session |
| TC-AUTH-03 | Protected route without login | Open `/dashboard` (or any protected URL) without session | Redirect to `/login` |
| TC-AUTH-04 | Logout | Click logout (if available) or clear session | Redirect to home/login |
| TC-AUTH-05 | API without auth | Call GET `/api/transactions/list` without cookie/token | 401 Unauthorized |
| TC-AUTH-06 | API with Bearer token | Call same API with valid `Authorization: Bearer <token>` | 200 and data (if token valid) |

### 3.2 User Management (Admin)

| ID | Test Case | Steps | Expected Result |
|----|-----------|--------|------------------|
| TC-USER-01 | List users (admin) | Login as admin, go to `/users` | List of users; pagination and search work |
| TC-USER-02 | Create user (admin) | Fill form (username, email, password, role), submit | User created; appears in list; can login with new credentials |
| TC-USER-03 | Update user (admin) | Edit username/email/role/active; optionally change password | Changes saved; list updated |
| TC-USER-04 | Deactivate user (admin) | Deactivate a user (not self) | User deactivated; cannot login |
| TC-USER-05 | Self-deactivate blocked | As admin, try to deactivate own account or set is_active false | Error message; operation rejected |
| TC-USER-06 | Non-admin cannot access | Login as user role, open `/users` or call POST `/api/users/create` | 403 or redirect; no user management |

### 3.3 Sales (POS)

| ID | Test Case | Steps | Expected Result |
|----|-----------|--------|------------------|
| TC-SALE-01 | Add product to cart | Search product / scan barcode, add to cart | Product appears in cart; total updates |
| TC-SALE-02 | Select customer | Search customer, select | Customer name/phone shown |
| TC-SALE-03 | Complete sale | Enter bell number, date, paid amount, submit | Transaction created; cart cleared; invoice modal shown |
| TC-SALE-04 | Invoice print | From modal click “چاپ فاکتور” | New tab opens `/sale-product/print` with invoice; no nav/sidebar |
| TC-SALE-05 | Sale without customer | Try to complete sale without selecting customer | Validation message; sale not created |
| TC-SALE-06 | Sale without currency rate | If sale in USD and no rate for today | Appropriate error (e.g. “نرخ ارز برای امروز موجود نیست”) |

### 3.4 Sales List

| ID | Test Case | Steps | Expected Result |
|----|-----------|--------|------------------|
| TC-SALELIST-01 | List sales | Open `/sales` | Table with transactions; pagination works |
| TC-SALELIST-02 | Filter by search | Enter customer name or phone in search | List filtered |
| TC-SALELIST-03 | Filter by date | Set date from / date to | List filtered by date range |
| TC-SALELIST-04 | Print invoice from list | Click “چاپ فاکتور” on a row | New tab opens with that sale’s invoice |

### 3.5 Customers

| ID | Test Case | Steps | Expected Result |
|----|-----------|--------|------------------|
| TC-CUST-01 | List customers | Open `/customer-registration` | List with search and pagination |
| TC-CUST-02 | Create customer | Open “افزودن مشتری”, fill required fields, submit | Customer created; redirect or list refresh |
| TC-CUST-03 | Edit customer | Open edit for a customer, change fields, save | Changes saved |
| TC-CUST-04 | View customer | Open view page for a customer | All details and social links shown |

### 3.6 Products

| ID | Test Case | Steps | Expected Result |
|----|-----------|--------|------------------|
| TC-PROD-01 | List products | Open `/products` | List with pagination/search |
| TC-PROD-02 | Create product | Add new product with barcode, gram, karat, price | Product created; appears in list and in sale search |
| TC-PROD-03 | Sold product | Complete a sale including a product | Product marked sold; no longer available for sale |

### 3.7 Purchases

| ID | Test Case | Steps | Expected Result |
|----|-----------|--------|------------------|
| TC-PURCH-01 | List purchases | Open `/purchases` | List; optional supplier filter works |
| TC-PURCH-02 | Create purchase | Create purchase with supplier and items | Purchase saved; visible in list and detail |

### 3.8 Expenses and Currency

| ID | Test Case | Steps | Expected Result |
|----|-----------|--------|------------------|
| TC-EXP-01 | Add expense | Add store or personal expense | Record created; list updated |
| TC-CUR-01 | Set currency rate | Add/edit rate for a date (e.g. USD to AFN) | Rate saved; used for same-day USD sales |

### 3.9 Invoice Print Page

| ID | Test Case | Steps | Expected Result |
|----|-----------|--------|------------------|
| TC-INV-01 | Print page without data | Open `/sale-product/print` in new tab without prior “چاپ فاکتور” | Message “اطلاعات فاکتور یافت نشد” (or equivalent) |
| TC-INV-02 | Print page layout | Open print page after triggering from POS or sales list | Only invoice content; no navbar/sidebar |
| TC-INV-03 | Browser print | Use browser Print on invoice page | Print preview shows only invoice; correct RTL and numbers |

---

## 4. Acceptance Criteria (Summary)

- All “Must” requirements in SRS are testable and pass for the current release.
- No critical or high-severity bugs open for the scope of the release.
- Auth and role-based access work as specified (admin vs user).
- Sales flow completes end-to-end (cart → customer → transaction → invoice print).
- Invoice print opens in a separate page without nav/sidebar and prints correctly.
- List and filter behavior is correct for sales, customers, products, purchases, users (where applicable).
- Passwords are never exposed; user management APIs return 403 for non-admin.

---

## 5. Bug Severity and Reporting

| Severity | Definition | Example |
|----------|------------|--------|
| **Critical** | System unusable or data loss | Login broken; transaction not saved |
| **High** | Major feature broken or wrong result | Wrong total on invoice; list empty when data exists |
| **Medium** | Feature partially broken or workaround exists | Filter not working; wrong label |
| **Low** | Cosmetic or minor UX | Alignment; typo |

**Report fields:** Title, steps to reproduce, expected vs actual, environment (browser, OS), severity.

---

## 6. Regression and Release Checklist

Before each release:

- [ ] Run TC-AUTH-01 to TC-AUTH-06
- [ ] Run TC-USER-01 to TC-USER-06 (admin and user roles)
- [ ] Run TC-SALE-01 to TC-SALE-06
- [ ] Run TC-SALELIST-01 to TC-SALELIST-04
- [ ] Run TC-INV-01 to TC-INV-03
- [ ] Run at least one happy path for customers, products, purchases, expenses
- [ ] Confirm no console errors on main pages (dashboard, sale-product, sales, users)
- [ ] Confirm RTL and Persian display on key screens

---

## 7. Automated Testing (Future)

- **API:** Jest + supertest or Postman/Newman for `/api/*` routes
- **E2E:** Playwright or Cypress for login, one sale flow, and invoice print
- **CI:** Run API and E2E on push/PR to main (when implemented)
