const request = require('supertest');
const app = require('../server');
const { sequelize, User } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Reset database before tests
});

describe('Authentication Tests', () => {
  let cookie; // Store session cookie

  it('should sign up a new user', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });

    expect(res.statusCode).toBe(201);
    expect(res.body.user).toHaveProperty('id');
  });

  it('should log in an existing user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login successful');
    cookie = res.headers['set-cookie']; // Save session cookie
  });

  it('should get the authenticated user', async () => {
    const res = await request(app).get('/auth/me').set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', 'test@example.com');
  });

  it('should log out the user', async () => {
    const res = await request(app).post('/auth/logout').set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Logout successful');
  });
});

afterAll(async () => {
  await sequelize.close();
});
