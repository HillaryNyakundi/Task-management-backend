/**
 * User model definition
 * @module models/User
 */
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  /**
   * Represents a User.
   * @typedef {Object} User
   * @property {string} id - The unique ID of the user.
   * @property {string} name - The name of the user.
   * @property {string} email - The email of the user.
   * @property {string} password - The hashed password of the user.
   */
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return User;
};
