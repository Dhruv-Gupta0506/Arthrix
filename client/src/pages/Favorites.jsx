import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dumbbell, Utensils, Clock, Flame } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/layout/AppLayout";
import Loader from "../components/ui/Loader";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import { stripHtml } from "../lib/utils";

export default function Favorites() {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("workouts");

  const [workouts, setWorkouts] = useState([]);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchFavorites = async () => {
    if (!userId) return;
    setLoading(true);
    setError(false);
    try {
      const [wRes, mRes] = await Promise.all([
        api.get(`/api/users/${userId}/favorites/workouts`),
        api.get(`/api/users/${userId}/favorites/meals`),
      ]);
      setWorkouts(wRes.data?.data ?? []);
      setMeals(mRes.data?.data ?? []);
    } catch (err) {
      console.error("Failed to load favorites:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (loading) return <AppLayout><Loader label="Loading favorites..." /></AppLayout>;
  if (error) return <AppLayout><ErrorState message="Couldn't load favorites." onRetry={fetchFavorites} /></AppLayout>;

  const list = tab === "workouts" ? workouts : meals;

  return (
    <AppLayout>
      <div className="content-stack">
        <h1 className="page-title">Favorites</h1>

        <div className="tab-row">
          <button onClick={() => setTab("workouts")} className={tab === "workouts" ? "tab-btn-active" : "tab-btn"}>
            <Dumbbell className="mr-1.5 inline h-4 w-4" /> Workouts
            <span className="fav-tab-count">({workouts.length})</span>
          </button>
          <button onClick={() => setTab("meals")} className={tab === "meals" ? "tab-btn-active" : "tab-btn"}>
            <Utensils className="mr-1.5 inline h-4 w-4" /> Meals
            <span className="fav-tab-count">({meals.length})</span>
          </button>
        </div>

        {list.length === 0 && (
          <EmptyState
            title={`No favorite ${tab} yet`}
            description={`Browse ${tab} and tap the heart icon to save your favorites here.`}
          />
        )}

        {list.length > 0 && (
          <div className="item-grid">
            {tab === "workouts"
              ? workouts.map((w) => (
                  <div key={w.id} className="card-clickable" onClick={() => navigate(`/workouts/${w.id}`)}>
                    <div className="item-card-header">
                      <span className="badge-neutral">{w.difficulty}</span>
                    </div>
                    <h3 className="item-card-title">{w.name}</h3>
                    <p className="item-card-desc">{stripHtml(w.description)}</p>
                    <div className="item-meta-row">
                      <span className="item-meta"><Clock className="h-3.5 w-3.5" /> {w.durationMinutes} min</span>
                      <span className="item-meta"><Flame className="h-3.5 w-3.5" /> {w.estimatedCaloriesBurned} cal</span>
                    </div>
                  </div>
                ))
              : meals.map((m) => (
                  <div key={m.id} className="card-clickable" onClick={() => navigate(`/meals/${m.id}`)}>
                    <div className="item-card-header">
                      <span className="badge-neutral">{m.mealType}</span>
                    </div>
                    <h3 className="item-card-title">{m.name}</h3>
                    <p className="item-card-desc">{stripHtml(m.description)}</p>
                    <div className="item-meta-row">
                      <span className="item-meta"><Flame className="h-3.5 w-3.5" /> {m.calories} cal</span>
                    </div>
                  </div>
                ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}