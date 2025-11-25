import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { getUserByEmail } from '../db/login';

export default function makeLoginController(deps: { pool: any; signAccessToken: Function; signRefreshToken: Function; refreshStore: Set<string> }) {
  const { pool, signAccessToken, signRefreshToken, refreshStore } = deps;

  return async function login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ success: false, data: null, message: null, errors: ['email and password required'] });

      const user = await getUserByEmail(pool, email);
      if (!user) return res.status(400).json({ success: false, data: null, message: null, errors: ['Invalid email and password!'] });
 
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(400).json({ success: false, data: null, message: null, errors: ['Invalid email and password!'] });

      const name = (user.first_name || user.name) ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : undefined;
      const accessToken = signAccessToken({ id: user.id, email: user.email, name, role: user.role || 'user' });
      const refreshToken = signRefreshToken({ id: user.id, email: user.email, role: user.role || 'user' });
      refreshStore.add(refreshToken);

      return res.json({ success: true, data: { id: user.id, firstName: user.first_name, lastName: user.last_name, email: user.email, role: user.role }, message: 'Logged in successfully', accessToken, refreshToken, errors: null });
    } catch (err: any) {
      console.error('Login controller error:', err.message || err);
      return res.status(500).json({ success: false, data: null, message: null, errors: ['Server error'] });
    }
  };
}
