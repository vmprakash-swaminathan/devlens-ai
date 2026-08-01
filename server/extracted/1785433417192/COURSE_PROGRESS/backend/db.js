const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'course_progress_db',
  password: 'prakash',
  port: 5432,
});

module.exports = pool;
