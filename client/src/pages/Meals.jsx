import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Flame, Beef } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/layout/AppLayout";
import Loader from "../components/ui/Loader";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import { DIET_OPTIONS, MEAL_TYPE_OPTIONS, stripHtml } from "../lib/utils";

export default function Meals() {
  const { userId } = useAuth();
  const navigate = useNavigate();

  const [meals, setMeals] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [dietFilter, setDietFilter] = useState("");
  const [mealTypeFilter, setMealTypeFilter] = useState("");

  const fetchMeals = async () => {
    setLoading(true);
    setError(false);
    try {
      const hasFilter = dietFilter || mealTypeFilter;
      const url = hasFilter
        ? `/api/meals/filter?${dietFilter ? `dietPreference=${dietFilter}&` : ""}${
            mealTypeFilter ? `mealType=${mealTypeFilter}` : ""
          }`
        : "/api/meals";
      const res = await api.get(url);
      setMeals(res.data?.data ?? []);
    } catch (err) {
      console.error("Failed to load meals:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!userId) return;
    try {
      const res = await api.get(`/api/users/${userId}/favorites/meals`);
      const ids = new Set((res.data?.data ?? []).map((m) => m.id));
      setFavoriteIds(ids);
    } catch (err) {
      console.error("Failed to load favorite meals:", err);
    }
  };

  useEffect(() => {
    fetchMeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dietFilter, mealTypeFilter]);

  useEffect(() => {
    fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const toggleFavorite = async (e, mealId) => {
    e.stopPropagation();
    const isFav = favoriteIds.has(mealId);
    try {
      if (isFav) {
        await api.delete(`/api/users/${userId}/favorites/meals/${mealId}`);
      } else {
        await api.post(`/api/users/${userId}/favorites/meals/${mealId}`);
      }
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        isFav ? next.delete(mealId) : next.add(mealId);
        return next;
      });
    } catch (err) {
      console.error("Failed to toggle favorite meal:", err);
    }
  };

  return (
    <AppLayout>
      <div className="content-stack">
        <div className="page-header-row">
          <h1 className="page-title">Meals</h1>
          <div className="filter-group">
            <select value={dietFilter} onChange={(e) => setDietFilter(e.target.value)} className="select-inline">
              <option value="">All Diets</option>
              {DIET_OPTIONS.map((d) => (
                <option key={d} value={d}>{d.replaceAll("_", " ")}</option>
              ))}
            </select>
            <select value={mealTypeFilter} onChange={(e) => setMealTypeFilter(e.target.value)} className="select-inline">
              <option value="">All Meal Types</option>
              {MEAL_TYPE_OPTIONS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {loading && <Loader label="Loading meals..." />}
        {!loading && error && <ErrorState message="Couldn't load meals." onRetry={fetchMeals} />}
        {!loading && !error && meals.length === 0 && (
          <EmptyState title="No meals found" description="Try changing your filters." />
        )}

        {!loading && !error && meals.length > 0 && (
          <div className="item-grid">
            {meals.map((m) => (
              <div key={m.id} className="card-clickable" onClick={() => navigate(`/meals/${m.id}`)}>
                <div className="item-card-header">
                  <span className="badge-neutral">{m.mealType}</span>
                  <button onClick={(e) => toggleFavorite(e, m.id)} className="favorite-btn">
                    <Heart className={favoriteIds.has(m.id) ? "icon-favorite-active" : "icon-favorite"} />
                  </button>
                </div>
                <h3 className="item-card-title">{m.name}</h3>
                <p className="item-card-desc">{stripHtml(m.description)}</p>
                <div className="item-meta-row">
                  <span className="item-meta"><Flame className="h-3.5 w-3.5" /> {m.calories} cal</span>
                  <span className="item-meta"><Beef className="h-3.5 w-3.5" /> {m.protein}g protein</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}