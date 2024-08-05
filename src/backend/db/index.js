const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../../../.env"),
});
const { drizzle } = require("drizzle-orm/node-postgres");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

module.exports = { db };
