import { Pool } from 'pg';

export async function createUser(pool: Pool, firstName: string, lastName: string, email: string, passwordHash: string, role = 'user') {
  const res = await pool.query(
    `INSERT INTO users (first_name, last_name, email, password, role) VALUES ($1,$2,$3,$4,$5) RETURNING id, first_name, last_name, email, role`,
    [firstName, lastName, email, passwordHash, role]
  );
  return res.rows[0];
}
