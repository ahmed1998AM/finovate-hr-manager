# Finovate ERP Lite Architecture

## Core principles
- Domain-first module boundaries.
- Secure-by-default middleware stack.
- Multi-tenant data partitioning by `companyId`.
- API pagination/filter/search/sort conventions.

## Modules
1. Auth & Identity (JWT + RBAC + 2FA ready)
2. Accounting (journal, ledger, P&L, balance sheet)
3. Sales/Purchases lifecycle
4. Inventory with warehouse tracking and low-stock alerts
5. HR/payroll/task operations
6. Reporting + export service
7. Notification center (in-app/email/SMS-ready)

## Cloud readiness
- Stateless API pods
- Externalized object storage for files
- Queue workers for OCR/report exports
- Redis cache for dashboards and session metadata
