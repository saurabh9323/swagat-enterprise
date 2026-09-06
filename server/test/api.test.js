import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();
app.locals.databaseReady = false;

test('health reports memory fallback when PostgreSQL is not configured', async () => {
  const response = await request(app).get('/api/health').expect(200);

  assert.equal(response.body.ok, true);
  assert.equal(response.body.database, 'memory');
});

test('public properties endpoint preserves array response contract', async () => {
  const response = await request(app).get('/api/properties').expect(200);

  assert.equal(Array.isArray(response.body), true);
  assert.equal(response.body[0].id, 'SE-NAL-101');
  assert.equal(typeof response.body[0].image, 'string');
});

test('protected property creation rejects unauthenticated requests', async () => {
  const response = await request(app)
    .post('/api/properties')
    .send({ title: 'Unauthorized property' })
    .expect(401);

  assert.equal(response.body.success, false);
});

test('public lead creation validates customer name', async () => {
  const response = await request(app)
    .post('/api/leads')
    .send({ phone: '9999999999' })
    .expect(400);

  assert.equal(response.body.success, false);
});

test('public lead creation remains available without admin authentication', async () => {
  const response = await request(app)
    .post('/api/leads')
    .send({
      name: 'Test Customer',
      phone: '9999999999',
      need: '1 BHK in Nalasopara East',
      source: 'Website',
    })
    .expect(201);

  assert.equal(response.body.name, 'Test Customer');
  assert.equal(response.body.status, 'New');
});
