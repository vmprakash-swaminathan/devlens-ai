const { Pool } = require("pg");
require("dotenv").config();

const isCloudDb = process.env.NODE_ENV === "production" || !!process.env.RENDER || (process.env.DB_HOST && process.env.DB_HOST !== "localhost" && process.env.DB_HOST !== "127.0.0.1");

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: isCloudDb ? { rejectUnauthorized: false } : false,
    }
  : {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: isCloudDb ? { rejectUnauthorized: false } : false,
    };

const pool = new Pool(poolConfig);

pool.connect()
  .then(() => {
    console.log("✅ PostgreSQL Connected Successfully");
  })
  .catch((err) => {
    console.error("❌ Database Connection Failed:", err.message);
  });

module.exports = pool;