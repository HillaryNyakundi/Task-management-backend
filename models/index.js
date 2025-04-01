const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config')[process.env.NODE_ENV || 'development'];

console.log('Sequelize connecting to:', process.env.DATABASE_URL || config.database); //Log connection URL

let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// ✅ Import models
const UserModel = require('./user');
const TaskModel = require('./task');

// ✅ Initialize models
const User = UserModel(sequelize, DataTypes);
const Task = TaskModel(sequelize, DataTypes);

// ✅ Define associations
User.hasMany(Task, { foreignKey: 'userId', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'userId' });

// ✅ Attach models to db object
const db = { sequelize, Sequelize, User, Task };

// ✅ Export db object
module.exports = db;
