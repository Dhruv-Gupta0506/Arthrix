import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Clock, Flame } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/layout/AppLayout";
import Loader from "../components/ui/Loader";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import Badge from "../components/ui/Badge";
import { FITNESS_GOAL_OPTIONS, DIFFICULTY_OPTIONS, stripHtml } from "../lib/utils";

export default function Workouts() {
  const { userId } = useAuth();
  const navigate = useNavigate();

  const [workouts, setWorkouts] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [goalFilter, setGoalFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");

  const fetchWorkouts = async () => {
    setLoading(true);
    setError(false);
    try {
      const hasFilter = goalFilter || difficultyFilter;
      const url = hasFilter
        ? `/api/workouts/filter?${goalFilter ? `goal=${goalFilter}&` : ""}${
            difficultyFilter ? `difficulty=${difficultyFilter}` : ""
          }`
        : "/api/workouts";
      const res = await api.get(url);
      setWorkouts(res.data?.data ?? []);
    } catch (err) {
      console.error("Failed to load workouts:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!userId) return;
    try {
      const res = await api.get(`/api/users/${userId}/favorites/workouts`);
      const ids = new Set((res.data?.data ?? []).map((w) => w.id));
      setFavoriteIds(ids);
    } catch (err) {
      console.error("Failed to load favorite workouts:", err);
    }
  };

  useEffect(() => {
    fetchWorkouts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goalFilter, difficultyFilter]);

  useEffect(() => {
    fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const toggleFavorite = async (e, workoutId) => {
    e.stopPropagation();
    const isFav = favoriteIds.has(workoutId);
    try {
      if (isFav) {
        await api.delete(`/api/users/${userId}/favorites/workouts/${workoutId}`);
      } else {
        await api.post(`/api/users/${userId}/favorites/workouts/${workoutId}`);
      }
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        isFav ? next.delete(workoutId) : next.add(workoutId);
        return next;
      });
    } catch (err) {
      console.error("Failed to toggle favorite workout:", err);
    }
  };

  return (
    <AppLayout>
      <div className="content-stack">
        <div className="page-header-row">
          <h1 className="page-title">Workouts</h1>
          <div className="filter-group">
            <select value={goalFilter} onChange={(e) => setGoalFilter(e.target.value)} className="select-inline">
              <option value="">All Goals</option>
              {FITNESS_GOAL_OPTIONS.map((g) => (
                <option key={g} value={g}>{g.replaceAll("_", " ")}</option>
              ))}
            </select>
            <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)} className="select-inline">
              <option value="">All Levels</option>
              {DIFFICULTY_OPTIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {loading && <Loader label="Loading workouts..." />}
        {!loading && error && <ErrorState message="Couldn't load workouts." onRetry={fetchWorkouts} />}
        {!loading && !error && workouts.length === 0 && (
          <EmptyState title="No workouts found" description="Try changing your filters." />
        )}

        {!loading && !error && workouts.length > 0 && (
          <div className="item-grid">
            {workouts.map((w) => (
              <div key={w.id} className="card-clickable" onClick={() => navigate(`/workouts/${w.id}`)}>
                <div className="item-card-header">
                  <Badge level={w.difficulty} />
                  <button onClick={(e) => toggleFavorite(e, w.id)} className="favorite-btn">
                    <Heart className={favoriteIds.has(w.id) ? "icon-favorite-active" : "icon-favorite"} />
                  </button>
                </div>
                <h3 className="item-card-title">{w.name}</h3>
                <p className="item-card-desc">{stripHtml(w.description)}</p>
                <div className="item-meta-row">
                  <span className="item-meta"><Clock className="h-3.5 w-3.5" /> {w.durationMinutes} min</span>
                  <span className="item-meta"><Flame className="h-3.5 w-3.5" /> {w.estimatedCaloriesBurned} cal</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}