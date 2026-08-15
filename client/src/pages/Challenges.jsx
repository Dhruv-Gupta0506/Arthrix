import { useEffect, useState } from "react";
import { Flame, CheckCircle2, Circle } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/layout/AppLayout";
import Loader from "../components/ui/Loader";
import ErrorState from "../components/ui/ErrorState";

export default function Challenges() {
  const { userId } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [completingId, setCompletingId] = useState(null);

  const fetchData = async () => {
    if (!userId) return;
    setLoading(true);
    setError(false);
    try {
      const [cRes, sRes] = await Promise.all([
        api.get(`/api/challenges/today/${userId}`),
        api.get(`/api/challenges/streak/${userId}`),
      ]);
      setChallenges(cRes.data?.data ?? []);
      setStreak(sRes.data?.data ?? 0);
    } catch (err) {
      console.error("Failed to load challenges:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleComplete = async (userChallengeId) => {
    setCompletingId(userChallengeId);
    setChallenges((prev) =>
      prev.map((c) => (c.id === userChallengeId ? { ...c, completed: true } : c))
    );
    try {
      await api.put(`/api/challenges/${userChallengeId}/complete`);
      const sRes = await api.get(`/api/challenges/streak/${userId}`);
      setStreak(sRes.data?.data ?? 0);
    } catch (err) {
      console.error("Failed to complete challenge:", err);
      setChallenges((prev) =>
        prev.map((c) => (c.id === userChallengeId ? { ...c, completed: false } : c))
      );
    } finally {
      setCompletingId(null);
    }
  };

  if (loading) return <AppLayout><Loader label="Loading challenges..." /></AppLayout>;
  if (error) return <AppLayout><ErrorState message="Couldn't load challenges." onRetry={fetchData} /></AppLayout>;

  const completedCount = challenges.filter((c) => c.completed).length;

  return (
    <AppLayout>
      <div className="content-stack">
        <h1 className="page-title">Daily Challenges</h1>

        <div className="streak-banner">
          <div>
            <p className="streak-banner-label">Current Streak</p>
            <p className="streak-banner-value">
              <Flame className="h-8 w-8" /> {streak} {streak === 1 ? "day" : "days"}
            </p>
          </div>
          <p className="challenges-panel-count">{completedCount}/{challenges.length} done today</p>
        </div>

        <div className="challenge-list">
          {challenges.map((c) => (
            <button
              key={c.id}
              disabled={c.completed || completingId === c.id}
              onClick={() => handleComplete(c.id)}
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
    </AppLayout>
  );
}