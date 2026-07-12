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

// POST 

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

// GET

describe('GET /api/vehicles', () => {
  it('should reject request with no token (401)', async () => {
    const res = await request(app).get('/api/vehicles');
    expect(res.statusCode).toBe(401);
  });

  it('should return a list of all vehicles with valid token', async () => {
    const token = await getAuthToken();

    await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({ make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 5 });

    await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({ make: 'Honda', model: 'Civic', category: 'Sedan', price: 22000, quantity: 3 });

    const res = await request(app)
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.vehicles)).toBe(true);
    expect(res.body.vehicles.length).toBe(2);
  });

  it('should return an empty array when no vehicles exist', async () => {
    const token = await getAuthToken();

    const res = await request(app)
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.vehicles).toEqual([]);
  });
});

// GET Search

describe('GET /api/vehicles/search', () => {
  const seedVehicles = async (token) => {
    await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({ make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 5 });

    await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({ make: 'Toyota', model: 'Fortuner', category: 'SUV', price: 35000, quantity: 2 });

    await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({ make: 'Honda', model: 'Civic', category: 'Sedan', price: 22000, quantity: 3 });
  };

  it('should reject request with no token (401)', async () => {
    const res = await request(app).get('/api/vehicles/search?make=Toyota');
    expect(res.statusCode).toBe(401);
  });

  it('should filter by make', async () => {
    const token = await getAuthToken();
    await seedVehicles(token);

    const res = await request(app)
      .get('/api/vehicles/search?make=Toyota')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.vehicles.length).toBe(2);
    expect(res.body.vehicles.every(v => v.make === 'Toyota')).toBe(true);
  });

  it('should filter by category', async () => {
    const token = await getAuthToken();
    await seedVehicles(token);

    const res = await request(app)
      .get('/api/vehicles/search?category=SUV')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.vehicles.length).toBe(1);
    expect(res.body.vehicles[0].category).toBe('SUV');
  });

  it('should filter by price range', async () => {
    const token = await getAuthToken();
    await seedVehicles(token);

    const res = await request(app)
      .get('/api/vehicles/search?minPrice=21000&maxPrice=40000')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.vehicles.length).toBe(2); // Fortuner (35000) + Civic (22000)
  });

  it('should combine multiple filters', async () => {
    const token = await getAuthToken();
    await seedVehicles(token);

    const res = await request(app)
      .get('/api/vehicles/search?make=Toyota&category=Sedan')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.vehicles.length).toBe(1);
    expect(res.body.vehicles[0].model).toBe('Corolla');
  });

  it('should return empty array when no vehicles match', async () => {
    const token = await getAuthToken();
    await seedVehicles(token);

    const res = await request(app)
      .get('/api/vehicles/search?make=Ferrari')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.vehicles).toEqual([]);
  });
});

// PUT

describe('PUT /api/vehicles/:id', () => {
  it('should reject request with no token (401)', async () => {
    const res = await request(app)
      .put('/api/vehicles/507f1f77bcf86cd799439011')
      .send({ price: 25000 });

    expect(res.statusCode).toBe(401);
  });

  it('should update vehicle fields with valid token (200)', async () => {
    const token = await getAuthToken();

    const createRes = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({ make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 5 });

    const vehicleId = createRes.body.vehicle._id;

    const res = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 25000, quantity: 8 });

    expect(res.statusCode).toBe(200);
    expect(res.body.vehicle.price).toBe(25000);
    expect(res.body.vehicle.quantity).toBe(8);
    expect(res.body.vehicle.make).toBe('Toyota'); // unchanged fields preserved
  });

  it('should return 404 when vehicle does not exist', async () => {
    const token = await getAuthToken();

    const res = await request(app)
      .put('/api/vehicles/507f1f77bcf86cd799439011') // valid ObjectId format, doesn't exist
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 25000 });

    expect(res.statusCode).toBe(404);
  });

  it('should return 400 for invalid id format', async () => {
    const token = await getAuthToken();

    const res = await request(app)
      .put('/api/vehicles/not-a-valid-id')
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 25000 });

    expect(res.statusCode).toBe(400);
  });
});