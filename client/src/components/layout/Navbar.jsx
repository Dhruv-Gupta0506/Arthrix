import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Dumbbell, Utensils, Heart, Flame, BarChart3, MessageCircle, Settings as SettingsIcon, LogOut } from "lucide-react";
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

export default function Navbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleLogoutConfirm = () => {
    setConfirmOpen(false);
    logout();
  };

  return (
    <nav className="navbar">
      <div className="container-arthrix flex h-16 items-center justify-between">
        <button onClick={() => navigate("/dashboard")} className="font-display text-xl font-bold text-ink">
          ARTHRIX
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

        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/settings")} className="text-ink-muted hover:text-ink">
            <SettingsIcon className="h-5 w-5" />
          </button>
          {user?.profilePictureUrl && (
            <img
              src={user.profilePictureUrl}
              alt={user?.name ?? "Profile"}
              className="h-8 w-8 rounded-full border border-border"
            />
          )}
          <button onClick={() => setConfirmOpen(true)} className="text-ink-muted hover:text-ember">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t border-border bg-surface py-2 lg:hidden">
        {LINKS.slice(0, 5).map(({ to, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => (isActive ? "text-volt" : "text-ink-muted")}>
            <Icon className="h-5 w-5" />
          </NavLink>
        ))}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Log out of Arthrix?"
        description="You'll need to sign in again to access your dashboard."
        confirmLabel="Log out"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </nav>
  );
}