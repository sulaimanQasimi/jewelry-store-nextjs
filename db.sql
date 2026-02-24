-- Gemify Database Schema
-- MySQL Database Schema
--
-- This schema is used by the Next.js API with raw SQL (mysql2).
-- No Prisma ORM is required. Use lib/db.ts query() for all database access.
--
-- Setup: mysql -u root -p < db.sql
-- Or import via your MySQL client.
--
-- Last updated: schema aligned with Company Settings, Products (wage, auns, bellNumber, image),
-- and purchase_items.productMasterId nullable for manual wizard entries.

Drop Database If Exists jewelry_store;
CREATE DATABASE IF NOT EXISTS jewelry_store;
USE jewelry_store;

-- Company Information Table (brand identity, logo, contact; app uses ORDER BY id DESC LIMIT 1 for current company)
CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    companyName VARCHAR(255) NOT NULL,
    slogan VARCHAR(500),
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    address VARCHAR(500) NOT NULL,
    date DATETIME,
    image VARCHAR(500),
    INDEX idx_company_name (companyName)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    productName VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    gram FLOAT NOT NULL,
    karat FLOAT NOT NULL,
    purchasePriceToAfn FLOAT NOT NULL,
    bellNumber INT,
    isSold BOOLEAN DEFAULT FALSE,
    image VARCHAR(500),
    barcode VARCHAR(100) NOT NULL UNIQUE,
    wage FLOAT,
    auns FLOAT,
    pricing_mode ENUM('fixed','gold_based') DEFAULT 'fixed',
    wage_per_gram FLOAT NULL,
    isFragment BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_isSold (isSold),
    INDEX idx_barcode (barcode),
    INDEX idx_productName (productName),
    INDEX idx_sold_created (isSold, createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories Table (for product categorization)
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product-Categories Join Table (many-to-many)
CREATE TABLE IF NOT EXISTS product_categories (
    product_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (product_id, category_id),
    INDEX idx_category_id (category_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default categories (run once; INSERT IGNORE avoids duplicate names)
INSERT IGNORE INTO categories (name) VALUES ('انگشتر'), ('گردنبند'), ('دستبند'), ('گوشواره'), ('ساعت'), ('سایر');

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customerName VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    address VARCHAR(500),
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    image VARCHAR(500),
    secondaryPhone VARCHAR(50),
    companyName VARCHAR(255),
    notes TEXT,
    birthDate DATE,
    nationalId VARCHAR(50),
    facebookUrl VARCHAR(500),
    instagramUrl VARCHAR(500),
    whatsappUrl VARCHAR(500),
    telegramUrl VARCHAR(500),
    anniversary_date DATE NULL,
    special_dates JSON NULL,
    INDEX idx_phone (phone),
    INDEX idx_customerName (customerName)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Migration: run these ALTERs if customers table already exists without new columns
-- ALTER TABLE customers ADD COLUMN image VARCHAR(500) NULL AFTER date;
-- ALTER TABLE customers ADD COLUMN secondaryPhone VARCHAR(50) NULL AFTER image;
-- ALTER TABLE customers ADD COLUMN companyName VARCHAR(255) NULL AFTER secondaryPhone;
-- ALTER TABLE customers ADD COLUMN notes TEXT NULL AFTER companyName;
-- ALTER TABLE customers ADD COLUMN birthDate DATE NULL AFTER notes;
-- ALTER TABLE customers ADD COLUMN nationalId VARCHAR(50) NULL AFTER birthDate;
-- ALTER TABLE customers ADD COLUMN facebookUrl VARCHAR(500) NULL AFTER nationalId;
-- ALTER TABLE customers ADD COLUMN instagramUrl VARCHAR(500) NULL AFTER facebookUrl;
-- ALTER TABLE customers ADD COLUMN whatsappUrl VARCHAR(500) NULL AFTER instagramUrl;
-- ALTER TABLE customers ADD COLUMN telegramUrl VARCHAR(500) NULL AFTER whatsappUrl;

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customerId INT NOT NULL,
    customerName VARCHAR(255) NOT NULL,
    customerPhone VARCHAR(50) NOT NULL,
    product JSON NOT NULL,
    receipt JSON NOT NULL,
    bellNumber INT NOT NULL UNIQUE,
    note TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_bellNumber (bellNumber),
    INDEX idx_customerId (customerId),
    INDEX idx_createdAt (createdAt),
    INDEX idx_customer_created (customerId, createdAt),
    FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address VARCHAR(500),
    isActive BOOLEAN DEFAULT TRUE,
    INDEX idx_phone (phone),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- P Masters Table
CREATE TABLE IF NOT EXISTS p_masters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    gram FLOAT NOT NULL,
    karat FLOAT NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Purchases Table
CREATE TABLE IF NOT EXISTS purchases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplierId INT NOT NULL,
    supplierName VARCHAR(255) NOT NULL,
    totalAmount FLOAT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    bellNumber INT NOT NULL UNIQUE,
    currency VARCHAR(50) NOT NULL,
    paidAmount FLOAT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_bellNumber (bellNumber),
    INDEX idx_supplierId (supplierId),
    INDEX idx_date (date),
    FOREIGN KEY (supplierId) REFERENCES suppliers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Purchase Items Table (productMasterId deprecated; kept nullable for legacy data)
CREATE TABLE IF NOT EXISTS purchase_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    purchaseId INT NOT NULL,
    productMasterId INT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    gram FLOAT NOT NULL,
    karat FLOAT NOT NULL,
    quantity INT NOT NULL,
    registeredQty INT DEFAULT 0,
    remainingQty INT NOT NULL,
    price FLOAT NOT NULL,
    isCompleted BOOLEAN DEFAULT FALSE,
    INDEX idx_purchaseId (purchaseId),
    INDEX idx_productMasterId (productMasterId),
    FOREIGN KEY (purchaseId) REFERENCES purchases(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Fragments Table
CREATE TABLE IF NOT EXISTS fragments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gram FLOAT NOT NULL,
    wareHouse FLOAT DEFAULT 0,
    changedToPasa FLOAT DEFAULT 0,
    remain FLOAT,
    amount FLOAT NOT NULL,
    detail TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    isCompleted BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    detail VARCHAR(500) NOT NULL,
    price FLOAT NOT NULL,
    currency VARCHAR(50) NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    account_id CHAR(36) NULL,
    INDEX idx_date (date),
    INDEX idx_type (type),
    INDEX idx_currency (currency),
    INDEX idx_date_type (date, type),
    INDEX idx_expenses_account_id (account_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Currency Rates Table
CREATE TABLE IF NOT EXISTS currency_rates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date VARCHAR(50) NOT NULL UNIQUE,
    usdToAfn FLOAT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Gold Rates Table (for dynamic gold-based pricing)
CREATE TABLE IF NOT EXISTS gold_rates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date VARCHAR(50) NOT NULL UNIQUE,
    price_per_ounce_usd FLOAT NOT NULL,
    price_per_gram_afn FLOAT NULL,
    source VARCHAR(50) DEFAULT 'manual',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Loan Reports Table
CREATE TABLE IF NOT EXISTS loan_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cName VARCHAR(255) NOT NULL,
    cId INT NOT NULL,
    amount FLOAT NOT NULL,
    currency VARCHAR(50) NOT NULL,
    detail VARCHAR(500) NOT NULL,
    date DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_cId (cId),
    INDEX idx_date (date),
    FOREIGN KEY (cId) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Repairs Table (customer repair requests and work orders)
CREATE TABLE IF NOT EXISTS repairs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    product_description TEXT,
    incoming_notes TEXT,
    estimated_cost FLOAT NULL,
    currency VARCHAR(10) DEFAULT 'AFN',
    status ENUM('received','in_progress','ready','delivered','cancelled') DEFAULT 'received',
    due_date DATE NULL,
    completed_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_customer_id (customer_id),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Storage Table
CREATE TABLE IF NOT EXISTS storages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date VARCHAR(50) NOT NULL UNIQUE,
    usd FLOAT NOT NULL,
    afn FLOAT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Supplier Products Table
CREATE TABLE IF NOT EXISTS supplier_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplierId INT NOT NULL,
    supplierName VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    karat FLOAT,
    weight FLOAT NOT NULL,
    registeredWeight FLOAT DEFAULT 0,
    remainWeight FLOAT,
    pasa FLOAT NOT NULL,
    pasaReceipt FLOAT DEFAULT 0,
    pasaRemaining FLOAT NOT NULL,
    wagePerGram FLOAT,
    totalWage FLOAT NOT NULL,
    wageReceipt FLOAT DEFAULT 0,
    wageRemaining FLOAT NOT NULL,
    bellNumber INT,
    detail TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_supplierId (supplierId),
    INDEX idx_bellNumber (bellNumber),
    FOREIGN KEY (supplierId) REFERENCES suppliers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Pasa Table
CREATE TABLE IF NOT EXISTS pasas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gram FLOAT NOT NULL,
    toPasa FLOAT NOT NULL,
    detail TEXT,
    date DATETIME,
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Receipt Pasa Table
CREATE TABLE IF NOT EXISTS receipt_pasas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplierId INT NOT NULL,
    supplierName VARCHAR(255) NOT NULL,
    receiptPasa FLOAT DEFAULT 0,
    receiptWage FLOAT DEFAULT 0,
    detail TEXT,
    date DATETIME,
    INDEX idx_supplierId (supplierId),
    INDEX idx_date (date),
    FOREIGN KEY (supplierId) REFERENCES suppliers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Fragment Reports Table
CREATE TABLE IF NOT EXISTS fragment_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    totalGram FLOAT NOT NULL,
    totalAmount FLOAT NOT NULL,
    toWareHouse FLOAT DEFAULT 0,
    toPasa FLOAT DEFAULT 0,
    detail VARCHAR(500) NOT NULL,
    date DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Users/Admin Table (password_hash only; no plain password)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin','user') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert test user (username: testuser, password: 123) — bcrypt hash of '123'
INSERT INTO users (username, email, password_hash, role)
VALUES ('testuser', 'testuser@example.com', '$2b$10$Vic6hyvwWLdQSyb7VYm75u/zoIE6W7sVCQzu3MUtWiapfjDzqV7m6', 'admin')
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);

-- If you still have the OLD users table (with "password" column instead of "password_hash"):
-- 1. Either run the migration below, or
-- 2. Login with existing user (plain password is supported for old schema).
-- Migration (run once): add new columns and copy password into password_hash, then you can drop password later.
-- ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NULL, ADD COLUMN role ENUM('admin','user') DEFAULT 'admin', ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
-- UPDATE users SET password_hash = password WHERE password_hash IS NULL;
-- Then insert/update test user: run the INSERT above (after ensuring password_hash column exists).

-- Optional: Migration for existing customers table missing newer columns (see commented ALTERs above in customers section).
-- ALTER TABLE customers ADD COLUMN anniversary_date DATE NULL AFTER telegramUrl;
-- ALTER TABLE customers ADD COLUMN special_dates JSON NULL AFTER anniversary_date;
-- ALTER TABLE products ADD COLUMN pricing_mode ENUM('fixed','gold_based') DEFAULT 'fixed' AFTER auns;
-- ALTER TABLE products ADD COLUMN wage_per_gram FLOAT NULL AFTER pricing_mode;

-- =============================================================================
-- AUDIT LOG TABLE (for triggers)
-- =============================================================================

CREATE TABLE IF NOT EXISTS audit_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(64) NOT NULL,
    record_id INT NOT NULL,
    action ENUM('INSERT','UPDATE','DELETE') NOT NULL,
    old_values JSON,
    new_values JSON,
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_table_record (table_name, record_id),
    INDEX idx_changed_at (changed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- FUNCTIONS (DROP IF EXISTS for idempotent re-runs)
-- =============================================================================

DROP FUNCTION IF EXISTS fn_get_currency_rate//
DROP FUNCTION IF EXISTS fn_next_bell_number//

DELIMITER //

-- Get currency rate for a date (returns usdToAfn or NULL). COLLATE avoids mix of collations (utf8mb4_unicode_ci vs utf8mb4_0900_ai_ci).
CREATE FUNCTION fn_get_currency_rate(p_date VARCHAR(50))
RETURNS FLOAT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_rate FLOAT DEFAULT NULL;
    SELECT usdToAfn INTO v_rate FROM currency_rates WHERE date = CONVERT(p_date USING utf8mb4) COLLATE utf8mb4_unicode_ci LIMIT 1;
    RETURN v_rate;
END//

-- Get next available bell number for transactions
CREATE FUNCTION fn_next_bell_number()
RETURNS INT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_max INT DEFAULT 0;
    SELECT COALESCE(MAX(bellNumber), 0) + 1 INTO v_max FROM transactions;
    RETURN v_max;
END//

DELIMITER ;

-- =============================================================================
-- TRIGGERS (DROP IF EXISTS for idempotent re-runs)
-- =============================================================================

DROP TRIGGER IF EXISTS trg_products_after_update//
DROP TRIGGER IF EXISTS trg_transactions_after_insert//

DELIMITER //

-- Audit trigger: log product isSold changes
CREATE TRIGGER trg_products_after_update
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
    IF OLD.isSold != NEW.isSold THEN
        INSERT INTO audit_log (table_name, record_id, action, old_values, new_values)
        VALUES ('products', NEW.id, 'UPDATE',
            JSON_OBJECT('isSold', OLD.isSold),
            JSON_OBJECT('isSold', NEW.isSold));
    END IF;
END//

-- Audit trigger: log new transactions
CREATE TRIGGER trg_transactions_after_insert
AFTER INSERT ON transactions
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, record_id, action, new_values)
    VALUES ('transactions', NEW.id, 'INSERT',
        JSON_OBJECT('customerId', NEW.customerId, 'bellNumber', NEW.bellNumber));
END//

DELIMITER ;

-- =============================================================================
-- STORED PROCEDURES (DROP IF EXISTS for idempotent re-runs)
-- =============================================================================

DROP PROCEDURE IF EXISTS sp_create_transaction//
DROP PROCEDURE IF EXISTS sp_return_product//
DROP PROCEDURE IF EXISTS sp_pay_loan//
DROP PROCEDURE IF EXISTS sp_get_daily_transactions//
DROP PROCEDURE IF EXISTS sp_get_customer_loans//

DELIMITER //

-- Create transaction: validate, mark products sold, insert. Caller must pass
-- product/receipt already converted to AFN. Returns new transaction row.
CREATE PROCEDURE sp_create_transaction(
    IN p_customer_id INT,
    IN p_product_json JSON,
    IN p_receipt_json JSON,
    IN p_bell_number INT,
    IN p_note TEXT,
    OUT p_transaction_id INT,
    OUT p_error_msg VARCHAR(500)
)
sp_create: BEGIN
    DECLARE v_customer_name VARCHAR(255) DEFAULT NULL;
    DECLARE v_customer_phone VARCHAR(50) DEFAULT NULL;
    DECLARE v_product_id INT;
    DECLARE v_idx INT DEFAULT 0;
    DECLARE v_sold TINYINT;

    SET p_transaction_id = 0;
    SET p_error_msg = NULL;

    SELECT customerName, phone INTO v_customer_name, v_customer_phone
    FROM customers WHERE id = p_customer_id LIMIT 1;
    IF v_customer_name IS NULL THEN
        SET p_error_msg = 'مشتری یافت نشد';
        LEAVE sp_create;
    END IF;

    SET v_idx = 0;
    product_loop: WHILE v_idx < JSON_LENGTH(p_product_json) DO
        SET v_product_id = CAST(JSON_UNQUOTE(JSON_EXTRACT(p_product_json, CONCAT('$[', v_idx, '].productId'))) AS UNSIGNED);
        SELECT isSold INTO v_sold FROM products WHERE id = v_product_id LIMIT 1;
        IF v_sold IS NULL THEN
            SET p_error_msg = CONCAT('محصول با آی‌دی ', v_product_id, ' پیدا نشد');
            LEAVE sp_create;
        END IF;
        IF v_sold = 1 THEN
            SET p_error_msg = 'محصول قبلاً فروخته شده';
            LEAVE sp_create;
        END IF;
        UPDATE products SET isSold = 1 WHERE id = v_product_id;
        SET v_idx = v_idx + 1;
    END WHILE;

    INSERT INTO transactions (customerId, customerName, customerPhone, product, receipt, bellNumber, note)
    VALUES (p_customer_id, v_customer_name, v_customer_phone, p_product_json, p_receipt_json, p_bell_number, p_note);
    SET p_transaction_id = LAST_INSERT_ID();
END//

-- Return product from transaction
CREATE PROCEDURE sp_return_product(
    IN p_transaction_id INT,
    IN p_product_id INT,
    OUT p_success TINYINT,
    OUT p_error_msg VARCHAR(500)
)
sp_return: BEGIN
    DECLARE v_product_json JSON;
    DECLARE v_receipt_json JSON;
    DECLARE v_products_len INT;
    DECLARE v_idx INT DEFAULT 0;
    DECLARE v_found_idx INT DEFAULT -1;
    DECLARE v_product_amount FLOAT;
    DECLARE v_removed_product JSON;
    DECLARE v_new_products JSON;
    DECLARE v_new_receipt JSON;
    DECLARE v_total FLOAT;
    DECLARE v_paid FLOAT;
    DECLARE v_remaining FLOAT;
    DECLARE v_total_qty INT;

    SET p_success = 0;
    SET p_error_msg = NULL;

    SELECT product, receipt INTO v_product_json, v_receipt_json
    FROM transactions WHERE id = p_transaction_id LIMIT 1;

    IF v_product_json IS NULL THEN
        SET p_error_msg = 'ترانسکشن پیدا نشد';
        LEAVE sp_return;
    END IF;

    SET v_products_len = JSON_LENGTH(v_product_json);
    SET v_idx = 0;
    find_loop: WHILE v_idx < v_products_len DO
        IF CAST(JSON_UNQUOTE(JSON_EXTRACT(v_product_json, CONCAT('$[', v_idx, '].productId'))) AS UNSIGNED) = p_product_id THEN
            SET v_found_idx = v_idx;
            LEAVE find_loop;
        END IF;
        SET v_idx = v_idx + 1;
    END WHILE;

    IF v_found_idx < 0 THEN
        SET p_error_msg = 'محصول در ترانسکشن وجود ندارد';
        LEAVE sp_return;
    END IF;

    SET v_removed_product = JSON_EXTRACT(v_product_json, CONCAT('$[', v_found_idx, ']'));
    SET v_product_amount = CAST(JSON_UNQUOTE(JSON_EXTRACT(v_removed_product, '$.salePrice.price')) AS DECIMAL(15,2));

    UPDATE products SET isSold = 0 WHERE id = p_product_id;

    SET v_new_products = JSON_REMOVE(v_product_json, CONCAT('$[', v_found_idx, ']'));

    SET v_total = CAST(JSON_UNQUOTE(JSON_EXTRACT(v_receipt_json, '$.totalAmount')) AS DECIMAL(15,2)) - v_product_amount;
    SET v_paid = CAST(JSON_UNQUOTE(JSON_EXTRACT(v_receipt_json, '$.paidAmount')) AS DECIMAL(15,2)) - v_product_amount;
    SET v_total_qty = CAST(JSON_UNQUOTE(JSON_EXTRACT(v_receipt_json, '$.totalQuantity')) AS UNSIGNED);
    IF v_total_qty IS NULL THEN SET v_total_qty = v_products_len; END IF;
    SET v_remaining = GREATEST(0, v_total - v_paid);

    SET v_new_receipt = JSON_SET(v_receipt_json,
        '$.totalAmount', v_total,
        '$.paidAmount', v_paid,
        '$.totalQuantity', v_total_qty - 1,
        '$.remainingAmount', v_remaining);

    IF JSON_LENGTH(v_new_products) = 0 THEN
        DELETE FROM transactions WHERE id = p_transaction_id;
    ELSE
        UPDATE transactions SET product = v_new_products, receipt = v_new_receipt WHERE id = p_transaction_id;
    END IF;

    SET p_success = 1;
END//

-- Pay loan: update receipt with payment
CREATE PROCEDURE sp_pay_loan(
    IN p_transaction_id INT,
    IN p_amount FLOAT,
    IN p_currency VARCHAR(50),
    IN p_usd_rate FLOAT,
    OUT p_success TINYINT,
    OUT p_error_msg VARCHAR(500)
)
sp_pay: BEGIN
    DECLARE v_receipt JSON;
    DECLARE v_remaining FLOAT;
    DECLARE v_paid_amount FLOAT;
    DECLARE v_to_apply FLOAT;
    DECLARE v_new_paid FLOAT;
    DECLARE v_new_remaining FLOAT;

    SET p_success = 0;
    SET p_error_msg = NULL;

    SELECT receipt INTO v_receipt FROM transactions WHERE id = p_transaction_id LIMIT 1;
    IF v_receipt IS NULL THEN
        SET p_error_msg = 'ترانسکشن یافت نشد';
        LEAVE sp_pay;
    END IF;

    SET v_remaining = CAST(JSON_UNQUOTE(JSON_EXTRACT(v_receipt, '$.remainingAmount')) AS DECIMAL(15,2));
    IF v_remaining <= 0 THEN
        SET p_error_msg = 'قبلاً تسویه شده است';
        LEAVE sp_pay;
    END IF;

    IF p_currency = 'دالر' THEN
        SET v_paid_amount = p_amount * p_usd_rate;
    ELSE
        SET v_paid_amount = p_amount;
    END IF;

    SET v_to_apply = LEAST(v_paid_amount, v_remaining);
    SET v_new_paid = CAST(JSON_UNQUOTE(JSON_EXTRACT(v_receipt, '$.paidAmount')) AS DECIMAL(15,2)) + v_to_apply;
    SET v_new_remaining = v_remaining - v_to_apply;

    UPDATE transactions SET receipt = JSON_SET(v_receipt, '$.paidAmount', v_new_paid, '$.remainingAmount', v_new_remaining)
    WHERE id = p_transaction_id;

    SET p_success = 1;
END//

-- Get daily transactions (date range)
CREATE PROCEDURE sp_get_daily_transactions(
    IN p_date_from DATETIME,
    IN p_date_to DATETIME
)
BEGIN
    SELECT * FROM transactions
    WHERE createdAt >= p_date_from AND createdAt <= p_date_to
    ORDER BY createdAt DESC;
END//

-- Get customer loans summary (transactions with remaining > 0)
CREATE PROCEDURE sp_get_customer_loans()
BEGIN
    SELECT id, customerId, customerName, customerPhone, product, receipt, bellNumber, createdAt
    FROM transactions
    WHERE JSON_EXTRACT(receipt, '$.remainingAmount') > 0
    ORDER BY createdAt DESC;
END//

DELIMITER ;

-- =============================================================================
-- MIGRATION: For existing databases, run these to add composite indexes
-- (Skip if you get "Duplicate key name" - indexes already exist)
-- =============================================================================
-- ALTER TABLE transactions ADD INDEX idx_customer_created (customerId, createdAt);
-- ALTER TABLE products ADD INDEX idx_sold_created (isSold, createdAt);
-- ALTER TABLE expenses ADD INDEX idx_date_type (date, type);

-- =============================================================================
-- Banking: Accounts and Ledger (advanced account system)
-- =============================================================================

CREATE TABLE IF NOT EXISTS accounts (
    id CHAR(36) PRIMARY KEY,
    account_number VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    balance DECIMAL(20, 4) NOT NULL DEFAULT 0,
    status ENUM('active', 'frozen') NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_accounts_balance_non_negative CHECK (balance >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS account_transactions (
    id CHAR(36) PRIMARY KEY,
    account_id CHAR(36) NOT NULL,
    type ENUM('credit', 'debit') NOT NULL,
    amount DECIMAL(20, 4) NOT NULL,
    balance_before DECIMAL(20, 4) NOT NULL,
    balance_after DECIMAL(20, 4) NOT NULL,
    description VARCHAR(500) DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_account_transactions_balance_after CHECK (balance_after >= 0),
    CONSTRAINT fk_account_transactions_account FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE RESTRICT,
    INDEX idx_account_transactions_account_id (account_id),
    INDEX idx_account_transactions_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Link expenses to accounts (run after accounts table exists; for existing DBs add column first)
-- ALTER TABLE expenses ADD COLUMN account_id CHAR(36) NULL;
-- ALTER TABLE expenses ADD CONSTRAINT fk_expenses_account FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL;
