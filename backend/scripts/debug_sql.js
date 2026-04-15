const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const sqlPath = path.join(__dirname, '../../data.sql');
    console.log(`Reading SQL from ${sqlPath}`);
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Executing SQL...');
    await pool.query(sql);
    console.log('Execution successful!');
  } catch (error) {
    console.error('Failed to run sql script:', error);
  } finally {
    await pool.end();
  }
}

run();
