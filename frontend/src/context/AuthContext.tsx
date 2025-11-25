"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api, { setAuthToken, clearAuthToken } from "../lib/api";
import { ToastContainer } from 'react-toastify';

type LoginArgs = {
  accessToken: string;
  refreshToken?: string;
  userData?: any;
};

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  login: (accessToken: string, userData?: any, refreshToken?: string) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAuthReady: false,
  login: () => {},
  logout: () => {},
  refreshAccessToken: async () => false,
});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const router = useRouter();

  const login = (accessToken: string, userData?: any, rToken?: string) => {
    try {
      localStorage.setItem("accessToken", accessToken);
      if (rToken) localStorage.setItem("refreshToken", rToken);
    } catch (e) {}
    // debug
    try { console.debug("Auth: login - accessToken set, hasRefresh=", !!rToken); } catch (e) {}
    try {
      setAuthToken(accessToken);
    } catch (e) {}
    setUser(userData || { token: accessToken });
    if (rToken) setRefreshToken(rToken);
  };

  const logout = () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    } catch (e) {}
    try {
      clearAuthToken();
    } catch (e) {}
    setUser(null);
    setRefreshToken(null);
    // navigate to login
    router.push("/login");
  };

  // Try to refresh access token using refresh token (supports cookie-based or body-based)
  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const storedRefresh = refreshToken || localStorage.getItem("refreshToken");
      try { console.debug("Auth: refreshAccessToken - storedRefresh present=", !!storedRefresh); } catch (e) {}

      let resp;
      if (storedRefresh) {
        // If refresh token is available in localStorage (legacy), send it in body
        resp = await api.post("/api/auth/token", { refreshToken: storedRefresh });
      } else {
        // Otherwise assume refresh token is httpOnly cookie; call endpoint with credentials
        resp = await api.post("/api/auth/token", {});
      }

      const payload = resp.data;
      try { console.debug("Auth: refreshAccessToken - token endpoint response", payload); } catch (e) {}
      if (payload?.success && payload?.data?.accessToken) {
        const newAccess = payload.data.accessToken;
        try {
          localStorage.setItem("accessToken", newAccess);
        } catch (e) {}
        try { setAuthToken(newAccess); } catch (e) {}
        return true;
      }
      return false;
    } catch (err) {
      try { console.debug("Auth: refreshAccessToken - error", err); } catch (e) {}
      return false;
    }
  };

  useEffect(() => {
    // On mount try to restore auth: if accessToken exists set header and user;
    // otherwise if refreshToken exists attempt to get a new access token.
    let mounted = true;

    (async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedAccess = localStorage.getItem("accessToken");
        const storedRefresh = localStorage.getItem("refreshToken");

        if (storedRefresh) setRefreshToken(storedRefresh);

        if (storedAccess) {
          try { setAuthToken(storedAccess); } catch (e) {}
          if (mounted) {
            if (storedUser) setUser(JSON.parse(storedUser));
            else setUser({ token: storedAccess });
          }
        } else if (storedRefresh) {
          // attempt to refresh
          const ok = await refreshAccessToken();
          if (ok && mounted) {
            const newAccess = localStorage.getItem("accessToken");
            if (newAccess) {
              try {
                setAuthToken(newAccess);
              } catch (e) {}
              if (storedUser) setUser(JSON.parse(storedUser));
              else setUser({ token: newAccess });
            }
          }
        }
      } catch (e) {
        // ignore
      }
      // mark initialization complete regardless of success/failure
      try { setIsAuthReady(true); } catch (e) {}
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Persist user in localStorage
  useEffect(() => {
    try {
      if (user) localStorage.setItem("user", JSON.stringify(user));
      else localStorage.removeItem("user");
    } catch (e) {
      // ignore
    }
  }, [user]);

  // NOTE: axios response interceptor and refresh queue are implemented in `lib/api.ts`.
  // AuthContext retains `refreshAccessToken` for initialization and explicit calls.

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isAuthReady, login, logout, refreshAccessToken }}>
      {children}
      <ToastContainer position="top-right" />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
