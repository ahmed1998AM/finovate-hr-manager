# خطة إنشاء المشروع من الصفر داخل المستودع

## 1) تهيئة المستودع
- إنشاء Monorepo باستخدام `pnpm` و `turbo`.
- ضبط أدوات الجودة الأساسية: ESLint + Prettier + Husky + lint-staged.
- إعداد إدارة المتغيرات البيئية عبر `.env.example`.

## 2) بناء التطبيقات الأساسية
- `apps/web`: واجهة المستخدم (Next.js + TypeScript + Tailwind).
- `apps/api`: واجهة برمجية (Node.js + Fastify أو NestJS + TypeScript).
- `packages/shared`: أنواع مشتركة و Utilities.

## 3) قاعدة البيانات
- اختيار PostgreSQL.
- إدارة المخطط عبر Prisma.
- إنشاء Migrations أولية (users, roles, employees, attendance, payroll).

## 4) نظام الهوية والصلاحيات
- تسجيل/دخول عبر JWT + Refresh Tokens.
- أدوار: Admin / HR Manager / Employee.
- حماية المسارات في API والواجهة.

## 5) وحدات نظام الموارد البشرية
- إدارة الموظفين (CRUD).
- الحضور والانصراف.
- الإجازات والموافقات.
- الرواتب الأساسية والتقارير.

## 6) الجودة والاختبارات
- Unit tests (Vitest/Jest).
- Integration tests للـ API.
- E2E للواجهة (Playwright).
- CI عبر GitHub Actions (lint + test + build).

## 7) النشر والتشغيل
- Docker Compose للتشغيل المحلي.
- نشر web/api على منصة سحابية.
- مراقبة السجلات والأخطاء.

## 8) خارطة تنفيذ زمنية مختصرة
- الأسبوع 1: البنية الأساسية + Auth.
- الأسبوع 2: Employees + Attendance.
- الأسبوع 3: Leaves + Payroll.
- الأسبوع 4: الاختبارات + التحسين + الإطلاق التجريبي.
