const { sequelize, User, Task } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

describe('Sequelize Models', () => {
  it('should create a User', async () => {
    const user = await User.create({
      name: 'Model Test User',
      email: 'modeltest@example.com',
      password: 'SecurePassword123!',
    });

    expect(user.id).toBeDefined();
    expect(user.email).toBe('modeltest@example.com');
  });

  it('should create a Task', async () => {
    const user = await User.findOne({ where: { email: 'modeltest@example.com' } });

    const task = await Task.create({
      title: 'Test Task',
      description: 'This is a test task',
      status: 'pending',
      userId: user.id,
    });

    expect(task.id).toBeDefined();
    expect(task.title).toBe('Test Task');
  });
});

afterAll(async () => {
  await sequelize.close();
});
