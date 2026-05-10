import { Router } from 'express';

export const erpRouter = Router();

erpRouter.get('/dashboard/kpis', (_req, res) => {
  res.json({
    revenue: 1240500,
    expenses: 730320,
    netProfit: 510180,
    pendingInvoices: 36,
    employeesActive: 82,
    lowStockAlerts: 12
  });
});

erpRouter.get('/reports/financial', (_req, res) => {
  res.json({ exports: ['pdf', 'excel', 'csv', 'word'], vatSummary: 14600, cashflow: 'positive' });
});
