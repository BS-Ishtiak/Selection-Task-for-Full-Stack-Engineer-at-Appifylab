import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { createUser } from '../db/registration';
import { getUserByEmail } from '../db/login';

export default function makeRegistrationController(deps: { pool: any }) {
  const { pool } = deps;

  return async function register(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, password, role } = req.body as any;
      if (!firstName || !lastName || !email || !password) return res.status(400).json({ success: false, data: null, message: null, errors: ['firstName, lastName, email, password are required'] });

      const existing = await getUserByEmail(pool, email);
      if (existing) return res.status(400).json({ success: false, data: null, message: null, errors: ['Email already exists!'] });

      const hashed = await bcrypt.hash(password, 10);
      const user = await createUser(pool, firstName, lastName, email, hashed, role || 'user');
      return res.json({ success: true, data: user, message: 'User registered successfully!', errors: null });
    } catch (err: any) {
      console.error('Registration controller error:', err.message || err);
      return res.status(500).json({ success: false, data: null, message: null, errors: ['Server error'] });
    }
  };
}
