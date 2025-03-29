const request = require('supertest');
const app = require('../server');
const { sequelize, User, Task } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

describe('GraphQL API Tests', () => {
  let cookie;
  let taskId;

  it('should authenticate and return a session cookie', async () => {
    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'john@example.com', password: 'password123' });

    expect(res.statusCode).toBe(200);
    cookie = res.headers['set-cookie']; // Save session cookie
  });

  it('should not allow creating tasks without authentication', async () => {
    const res = await request(app).post('/graphql').send({
      query: `mutation { createTask(title: "Unauthorized Task", description: "No auth") { id } }`,
    });

    expect(res.body.errors[0].message).toBe('Not authenticated');
  });

  it('should create a new task for authenticated user', async () => {
    const res = await request(app)
      .post('/graphql')
      .set('Cookie', cookie)
      .send({
        query: `
          mutation {
            createTask(title: "Test Task", description: "This is a test task", status: "pending") {
              id
              title
            }
          }
        `,
      });

    expect(res.body.data.createTask).toHaveProperty('id');
    taskId = res.body.data.createTask.id;
  });

  it('should retrieve the created task', async () => {
    const res = await request(app)
      .post('/graphql')
      .set('Cookie', cookie)
      .send({
        query: `
          query {
            getTask(id: ${taskId}) {
              title
              description
              status
            }
          }
        `,
      });

    expect(res.body.data.getTask.title).toBe('Test Task');
  });

  it('should update the task', async () => {
    const res = await request(app)
      .post('/graphql')
      .set('Cookie', cookie)
      .send({
        query: `
          mutation {
            updateTask(id: ${taskId}, title: "Updated Task", description: "Updated description", status: "completed") {
              title
              status
            }
          }
        `,
      });

    expect(res.body.data.updateTask.title).toBe('Updated Task');
    expect(res.body.data.updateTask.status).toBe('completed');
  });

  it('should delete the task', async () => {
    const res = await request(app)
      .post('/graphql')
      .set('Cookie', cookie)
      .send({
        query: `
          mutation {
            deleteTask(id: ${taskId})
          }
        `,
      });

    expect(res.body.data.deleteTask).toBe('Task deleted successfully');
  });
});

afterAll(async () => {
  await sequelize.close();
});
