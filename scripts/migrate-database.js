// scripts/migrate-database.js
require('dotenv').config();
const { sequelize } = require('../models');

async function migrateDatabase() {
  try {
    console.log('Running database migrations...');
    await sequelize.sync({ alter: true });
    console.log('Database migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database migration failed:', error);
    process.exit(1);
  }
}

migrateDatabase();
