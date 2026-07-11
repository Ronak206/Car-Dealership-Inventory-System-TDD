const request = require('supertest');
const app = require('../../src/app');

describe('GET /api/health', () => {
  it('should return 200 with a status ok message', async () => {
    const res = await request(app).get('/api/health');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});