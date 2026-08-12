import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/layout/AppLayout";
import Loader from "../components/ui/Loader";
import ErrorState from "../components/ui/ErrorState";

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
            <p className="challenges-panel-count">
              {data.startDate} — {data.endDate}
            </p>
            <div className="analytics-grid">
              <div className="card-stat">
                <span className="card-stat-value">{data.totalChallengesAssigned ?? "—"}</span>
                <span className="card-stat-label">Challenges Assigned</span>
              </div>
              <div className="card-stat">
                <span className="card-stat-value">{data.totalChallengesCompleted ?? "—"}</span>
                <span className="card-stat-label">Challenges Completed</span>
              </div>
              <div className="card-stat">
                <span className="card-stat-value">{data.completionRatePercent ?? "—"}%</span>
                <span className="card-stat-label">Completion Rate</span>
              </div>
              <div className="card-stat">
                <span className="card-stat-value">{data.estimatedCaloriesBurned ?? "—"}</span>
                <span className="card-stat-label">Calories Burned</span>
              </div>
              <div className="card-stat">
                <span className="card-stat-value">{data.estimatedCaloriesConsumedTarget ?? "—"}</span>
                <span className="card-stat-label">Calorie Target</span>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}