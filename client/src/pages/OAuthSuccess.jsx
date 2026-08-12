import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const hasRun = useRef(false);

  useEffect(() => {
    // Guard against React StrictMode double-invoking this effect in dev
    if (hasRun.current) return;
    hasRun.current = true;

    const token = searchParams.get("token");

    if (!token) {
      setError("No token found in the redirect URL.");
      return;
    }

    const run = async () => {
      try {
        await login(token);
        navigate("/dashboard", { replace: true });
      } catch (err) {
        console.error("Login failed:", err);
        setError("Something went wrong signing you in.");
      }
    };

    run();
  }, [searchParams, login, navigate]);

  if (error) {
    return (
      <div className="page-shell flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-ember">{error}</p>
        <button onClick={() => navigate("/")} className="btn-secondary">
          Back to login
        </button>
      </div>
    );
  }

  return (
    <div className="page-shell flex flex-col items-center justify-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-volt" />
      <p className="text-sm text-ink-muted">Signing you in...</p>
    </div>
  );
}