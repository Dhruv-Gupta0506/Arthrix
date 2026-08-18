import { useEffect, useState } from "react";
import { Target, CheckCircle2, TrendingUp, Flame, UtensilsCrossed, CalendarDays } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/layout/AppLayout";
import Loader from "../components/ui/Loader";
import ErrorState from "../components/ui/ErrorState";

const formatNumber = (value) => {
  if (value === null || value === undefined) return "—";
  return Number.isInteger(value) ? value : Math.round(value * 10) / 10;
};

const STAT_ICONS = [Target, CheckCircle2, TrendingUp, Flame, UtensilsCrossed];

export default function Analytics() {
  const { userId } = useAuth();
  const [range, setRange] = useState("weekly");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchAnalytics = async () => {
    if (!userId) return;
    setLoading(true);
    setError(false);
    try {
      const res = await api.get(`/api/dashboard/${userId}/analytics/${range}`);
      setData(res.data?.data ?? null);
    } catch (err) {
      console.error("Failed to load analytics:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, userId]);

  const stats = data
    ? [
        { value: formatNumber(data.totalChallengesAssigned), label: "Challenges Assigned" },
        { value: formatNumber(data.totalChallengesCompleted), label: "Challenges Completed" },
        { value: `${formatNumber(data.completionRatePercent)}%`, label: "Completion Rate" },
        { value: formatNumber(data.estimatedCaloriesBurned), label: "Calories Burned" },
        { value: formatNumber(data.estimatedCaloriesConsumedTarget), label: "Calorie Target" },
      ]
    : [];

  return (
    <AppLayout>
      <div className="content-stack">
        <div className="page-header-row">
          <h1 className="page-title">Analytics</h1>
          <div className="toggle-row">
            <button onClick={() => setRange("weekly")} className={range === "weekly" ? "toggle-btn-active" : "toggle-btn"}>
              Weekly
            </button>
            <button onClick={() => setRange("monthly")} className={range === "monthly" ? "toggle-btn-active" : "toggle-btn"}>
              Monthly
            </button>
          </div>
        </div>

        {loading && <Loader label="Crunching your numbers..." />}
        {!loading && error && <ErrorState message="Couldn't load analytics." onRetry={fetchAnalytics} />}

        {!loading && !error && data && (
          <>
            <span className="analytics-range-pill">
              <CalendarDays className="h-3.5 w-3.5" />
              {data.startDate} — {data.endDate}
            </span>
            <div className="analytics-grid">
              {stats.map(({ value, label }, i) => {
                const Icon = STAT_ICONS[i] ?? Target;
                return (
                  <div key={label} className="card-stat">
                    <div className="stat-card-icon-sm">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="card-stat-value">{value}</span>
                    <span className="card-stat-label">{label}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}