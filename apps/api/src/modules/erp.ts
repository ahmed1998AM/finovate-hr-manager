import { Router } from 'express';

export const erpRouter = Router();

const withMeta = (rows: unknown[], page: number, pageSize: number) => ({
  data: rows,
  meta: { page, pageSize, total: rows.length }
});

erpRouter.get('/dashboard/kpis', (_req, res) => {
  res.json({
    revenue: 1240500,
    expenses: 730320,
    netProfit: 510180,
    pendingInvoices: 36,
    employeesActive: 82,
    lowStockAlerts: 12,
    taxSummary: 14600
  });
});

erpRouter.get('/accounting/journal-entries', (req, res) => {
  const page = Number(req.query.page ?? 1);
  const pageSize = Number(req.query.pageSize ?? 20);
  const rows = [{ id: 'JE-001', debit: 2500, credit: 2500, reference: 'Sales batch close' }];
  res.json(withMeta(rows, page, pageSize));
});

erpRouter.get('/inventory/products', (req, res) => {
  const search = String(req.query.search ?? '').toLowerCase();
  const rows = [{ sku: 'ITM-001', name: 'Thermal Paper', qty: 8, warehouse: 'Main' }].filter((r) =>
    r.name.toLowerCase().includes(search)
  );
  res.json(withMeta(rows, 1, 20));
});

erpRouter.get('/hr/employees', (_req, res) => {
  res.json(withMeta([{ id: 'EMP-1', name: 'Fatima Ali', department: 'Finance', status: 'Active' }], 1, 20));
});

erpRouter.get('/reports/financial', (_req, res) => {
  res.json({ exports: ['pdf', 'excel', 'csv', 'word'], vatSummary: 14600, cashflow: 'positive' });
});

erpRouter.get('/notifications', (_req, res) => {
  res.json(withMeta([{ id: 'N-1', title: 'Low stock', channel: 'in-app', read: false }], 1, 20));
});
