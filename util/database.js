const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// Localhost connection
const database = new Sequelize({
  host: process.env.DB_HOST, // localhost
  username: process.env.DB_USER, // postgres
  password: process.env.DB_PASSWORD,
  port: 5432,
  database: process.env.DB, // example
  dialect: 'postgres',
  logging: false,
  dialectOptions:
    process.env.NODE_ENV === 'production'
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      : {}
});

module.exports = { database };
