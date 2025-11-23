import { Pool } from 'pg';

export async function getUserByEmail(pool: Pool, email: string) {
  const res = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  return res.rows[0] || null;
}
