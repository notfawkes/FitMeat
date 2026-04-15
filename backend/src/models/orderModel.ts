import { pool, query } from '../db';

export interface OrderRecord {
  id: string;
  user_id: string;
  order_date: string;
  total_amount: number;
  items: any;
  status: string;
}

export async function createOrder(
  userId: string,
  totalAmount: number,
  items: any[],
  status: string
): Promise<OrderRecord> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const orderRes = await client.query(
      'INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING *',
      [userId, totalAmount, status]
    );
    const order = orderRes.rows[0];

    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)',
        [order.id, item.id, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');
    return { ...order, items };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function findOrdersByUserId(userId: string): Promise<OrderRecord[]> {
  const result = await query<OrderRecord>(
    `SELECT o.*, 
            COALESCE(
              json_agg(
                json_build_object(
                  'id', oi.product_id, 
                  'quantity', oi.quantity, 
                  'price', oi.unit_price
                )
              ) FILTER (WHERE oi.id IS NOT NULL), '[]'
            ) as items
     FROM orders o
     LEFT JOIN order_items oi ON o.id = oi.order_id
     WHERE o.user_id = $1 
     GROUP BY o.id
     ORDER BY o.order_date DESC`,
    [userId]
  );
  return result.rows;
}

