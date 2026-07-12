const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const jwt = require('jsonwebtoken');

const getAuthToken = async (role = 'USER') => {
  const user = await User.create({
    name: 'Test User',
    email: `test-${role}-${Date.now()}-${Math.random()}@example.com`,
    password: 'hashedpasswordplaceholder',
    role,
  });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  return token;
};

// Purchase

describe('POST /api/vehicles/:id/purchase', () => {
  it('should reject request with no token (401)', async () => {
    const res = await request(app).post('/api/vehicles/507f1f77bcf86cd799439011/purchase');
    expect(res.statusCode).toBe(401);
  });

  it('should decrement quantity by 1 on successful purchase', async () => {
    const token = await getAuthToken();

    const createRes = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({ make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 5 });

    const vehicleId = createRes.body.vehicle._id;

    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.vehicle.quantity).toBe(4);
  });

  it('should fail with 400 when quantity is already 0', async () => {
    const token = await getAuthToken();

    const createRes = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({ make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 0 });

    const vehicleId = createRes.body.vehicle._id;

    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/out of stock|no stock|quantity/i);
  });

  it('should return 404 when vehicle does not exist', async () => {
    const token = await getAuthToken();

    const res = await request(app)
      .post('/api/vehicles/507f1f77bcf86cd799439011/purchase')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });

  it('should return 400 for invalid id format', async () => {
    const token = await getAuthToken();

    const res = await request(app)
      .post('/api/vehicles/not-a-valid-id/purchase')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
  });
});

// Restock

describe('POST /api/vehicles/:id/restock', () => {
  it('should reject request with no token (401)', async () => {
    const res = await request(app)
      .post('/api/vehicles/507f1f77bcf86cd799439011/restock')
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(401);
  });

  it('should reject non-admin user with 403', async () => {
    const token = await getAuthToken('USER');

    const createRes = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({ make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 5 });

    const vehicleId = createRes.body.vehicle._id;

    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(403);
  });

  it('should increment quantity with admin token (200)', async () => {
    const adminToken = await getAuthToken('ADMIN');

    const createRes = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 3 });

    const vehicleId = createRes.body.vehicle._id;

    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 10 });

    expect(res.statusCode).toBe(200);
    expect(res.body.vehicle.quantity).toBe(13); // 3 + 10
  });

  it('should reject restock with missing or invalid quantity (400)', async () => {
    const adminToken = await getAuthToken('ADMIN');

    const createRes = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 3 });

    const vehicleId = createRes.body.vehicle._id;

    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: -5 });

    expect(res.statusCode).toBe(400);
  });

  it('should return 404 when vehicle does not exist', async () => {
    const adminToken = await getAuthToken('ADMIN');

    const res = await request(app)
      .post('/api/vehicles/507f1f77bcf86cd799439011/restock')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(404);
  });

  it('should return 400 for invalid id format', async () => {
    const adminToken = await getAuthToken('ADMIN');

    const res = await request(app)
      .post('/api/vehicles/not-a-valid-id/restock')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(400);
  });
});