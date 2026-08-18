import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isProfileComplete } from "../lib/utils";

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
        const { profile } = await login(token);
        navigate(isProfileComplete(profile) ? "/dashboard" : "/onboarding", { replace: true });
      } catch (err) {
        console.error("Login failed:", err);
        setError("Something went wrong signing you in.");
      }
    };

    run();
  }, [searchParams, login, navigate]);

  if (error) {
    return (
      <div className="page-shell flex flex-col items-center justify-center gap-4 px-5 text-center">
        <div className="landing-logo">
          <span className="landing-logo-mark">A</span>
          <span className="landing-logo-text">ARTHRIX</span>
        </div>
        <p className="text-ember">{error}</p>
        <button onClick={() => navigate("/")} className="btn-secondary">
          Back to login
        </button>
      </div>
    );
  }

  return (
    <div className="page-shell flex flex-col items-center justify-center gap-4">
      <div className="landing-logo">
        <span className="landing-logo-mark">A</span>
        <span className="landing-logo-text">ARTHRIX</span>
      </div>
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-volt" />
      <p className="text-sm text-ink-muted">Signing you in...</p>
    </div>
  );
}