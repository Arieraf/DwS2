const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "personal_web",
  password: "111111",
  port: 5432,
  max: 5
});

module.exports = pool;