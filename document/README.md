# Jewelry Store Management System — Documentation Index

This folder contains full project documentation for the Jewelry Store Management System (Next.js + MySQL).

## Documents

| Document | Description |
|----------|-------------|
| [SRS.md](SRS.md) | **Software Requirements Specification** — Functional and non-functional requirements, user roles, features, and use cases |
| [QA.md](QA.md) | **Quality Assurance** — Test strategy, test cases, acceptance criteria, and QA procedures |
| [ARCHITECTURE.md](ARCHITECTURE.md) | **System Architecture** — Tech stack, folder structure, data flow, and security |
| [API.md](API.md) | **API Reference** — REST API endpoints, request/response formats, and auth |
| [DEPLOYMENT.md](DEPLOYMENT.md) | **Deployment Guide** — Environment setup, build, and production deployment |
| [USER_GUIDE.md](USER_GUIDE.md) | **User Guide** — How to use the application (Persian/English) |

## Quick Links

- **Requirements & scope:** SRS.md  
- **Testing:** QA.md  
- **How the system is built:** ARCHITECTURE.md  
- **Backend API details:** API.md  
- **Going to production:** DEPLOYMENT.md  
- **End-user usage:** USER_GUIDE.md  

## Project Overview

The system is a **jewelry store management** web application built with:

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS 4  
- **Backend:** Next.js API Routes (same repo)  
- **Database:** MySQL (mysql2 driver, raw SQL)  
- **Auth:** NextAuth.js (Credentials + JWT), role-based (admin/user)  

It supports sales, purchases, customers, products, suppliers, expenses, currency rates, loans, and reports, with RTL (Persian) UI.
