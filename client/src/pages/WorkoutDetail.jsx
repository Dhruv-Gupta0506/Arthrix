import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Clock, Flame } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/layout/AppLayout";
import Loader from "../components/ui/Loader";
import ErrorState from "../components/ui/ErrorState";
import Badge from "../components/ui/Badge";

export default function WorkoutDetail() {
  const { workoutId } = useParams();
  const { userId } = useAuth();
  const navigate = useNavigate();

  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchWorkout = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get(`/api/workouts/${workoutId}`);
      setWorkout(res.data?.data ?? null);
    } catch (err) {
      console.error("Failed to load workout:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    if (!userId) return;
    try {
      const res = await api.get(`/api/users/${userId}/favorites/workouts`);
      const ids = (res.data?.data ?? []).map((w) => w.id);
      setIsFavorite(ids.includes(Number(workoutId)));
    } catch (err) {
      console.error("Failed to check favorite status:", err);
    }
  };

  useEffect(() => {
    fetchWorkout();
    checkFavorite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workoutId, userId]);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await api.delete(`/api/users/${userId}/favorites/workouts/${workoutId}`);
      } else {
        await api.post(`/api/users/${userId}/favorites/workouts/${workoutId}`);
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  if (loading) return <AppLayout><Loader label="Loading workout..." /></AppLayout>;
  if (error || !workout) return <AppLayout><ErrorState message="Couldn't load this workout." onRetry={fetchWorkout} /></AppLayout>;

  return (
    <AppLayout>
      <button onClick={() => navigate("/workouts")} className="back-link">
        <ArrowLeft className="h-4 w-4" /> Back to Workouts
      </button>

      <div className="card-flat">
        <div className="detail-header-row">
          <div className="detail-tag-row">
            <Badge level={workout.difficulty} />
            <span className="badge-neutral">{workout.fitnessGoal?.replaceAll("_", " ")}</span>
          </div>
          <button onClick={toggleFavorite} className="favorite-btn">
            <Heart className={isFavorite ? "icon-favorite-lg-active" : "icon-favorite-lg"} />
          </button>
        </div>

        <h1 className="detail-title">{workout.name}</h1>

        {/* Backend sends description as formatted HTML (paragraphs + numbered steps) */}
        <div className="detail-description rich-text" dangerouslySetInnerHTML={{ __html: workout.description }} />

        <div className="detail-stats-row">
          <div className="detail-stat">
            <Clock className="h-5 w-5 icon-volt" />
            <div>
              <p className="detail-stat-value">{workout.durationMinutes}</p>
              <p className="detail-stat-label">Minutes</p>
            </div>
          </div>
          <div className="detail-stat">
            <Flame className="h-5 w-5 icon-ember" />
            <div>
              <p className="detail-stat-value">{workout.estimatedCaloriesBurned}</p>
              <p className="detail-stat-label">Calories</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}