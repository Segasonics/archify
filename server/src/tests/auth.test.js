process.env.NODE_ENV = 'test';
process.env.PORT = '5002';
process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/archify_test';
process.env.JWT_ACCESS_SECRET = 'test_access_secret_123456';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_123456';
process.env.CLIENT_URL = 'http://localhost:5173';
process.env.CORS_ORIGIN = 'http://localhost:5173';

const request = require('supertest');
const app = require('../app');

describe('Auth routes', () => {
  it('responds on health check', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });
});

