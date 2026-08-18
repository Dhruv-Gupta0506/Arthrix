import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Dumbbell,
  Utensils,
  Heart,
  Flame,
  BarChart3,
  MessageCircle,
  Settings as SettingsIcon,
  LogOut,
  MoreHorizontal,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ConfirmDialog from "../ui/ConfirmDialog";

const LINKS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/workouts", label: "Workouts", icon: Dumbbell },
  { to: "/meals", label: "Meals", icon: Utensils },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/challenges", label: "Challenges", icon: Flame },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/chatbot", label: "AI Coach", icon: MessageCircle },
];

const TAB_LINKS = LINKS.slice(0, 4);
const SHEET_LINKS = LINKS.slice(4);

export default function Navbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const handleLogoutConfirm = () => {
    setConfirmOpen(false);
    logout();
  };

  return (
    <>
      {/* Top header — logo, desktop nav, always-visible avatar */}
      <header className="app-header">
        <div className="container-arthrix flex h-16 items-center justify-between">
          <button onClick={() => navigate("/dashboard")} className="app-logo">
            <span className="app-logo-mark">A</span>
            <span className="app-logo-text">ARTHRIX</span>
          </button>

          <div className="hidden items-center gap-6 lg:flex">
            {LINKS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => (isActive ? "nav-link-active" : "nav-link")}
              >
                <span className="flex items-center gap-1.5">
                  <Icon className="h-4 w-4" />
                  {label}
                </span>
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => navigate("/settings")} className="app-icon-btn hidden lg:flex">
              <SettingsIcon className="h-5 w-5" />
            </button>

            {user?.profilePictureUrl ? (
              <img
                src={user.profilePictureUrl}
                alt={user?.name ?? "Profile"}
                onClick={() => navigate("/settings")}
                className="app-avatar"
              />
            ) : (
              <div onClick={() => navigate("/settings")} className="app-avatar-fallback">
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </div>
            )}

            <button onClick={() => setConfirmOpen(true)} className="app-icon-btn hidden lg:flex hover:text-ember">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile tab bar — always visible, includes a More sheet for the rest */}
      <nav className="mobile-tabbar lg:hidden">
        {TAB_LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className="mobile-tab">
            {({ isActive }) => (
              <>
                <Icon className="h-5 w-5" style={{ color: isActive ? "var(--color-volt)" : "var(--color-ink-faint)" }} />
                <span className="mobile-tab-label" style={{ color: isActive ? "var(--color-volt)" : "var(--color-ink-faint)" }}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
        <button onClick={() => setMoreOpen(true)} className="mobile-tab">
          <MoreHorizontal className="h-5 w-5 text-ink-faint" />
          <span className="mobile-tab-label text-ink-faint">More</span>
        </button>
      </nav>

      {/* More sheet — Challenges / Analytics / AI Coach / Settings / Logout */}
      {moreOpen && (
        <div className="sheet-overlay" onClick={() => setMoreOpen(false)}>
          <div className="sheet-box" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setMoreOpen(false)} className="sheet-close">
              <X className="h-5 w-5" />
            </button>
            <div className="sheet-handle" />

            {user?.profilePictureUrl && (
              <div className="sheet-profile-row">
                <img src={user.profilePictureUrl} alt={user?.name ?? "Profile"} className="sheet-profile-avatar" />
                <div>
                  <p className="sheet-profile-name">{user?.name ?? "Your account"}</p>
                  {user?.email && <p className="sheet-profile-email">{user.email}</p>}
                </div>
              </div>
            )}

            <div className="sheet-links">
              {SHEET_LINKS.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} onClick={() => setMoreOpen(false)} className="sheet-link">
                  <Icon className="h-5 w-5 text-ink-muted" />
                  {label}
                </NavLink>
              ))}
              <button
                onClick={() => {
                  setMoreOpen(false);
                  navigate("/settings");
                }}
                className="sheet-link"
              >
                <SettingsIcon className="h-5 w-5 text-ink-muted" />
                Settings
              </button>
              <button
                onClick={() => {
                  setMoreOpen(false);
                  setConfirmOpen(true);
                }}
                className="sheet-link sheet-link-danger"
              >
                <LogOut className="h-5 w-5" />
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Log out of Arthrix?"
        description="You'll need to sign in again to access your dashboard."
        confirmLabel="Log out"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}