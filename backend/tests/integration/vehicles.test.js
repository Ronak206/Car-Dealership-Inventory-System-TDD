const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const jwt = require('jsonwebtoken');

const getAuthToken = async (role = 'USER') => {
  const user = await User.create({
    name: 'Test User',
    email: `test-${role}-${Date.now()}@example.com`,
    password: 'hashedpasswordplaceholder',
    role,
  });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  return token;
};

describe('POST /api/vehicles', () => {
  it('should reject request with no token (401)', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .send({ make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 5 });

    expect(res.statusCode).toBe(401);
  });

  it('should create a vehicle with valid token and data (201)', async () => {
    const token = await getAuthToken();

    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({ make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 5 });

    expect(res.statusCode).toBe(201);
    expect(res.body.vehicle.make).toBe('Toyota');
    expect(res.body.vehicle.quantity).toBe(5);
  });

  it('should reject invalid data with 400', async () => {
    const token = await getAuthToken();

    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({ make: 'Toyota' }); // missing required fields

    expect(res.statusCode).toBe(400);
  });
});