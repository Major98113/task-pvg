const {
  DB,
  TEST_DB,
  DB_HOST,
  TEST_DB_HOST,
  DB_USER,
  TEST_DB_USER,
  DB_PASSWORD,
  TEST_DB_PASSWORD
} = require('dotenv').config().parsed;

module.exports = {
  "development": {
    "username": DB_USER,
    "password": DB_PASSWORD,
    "database": DB,
    "host": DB_HOST,
    "dialect": "postgres"
  },
  "test": {
    "username": TEST_DB_USER,
    "password": TEST_DB_PASSWORD,
    "database": TEST_DB,
    "host": TEST_DB_HOST,
    "dialect": "postgres"
  },
  "production": {
    "username": DB_USER,
    "password": DB_PASSWORD,
    "database": DB,
    "host": DB_HOST,
    "dialect": "postgres"
  }
}
