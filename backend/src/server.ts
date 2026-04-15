import app from './app';
import { config } from './config';
import { pool } from './db';
import fs from 'fs';
import path from 'path';

const port = Number(process.env.PORT ?? 4000);

async function syncDB() {
  try {
    const sqlPath = path.join(__dirname, '../../data.sql');
    if (fs.existsSync(sqlPath)) {
       const sql = fs.readFileSync(sqlPath, 'utf8');
       await pool.query(sql);
       console.log('Successfully synced data.sql to local Postgres instance!');
    }
  } catch(e) {
    console.error('Failed to auto-sync db:', e);
  }
}

app.listen(port, async () => {
  await syncDB();
  console.log(`FitMeat auth backend listening on http://localhost:${port}`);
});
