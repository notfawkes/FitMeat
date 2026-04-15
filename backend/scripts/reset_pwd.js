const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await pool.query('UPDATE users SET hashed_password = $1 WHERE email = $2', [hashedPassword, 'alice@example.com']);
    console.log('Alice password reset to password123');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

run();
