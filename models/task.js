/**
 * Task model definition
 * @module models/Task
 */
module.exports = (sequelize, DataTypes) => {
  /**
   * Represents a Task.
   * @typedef {Object} Task
   * @property {string} id - The unique ID of the task.
   * @property {string} title - The title of the task.
   * @property {string} description - The task description.
   * @property {'pending' | 'in-progress' | 'completed'} status - The task status.
   * @property {string} userId - The ID of the user who owns the task.
   */
  const Task = sequelize.define('Task', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
      defaultValue: 'pending',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  Task.associate = (models) => {
    Task.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Task;
};
