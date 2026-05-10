# Finovate ERP Lite

**Developed by:** Ahmed Mostafa Ibrahim  
**Brand:** Finovate – AHMED EG  
**Phone:** 01225155329  
**Email:** gogom8870@gmail.com  
**GitHub:** https://github.com/ahmed1998AM  
**Facebook:** https://www.facebook.com/profile.php?id=100049475271023&sk=followers  
**Copyright:** © 2025 Ahmed Mostafa Ibrahim — All Rights Reserved

## نظرة عامة | Overview
A modern bilingual (Arabic/English) ERP web application foundation for small and medium businesses.

## Current Progress
- Responsive Next.js UI shell with RTL/LTR + theme switching.
- Dashboard KPIs and operations summary cards.
- API modules for Authentication, Accounting, Sales, Purchase, Inventory, HR, Reports, Notifications.
- Secure middleware baseline with JWT + payload validation.
- PostgreSQL schema foundation for multi-company ERP domain.

## API Endpoints (Implemented)
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/dashboard/kpis`
- `GET /api/accounting/journal-entries`
- `GET /api/sales/invoices`
- `GET /api/purchase/orders`
- `GET /api/inventory/products`
- `GET /api/hr/employees`
- `GET /api/reports/financial`
- `GET /api/notifications`

## Local Setup
```bash
npm install
cp .env.example .env
npm run dev:api
npm run dev:web
```

## Next Milestones
- Database persistence with Prisma client + migrations.
- RBAC middleware and permission guards per route.
- Real charts, Kanban board, file upload, OCR + AI assistant.
- Testing stack (unit + integration + e2e).
