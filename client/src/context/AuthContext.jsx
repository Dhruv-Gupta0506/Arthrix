import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";
import { TOKEN_KEY } from "../lib/utils";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const isTokenExpired = useCallback((jwt) => {
    try {
      const { exp } = jwtDecode(jwt);
      if (!exp) return false;
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  }, []);

  const decodeAndSetUserId = useCallback((jwt) => {
    try {
      const payload = jwtDecode(jwt);
      const id = payload.sub;
      setUserId(id);
      return id;
    } catch (err) {
      console.error("Failed to decode JWT:", err);
      return null;
    }
  }, []);

  const fetchProfile = useCallback(async (id) => {
    if (!id) return null;
    try {
      const res = await api.get(`/api/users/${id}/profile`);
      const profile = res.data?.data ?? null;
      setUser(profile);
      return profile;
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      return null;
    }
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setUserId(null);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearSession();
      navigate("/", { replace: true });
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [clearSession, navigate]);

  useEffect(() => {
    const init = async () => {
      const existing = localStorage.getItem(TOKEN_KEY);
      if (existing && !isTokenExpired(existing)) {
        const id = decodeAndSetUserId(existing);
        await fetchProfile(id);
      } else if (existing) {
        localStorage.removeItem(TOKEN_KEY);
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
      const profile = await fetchProfile(id);
      return { userId: id, profile };
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
      clearSession();
      navigate("/", { replace: true });
    }
  }, [token, clearSession, navigate]);

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