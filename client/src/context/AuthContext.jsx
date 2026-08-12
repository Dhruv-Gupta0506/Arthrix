import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";
import { TOKEN_KEY } from "../lib/utils";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const decodeAndSetUserId = useCallback((jwt) => {
    try {
      const payload = jwtDecode(jwt);
      // Backend only sets .subject(userId) — no custom "userId" claim exists
      const id = payload.sub;
      setUserId(id);
      return id;
    } catch (err) {
      console.error("Failed to decode JWT:", err);
      return null;
    }
  }, []);

  const fetchProfile = useCallback(async (id) => {
    if (!id) return;
    try {
      const res = await api.get(`/api/users/${id}/profile`);
      setUser(res.data?.data ?? null);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const existing = localStorage.getItem(TOKEN_KEY);
      if (existing) {
        const id = decodeAndSetUserId(existing);
        await fetchProfile(id);
      }
      setLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    async (jwt) => {
      localStorage.setItem(TOKEN_KEY, jwt);
      setToken(jwt);
      const id = decodeAndSetUserId(jwt);
      await fetchProfile(id);
    },
    [decodeAndSetUserId, fetchProfile]
  );

  const logout = useCallback(async () => {
    try {
      if (token) {
        await api.post("/api/auth/logout");
      }
    } catch (err) {
      console.error("Logout call failed, clearing session locally anyway:", err);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
      setUserId(null);
      window.location.href = "/";
    }
  }, [token]);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setUserId(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, user, userId, loading, login, logout, clearSession, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}