const { Task, User } = require('../models');
const bcrypt = require('bcryptjs');

/**
 * Checks if a user is authenticated.
 * @param {Object} req - The request object.
 * @throws {Error} If user is not authenticated.
 */
function requireAuth(req) {
  if (!req.session.userId) {
    throw new Error('Authentication required. Please log in.');
  }
}

/**
 * GraphQL Resolvers
 * @type {Object}
 */
const resolvers = {
  Query: {
    /**
     * Retrieves the currently authenticated user.
     * @async
     * @param {null} _ - Unused parent parameter.
     * @param {null} __ - Unused arguments parameter.
     * @param {Object} context - The GraphQL context.
     * @param {Object} context.req - The request object.
     * @returns {Promise<User|null>} The current user.
     */
    async me(_, __, { req }) {
      requireAuth(req);
      const user = await User.findByPk(req.session.userId);
      if (!user) throw new Error('User not found');
      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    },

    /**
     * Retrieves all tasks for the authenticated user.
     * @async
     * @param {null} _ - Unused parent parameter.
     * @param {null} __ - Unused arguments parameter.
     * @param {Object} context - The GraphQL context.
     * @param {Object} context.req - The request object.
     * @returns {Promise<Task[]>} A list of tasks.
     */
    async getTasks(_, __, { req }) {
      requireAuth(req);
      return Task.findAll({ where: { userId: req.session.userId } });
    },

    /**
     * Retrieves a single task by ID for the authenticated user.
     * @async
     * @param {null} _ - Unused parent parameter.
     * @param {Object} args - Query arguments.
     * @param {string} args.id - The ID of the task.
     * @param {Object} context - The GraphQL context.
     * @param {Object} context.req - The request object.
     * @returns {Promise<Task|null>} The requested task.
     */
    async getTask(_, { id }, { req }) {
      requireAuth(req);
      return Task.findOne({ where: { id, userId: req.session.userId } });
    },
  },

  Mutation: {
    /**
     * Registers a new user.
     * @async
     * @param {null} _ - Unused parent parameter.
     * @param {Object} args - Mutation arguments.
     * @param {string} args.name - The name of the user.
     * @param {string} args.email - The email of the user.
     * @param {string} args.password - The password of the user.
     * @returns {Promise<User>} The created user.
     */
    async signup(_, { name, email, password }) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) throw new Error('User already exists.');

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashedPassword });

      return { id: user.id, name: user.name, email: user.email };
    },

    /**
     * Logs in a user and sets the session.
     * @async
     * @param {null} _ - Unused parent parameter.
     * @param {Object} args - Mutation arguments.
     * @param {string} args.email - The email of the user.
     * @param {string} args.password - The password of the user.
     * @param {Object} context - The GraphQL context.
     * @param {Object} context.req - The request object.
     * @returns {Promise<string>} A success message.
     */
    async login(_, { email, password }, { req }) {
      const user = await User.findOne({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials.');
      }

      req.session.userId = user.id;

      // Ensure session is saved before returning response
      return new Promise((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(new Error('Login failed.'));
          resolve('Login successful');
        });
      });
    },

    /**
     * Logs out the authenticated user.
     * @async
     * @param {null} _ - Unused parent parameter.
     * @param {null} __ - Unused arguments parameter.
     * @param {Object} context - The GraphQL context.
     * @param {Object} context.req - The request object.
     * @returns {Promise<string>} A success message.
     */
    async logout(_, __, { req }) {
      requireAuth(req);

      return new Promise((resolve, reject) => {
        req.session.destroy((err) => {
          if (err) reject(new Error('Logout failed.'));
          resolve('Logout successful');
        });
      });
    },

    /**
     * Creates a new task for the authenticated user.
     * @async
     * @param {null} _ - Unused parent parameter.
     * @param {Object} args - Mutation arguments.
     * @param {string} args.title - The task title.
     * @param {string} args.description - The task description.
     * @param {string} args.status - The task status.
     * @param {Object} context - The GraphQL context.
     * @param {Object} context.req - The request object.
     * @returns {Promise<Task>} The newly created task.
     */
    async createTask(_, { title, description, status }, { req }) {
      requireAuth(req);
      return Task.create({
        title,
        description,
        status,
        userId: req.session.userId,
      });
    },

    /**
     * Updates an existing task.
     * @async
     * @param {null} _ - Unused parent parameter.
     * @param {Object} args - Mutation arguments.
     * @param {string} args.id - The task ID.
     * @param {string} [args.title] - The new title (optional).
     * @param {string} [args.description] - The new description (optional).
     * @param {string} [args.status] - The new status (optional).
     * @param {Object} context - The GraphQL context.
     * @param {Object} context.req - The request object.
     * @returns {Promise<Task>} The updated task.
     */
    async updateTask(_, { id, title, description, status }, { req }) {
      requireAuth(req);

      const task = await Task.findOne({ where: { id, userId: req.session.userId } });
      if (!task) throw new Error('Task not found.');

      await task.update({ title, description, status });
      return task;
    },

    /**
     * Deletes a task.
     * @async
     * @param {null} _ - Unused parent parameter.
     * @param {Object} args - Mutation arguments.
     * @param {string} args.id - The task ID.
     * @param {Object} context - The GraphQL context.
     * @param {Object} context.req - The request object.
     * @returns {Promise<string>} A success message.
     */
    async deleteTask(_, { id }, { req }) {
      requireAuth(req);
      await Task.destroy({ where: { id, userId: req.session.userId } });
      return 'Task deleted successfully';
    },
  },
};

module.exports = resolvers;
