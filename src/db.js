const { Pool } = require('pg');

const {
  POSTGRESDB_USER,
  POSTGRESDB_HOST,
  POSTGRESDB_DATABASE,
  POSTGRESDB_ROOT_PASSWORD,
  POSTGRESDB_DOCKER_PORT,
  NODE_ENV,
} = process.env;

const pool = new Pool({
  host: POSTGRESDB_HOST,
  port: POSTGRESDB_DOCKER_PORT,
  user: POSTGRESDB_USER,
  password: POSTGRESDB_ROOT_PASSWORD,
  database: POSTGRESDB_DATABASE
});

if (NODE_ENV === 'local') {
  const createUsersTable = async () => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(30) not null,
        email VARCHAR(255) UNIQUE not null,
        password VARCHAR(255) not null
      )
    `);
  };

  const checkUsersTableExists = async () => {
    const result = await pool.query("SELECT to_regclass('public.users')");
    if (!result.rows[0].to_regclass) await createUsersTable();
  };

  const initDatabase = async () => {
    await checkUsersTableExists();
  };

  initDatabase();
}

module.exports = pool;