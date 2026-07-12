const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');

// Register Test
describe('POST /api/auth/register', () => {
  it('should create a new user and return 201', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Ronak Patel',
        email: 'ronak@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe('ronak@example.com');
    expect(res.body.user).not.toHaveProperty('password'); // never leak password hash
  });

  it('should hash the password before storing it', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Ronak Patel',
        email: 'hash-check@example.com',
        password: 'password123',
      });

    const savedUser = await User.findOne({ email: 'hash-check@example.com' });
    expect(savedUser.password).not.toBe('password123');
    expect(savedUser.password.length).toBeGreaterThan(20); // bcrypt hashes are long
  });

  it('should reject duplicate email with 409', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'First User',
        email: 'duplicate@example.com',
        password: 'password123',
      });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Second User',
        email: 'duplicate@example.com',
        password: 'differentpass',
      });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch(/already exists|already registered/i);
  });
});


// Login Test

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Login Test User',
        email: 'login-test@example.com',
        password: 'correctpassword',
      });
  });

  it('should return a JWT on valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login-test@example.com',
        password: 'correctpassword',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  it('should reject wrong password with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login-test@example.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/invalid/i);
  });

  it('should reject non-existent email with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'doesnotexist@example.com',
        password: 'anypassword',
      });

    expect(res.statusCode).toBe(401);
  });
});