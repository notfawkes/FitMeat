import { Router, Request, Response } from 'express';
import { query, pool } from '../db';
import fs from 'fs';
import path from 'path';

const router = Router();

// Whitelist of valid tables to prevent SQL injection
const VALID_TABLES = [
  'categories', 'products', 'product_nutrition', 'inventory',
  'shipping_addresses', 'orders', 'order_items', 'payments',
  'reviews', 'ingredients', 'product_ingredients', 'suppliers',
  'ingredient_suppliers', 'dietary_preferences', 'product_dietary_preferences',
  'subscriptions', 'profiles'
];

// Dangerous: Sync endpoint to fix the DB state
router.post('/sync', async (req: Request, res: Response) => {
  try {
    const sqlPath = path.join(__dirname, '../../../data.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    const client = await pool.connect();
    try {
      await client.query(sql);
      res.json({ message: 'Database synced successfully with data.sql!' });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Failed to sync database', details: error.message });
  }
});

// Dynamic GET for all tables
router.get('/:table', async (req: Request, res: Response) => {
  const { table } = req.params;
  
  if (!VALID_TABLES.includes(table)) {
    return res.status(400).json({ error: 'Invalid or unauthorized table request' });
  }

  try {
    // If the table is products, let's join nutrition and categories to match the Supabase nested response style
    if (table === 'products') {
      const result = await query(`
        SELECT p.*, 
          json_build_object('name', c.name) as categories,
          json_build_array(json_build_object('protein', pn.protein, 'carbs', pn.carbs, 'fats', pn.fats, 'calories', pn.calories)) as product_nutrition
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN product_nutrition pn ON p.id = pn.product_id
      `);
      return res.json(result.rows);
    }
    
    // Otherwise generic dump
    const result = await query(`SELECT * FROM ${table}`);
    res.json(result.rows);
  } catch (error) {
    console.error(`Error querying ${table}:`, error);
    res.status(500).json({ error: 'Internal server error during DB query' });
  }
});

export default router;
