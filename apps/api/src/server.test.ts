import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from './server';

test('health endpoint returns ok', async () => {
  const app = createApp();
  const response = await request(app).get('/health');
  assert.equal(response.status, 200);
  assert.equal(response.body.status, 'ok');
});

test('kpi endpoint includes netProfit', async () => {
  const app = createApp();
  const response = await request(app).get('/api/dashboard/kpis');
  assert.equal(response.status, 200);
  assert.ok(response.body.netProfit > 0);
});
