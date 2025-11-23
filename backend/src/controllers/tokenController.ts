import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export default function makeTokenController(deps: { refreshStore: Set<string>; signAccessToken: Function }) {
  const { refreshStore, signAccessToken } = deps;

  return async function token(req: Request, res: Response) {
    try {
      // Support both: refresh token in request body OR in cookie header (httpOnly cookie)
      let refreshToken = req.body?.refreshToken;
      if (!refreshToken && req.headers?.cookie) {
        // parse simple cookie string: 'a=1; b=2'
        const cookies = req.headers.cookie.split(';').map(c => c.trim());
        const found = cookies.find(c => c.startsWith('refreshToken='));
        if (found) refreshToken = decodeURIComponent(found.split('=')[1] || '');
      }

      if (!refreshToken) return res.status(401).json({ success: false, data: null, message: null, errors: ['Refresh token required'] });

      // Check the token exists in the server-side store (simple in-memory store)
      if (!refreshStore.has(refreshToken)) return res.status(403).json({ success: false, data: null, message: null, errors: ['Invalid refresh token'] });

      const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'CHANGE_ME_refresh_secret_!@#';

      jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err: any, payload: any) => {
        if (err) return res.status(403).json({ success: false, data: null, message: null, errors: ['Invalid or expired refresh token'] });

        // Payload should contain { id, email, role }
        const { id, email, role } = (payload || {}) as any;
        if (!id || !email) return res.status(400).json({ success: false, data: null, message: null, errors: ['Invalid token payload'] });

        const accessToken = signAccessToken({ id, email, role: role || 'user' });

        return res.json({ success: true, data: { accessToken }, message: 'New access token generated', errors: null });
      });
    } catch (err: any) {
      console.error('Token controller error:', err.message || err);
      return res.status(500).json({ success: false, data: null, message: null, errors: ['Server error'] });
    }
  };
}
