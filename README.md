# Finovate ERP Lite

**Developed by:** Ahmed Mostafa Ibrahim  
**Brand:** Finovate – AHMED EG  
**Phone:** 01225155329  
**Email:** gogom8870@gmail.com  
**GitHub:** https://github.com/ahmed1998AM  
**Facebook:** https://www.facebook.com/profile.php?id=100049475271023&sk=followers  
**Copyright:** © 2025 Ahmed Mostafa Ibrahim — All Rights Reserved

## نظرة عامة | Overview
Finovate ERP Lite is a modern Arabic + English ERP starter platform for SMEs with scalable web architecture.

## Completed in this phase
- Bilingual-ready frontend shell with RTL/LTR switching and theme toggle.
- Responsive dashboard + ERP module cards with glass UI style.
- API modules for auth, accounting, inventory, HR, reports, notifications.
- Pagination/search-ready response conventions in REST endpoints.
- PostgreSQL schema for multi-company + RBAC + audit logs.

## Project Structure
- `apps/web`: Next.js frontend
- `apps/api`: Express API backend
- `prisma`: Database schema
- `docs`: Architecture docs

## Run locally
```bash
npm install
cp .env.example .env
npm run dev:api
npm run dev:web
```

## API base
- `GET /health`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/dashboard/kpis`
- `GET /api/accounting/journal-entries?page=1&pageSize=20`
- `GET /api/inventory/products?search=paper`
- `GET /api/hr/employees`
- `GET /api/reports/financial`
- `GET /api/notifications`

## Deployment
- Frontend: Vercel/Netlify
- Backend: Railway/Render
- Database: PostgreSQL/Supabase

## Next Steps
- Full CRUD persistence with Prisma client and migrations.
- JWT refresh tokens, 2FA, email verification flow.
- Advanced charts, Kanban board, OCR + AI assistant integrations.
