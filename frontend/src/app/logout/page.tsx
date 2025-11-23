"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    let mounted = true;
    async function doLogout() {
      try {
        // Send refresh token to backend to invalidate server-side store (if you store it there)
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
        if (refreshToken) {
          await import('../../lib/api').then(({ default: api }) => api.post('/api/auth/logout', { refreshToken }));
        } else {
          // Still call logout to clear any cookies (if any)
          await import('../../lib/api').then(({ default: api }) => api.post('/api/auth/logout'));
        }
      } catch (e) {
        // ignore network errors during logout
      }

      // Clear client-side storage and non-HttpOnly cookies
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        document.cookie = `accessToken=; Path=/; Max-Age=0`;
        document.cookie = `refreshToken=; Path=/; Max-Age=0`;
      }

      if (mounted) router.push('/login');
    }

    doLogout();
    return () => { mounted = false; };
  }, [router, API_BASE]);

  return null;
}
