import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flame, Dumbbell, CheckCircle2, Circle } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/layout/AppLayout";
import Loader from "../components/ui/Loader";
import ErrorState from "../components/ui/ErrorState";

export default function Dashboard() {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [completingId, setCompletingId] = useState(null);

  const fetchDashboard = async () => {
    if (!userId) return;
    setLoading(true);
    setError(false);
    try {
      const res = await api.get(`/api/dashboard/${userId}`);
      setData(res.data?.data ?? null);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleCompleteChallenge = async (userChallengeId) => {
    setCompletingId(userChallengeId);
    setData((prev) => {
      if (!prev) return prev;
      const todayChallenges = prev.todayChallenges.map((c) =>
        c.id === userChallengeId ? { ...c, completed: true } : c
      );
      return {
        ...prev,
        todayChallenges,
        challengesCompletedToday: (prev.challengesCompletedToday ?? 0) + 1,
      };
    });
    try {
      await api.put(`/api/challenges/${userChallengeId}/complete`);
    } catch (err) {
      console.error("Failed to complete challenge:", err);
      fetchDashboard();
    } finally {
      setCompletingId(null);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <Loader label="Loading your dashboard..." />
      </AppLayout>
    );
  }

  if (error || !data) {
    return (
      <AppLayout>
        <ErrorState message="Couldn't load your dashboard." onRetry={fetchDashboard} />
      </AppLayout>
    );
  }

  const {
    userName,
    profilePictureUrl,
    fitnessGoal,
    bmi,
    dailyCalorieGoal,
    dailyProteinGoal,
    currentStreak,
    todayChallenges,
    challengesCompletedToday,
    challengesTotalToday,
    recommendedWorkout,
  } = data;

  return (
    <AppLayout>
      <div className="page-stack">
        <div className="dashboard-greeting">
          {profilePictureUrl && (
            <img src={profilePictureUrl} alt={userName} className="dashboard-avatar" />
          )}
          <div>
            <h1 className="dashboard-name">Hey, {userName?.split(" ")[0] ?? "there"}</h1>
            <p className="dashboard-goal">Goal: {fitnessGoal?.replaceAll("_", " ") ?? "—"}</p>
          </div>
        </div>

        <div className="stat-grid">
          <div className="card-stat">
            <span className="card-stat-value">{bmi ? bmi.toFixed(1) : "—"}</span>
            <span className="card-stat-label">BMI</span>
          </div>
          <div className="card-stat">
            <span className="card-stat-value">{dailyCalorieGoal ?? "—"}</span>
            <span className="card-stat-label">Calorie Goal</span>
          </div>
          <div className="card-stat">
            <span className="card-stat-value">{dailyProteinGoal ?? "—"}g</span>
            <span className="card-stat-label">Protein Goal</span>
          </div>
          <div className="card-stat">
            <span className="card-stat-value stat-value-row">
              <Flame className="stat-icon-flame" />
              {currentStreak ?? 0}
            </span>
            <span className="card-stat-label">Day Streak</span>
          </div>
        </div>

        <div className="card-flat">
          <div className="challenges-panel-header">
            <h2 className="challenges-panel-title">Today's Challenges</h2>
            <span className="challenges-panel-count">
              {challengesCompletedToday ?? 0}/{challengesTotalToday ?? 0} done
            </span>
          </div>
          <div className="challenge-list">
            {(todayChallenges ?? []).map((c) => (
              <button
                key={c.id}
                disabled={c.completed || completingId === c.id}
                onClick={() => handleCompleteChallenge(c.id)}
                className="challenge-item"
              >
                {c.completed ? (
                  <CheckCircle2 className="challenge-icon icon-volt" />
                ) : (
                  <Circle className="challenge-icon text-ink-faint" />
                )}
                <div>
                  <p className={c.completed ? "challenge-title-done" : "challenge-title"}>{c.title}</p>
                  {c.description && <p className="challenge-description">{c.description}</p>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {recommendedWorkout && (
          <div className="card" onClick={() => navigate(`/workouts/${recommendedWorkout.id}`)} role="button">
            <div className="recommend-label icon-volt">
              <Dumbbell className="h-4 w-4" />
              <span className="recommend-label-text">Recommended Workout</span>
            </div>
            <h3 className="recommend-title">{recommendedWorkout.name}</h3>
            <p className="recommend-description">{recommendedWorkout.description}</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}