-- Jewelry Store Management System Database Schema
-- MySQL Database Schema

CREATE DATABASE IF NOT EXISTS jewelry_store;
USE jewelry_store;

-- Company Information Table
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
    isFragment BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_isSold (isSold),
    INDEX idx_barcode (barcode),
    INDEX idx_productName (productName)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

-- Product Masters Table
CREATE TABLE IF NOT EXISTS product_masters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    gram FLOAT NOT NULL,
    karat FLOAT NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
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

-- Purchase Items Table
CREATE TABLE IF NOT EXISTS purchase_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    purchaseId INT NOT NULL,
    productMasterId INT NOT NULL,
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
    FOREIGN KEY (purchaseId) REFERENCES purchases(id) ON DELETE CASCADE,
    FOREIGN KEY (productMasterId) REFERENCES product_masters(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Traders Table
CREATE TABLE IF NOT EXISTS traders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address VARCHAR(500),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_phone (phone),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Trades Table
CREATE TABLE IF NOT EXISTS trades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    traderId INT NOT NULL,
    traderName VARCHAR(255) NOT NULL,
    amount FLOAT NOT NULL,
    type VARCHAR(100) NOT NULL,
    detail TEXT,
    currency VARCHAR(50) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_traderId (traderId),
    INDEX idx_date (createdAt),
    FOREIGN KEY (traderId) REFERENCES traders(id) ON DELETE CASCADE
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
    INDEX idx_date (date),
    INDEX idx_type (type),
    INDEX idx_currency (currency)
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

-- Persons Table
CREATE TABLE IF NOT EXISTS persons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    INDEX idx_phone (phone),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Personal Expenses Table
CREATE TABLE IF NOT EXISTS personal_expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    personId INT NOT NULL,
    amount FLOAT NOT NULL,
    currency VARCHAR(50) NOT NULL,
    detail TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_personId (personId),
    INDEX idx_date (createdAt),
    FOREIGN KEY (personId) REFERENCES persons(id) ON DELETE CASCADE
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
