const request = require('supertest');
const app = require('../../server'); // Import the Express app
const { sequelize, User } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Reset DB before tests
});

describe('Authentication API', () => {
  let testUser;

  it('should sign up a new user', async () => {
    const res = await request(app).post('/auth/signup').send({
      name: 'John Doe',
      email: 'test@example.com',
      password: 'Password123!',
    });

    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty('id');
    testUser = res.body.user;
  });

  it('should not allow duplicate email signup', async () => {
    const res = await request(app).post('/auth/signup').send({
      name: 'John Doe',
      email: 'test@example.com',
      password: 'Password123!',
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Email already exists');
  });

  it('should log in the user', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'test@example.com',
      password: 'Password123!',
    });

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('should fail login with incorrect password', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'test@example.com',
      password: 'WrongPassword',
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('should log out the user', async () => {
    const res = await request(app).post('/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Logout successful');
  });
});

afterAll(async () => {
  await sequelize.close(); // Close DB connection
});
