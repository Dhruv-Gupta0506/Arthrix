import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/layout/AppLayout";
import Loader from "../components/ui/Loader";
import ErrorState from "../components/ui/ErrorState";

export default function MealDetail() {
  const { mealId } = useParams();
  const { userId } = useAuth();
  const navigate = useNavigate();

  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchMeal = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get(`/api/meals/${mealId}`);
      setMeal(res.data?.data ?? null);
    } catch (err) {
      console.error("Failed to load meal:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    if (!userId) return;
    try {
      const res = await api.get(`/api/users/${userId}/favorites/meals`);
      const ids = (res.data?.data ?? []).map((m) => m.id);
      setIsFavorite(ids.includes(Number(mealId)));
    } catch (err) {
      console.error("Failed to check favorite status:", err);
    }
  };

  useEffect(() => {
    fetchMeal();
    checkFavorite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mealId, userId]);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await api.delete(`/api/users/${userId}/favorites/meals/${mealId}`);
      } else {
        await api.post(`/api/users/${userId}/favorites/meals/${mealId}`);
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  if (loading) return <AppLayout><Loader label="Loading meal..." /></AppLayout>;
  if (error || !meal) return <AppLayout><ErrorState message="Couldn't load this meal." onRetry={fetchMeal} /></AppLayout>;

  return (
    <AppLayout>
      <button onClick={() => navigate("/meals")} className="back-link">
        <ArrowLeft className="h-4 w-4" /> Back to Meals
      </button>

      <div className="card-flat">
        <div className="detail-header-row">
          <div className="detail-tag-row">
            <span className="badge-neutral">{meal.mealType}</span>
            <span className="badge-neutral">{meal.dietPreference?.replaceAll("_", " ")}</span>
          </div>
          <button onClick={toggleFavorite} className="favorite-btn">
            <Heart className={isFavorite ? "icon-favorite-lg-active" : "icon-favorite-lg"} />
          </button>
        </div>

        <h1 className="detail-title">{meal.name}</h1>
        <div className="detail-description rich-text" dangerouslySetInnerHTML={{ __html: meal.description }} />

        <div className="macro-grid">
          <div>
            <p className="detail-stat-value">{meal.calories}</p>
            <p className="detail-stat-label">Calories</p>
          </div>
          <div>
            <p className="detail-stat-value">{meal.protein}g</p>
            <p className="detail-stat-label">Protein</p>
          </div>
          <div>
            <p className="detail-stat-value">{meal.carbs}g</p>
            <p className="detail-stat-label">Carbs</p>
          </div>
          <div>
            <p className="detail-stat-value">{meal.fat}g</p>
            <p className="detail-stat-label">Fat</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}