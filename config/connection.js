const Sequelize = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.JAWSDB_URL) {
  // Use JAWSDB_URL for Heroku deployment.
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  // Use local environment variables for local development.
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    dialectOptions: {
      requestTimeout: 3600000,
    },
  });
}

module.exports = sequelize;
