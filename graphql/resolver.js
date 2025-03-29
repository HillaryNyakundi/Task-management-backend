const { Task } = require('../models');

const resolvers = {
  Query: {
    async getTasks(_, __, { req }) {
      if (!req.session.userId)
        throw new Error('Authentication required. Please log in.');
      return Task.findAll({ where: { userId: req.session.userId } });
    },

    async getTask(_, { id }, { req }) {
      if (!req.session.userId)
        throw new Error('Authentication required. Please log in.');

      const task = await Task.findOne({ where: { id, userId: req.session.userId } });
      return task || null; // Return null instead of throwing an error
    },
  },

  Mutation: {
    async createTask(_, { title, description, status }, { req }) {
      if (!req.session.userId)
        throw new Error('Authentication required. Please log in.');

      return Task.create({
        title,
        description,
        status,
        userId: req.session.userId,
      });
    },

    async updateTask(_, { id, title, description, status }, { req }) {
      if (!req.session.userId)
        throw new Error('Authentication required. Please log in.');

      const task = await Task.findOne({ where: { id, userId: req.session.userId } });
      if (!task)
        throw new Error(
          'Task does not exist or you do not have permission to modify it.'
        );

      await task.update({ title, description, status });
      return task;
    },

    async deleteTask(_, { id }, { req }) {
      if (!req.session.userId)
        throw new Error('Authentication required. Please log in.');

      const task = await Task.findOne({ where: { id, userId: req.session.userId } });
      if (!task)
        throw new Error(
          'Task does not exist or you do not have permission to delete it.'
        );

      await task.destroy();
      return 'Task deleted successfully';
    },
  },
};

module.exports = resolvers;
