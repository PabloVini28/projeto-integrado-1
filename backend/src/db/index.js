const { Pool } = require('pg');
require('dotenv').config({ path: process.env.DOTENV_PATH || undefined });

const connectionString = process.env.DATABASE_URL || (
  `postgresql://${process.env.POSTGRES_USER || 'pguser'}:${process.env.POSTGRES_PASSWORD || 'pgpassword'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.POSTGRES_DB || 'projeto_db'}`
);
const pool = new Pool({ connectionString });

async function init() {
  // Test the database connection
  await pool.query('SELECT NOW()');
  console.log('Banco de dados conectado com sucesso');
}



module.exports = { pool, init };
