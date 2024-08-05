require("dotenv").config({
  path: "../../.env",
});
const { defineConfig } = require("drizzle-kit");
module.exports = {
  default: defineConfig({
    dialect: "postgresql",
    schema: "./db/schema.js",
    url: process.env.DATABASE_URL,
  }),
};
