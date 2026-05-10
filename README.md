# Finovate ERP Lite

**Developed by:** Ahmed Mostafa Ibrahim  
**Brand:** Finovate – AHMED EG  
**Phone:** 01225155329  
**Email:** gogom8870@gmail.com  
**GitHub:** https://github.com/ahmed1998AM  
**Facebook:** https://www.facebook.com/profile.php?id=100049475271023&sk=followers  
**Copyright:** © 2025 Ahmed Mostafa Ibrahim — All Rights Reserved

## Overview
Finovate ERP Lite is a bilingual (Arabic/English) cloud-ready ERP system for SMEs with modular architecture across Accounting, Sales, Purchase, Inventory, HR, Projects, and Reporting.

## Key Features
- Arabic RTL + English LTR with locale-ready Next.js frontend.
- Dark/Light visual foundation with glassmorphism cards and modern dashboard.
- Multi-company and RBAC-ready backend architecture.
- Secure API baseline (JWT, helmet, rate limit, password hashing).
- Modular database schema for ERP entities and audit logs.
- Export-ready reporting API contracts (PDF/Excel/CSV/Word placeholders).
- PWA/offline-ready architecture path.

## Monorepo Structure
- `apps/web` — Next.js + TypeScript frontend (dashboard, auth, responsive UI shell).
- `apps/api` — Express.js backend modules (auth, ERP KPIs, reports).
- `prisma` — PostgreSQL relational schema.
- `.env.example` — environment variables.
- `docs/` — architecture and deployment guidance.

## Screenshots
- `[Placeholder]` Dashboard overview
- `[Placeholder]` Accounting module
- `[Placeholder]` Inventory module
- `[Placeholder]` HR module

## Installation
```bash
npm install
cp .env.example .env
npm run dev:api
npm run dev:web
```

## Usage
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`
- Health check: `GET /health`

## API Modules
- `/api/auth` — login, registration flow foundation.
- `/api/dashboard` — KPI and operational metrics.
- `/api/reports` — report export contracts.

## Deployment
### Frontend (Vercel/Netlify)
1. Import repository.
2. Root command: `npm run build --workspace apps/web`
3. Output: `.next`
4. Set `NEXT_PUBLIC_API_URL`

### Backend (Railway/Render)
1. Deploy `apps/api`
2. Build: `npm run build --workspace apps/api`
3. Start: `npm run start --workspace apps/api`
4. Configure `DATABASE_URL`, `JWT_SECRET`, SMTP vars.

## Technologies
- Next.js, React, TypeScript
- TailwindCSS-compatible styling baseline
- Express.js, JWT
- Prisma + PostgreSQL

## Enterprise Roadmap
- Complete CRUD for all modules.
- Real-time notifications via WebSocket.
- OCR + AI assistant integration.
- POS/Barcode integrations.
- Full testing (unit, integration, e2e) and CI/CD.
