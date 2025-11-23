"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api"; // normal import, no dynamic import

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function doLogout() {
      try {
        const refreshToken = localStorage.getItem("refreshToken");

        // Call backend logout, send refresh token so backend removes it
        await api.post("/api/auth/logout", { refreshToken });
      } catch (e) {
        // Ignore logout errors
      }

      // Clear client storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      // Clear non-httpOnly cookies (if any exist)
      document.cookie = `accessToken=; Path=/; Max-Age=0`;
      document.cookie = `refreshToken=; Path=/; Max-Age=0`;

      if (mounted) router.push("/login");
    }

    doLogout();

    return () => { mounted = false; };
  }, [router]);

  return null;
}
