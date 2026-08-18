import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Flame, Beef, Wheat, Droplet, ExternalLink, CheckCircle2, Coffee, Soup, Cookie, Moon } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/layout/AppLayout";
import Loader from "../components/ui/Loader";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import { stripHtml } from "../lib/utils";

const DIET_OPTIONS = ["VEG", "NON_VEG"];
const GOAL_OPTIONS = ["LOSE_FAT", "MAINTAIN", "GAIN_MUSCLE"];
const CATEGORY_LABELS = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  SNACKS: "Snacks",
  DINNER: "Dinner",
};
const CATEGORY_ICONS = {
  BREAKFAST: Coffee,
  LUNCH: Soup,
  SNACKS: Cookie,
  DINNER: Moon,
};

const STORAGE_KEY = "arthrix_meal_plan";

export default function Meals() {
  const { userId } = useAuth();
  const navigate = useNavigate();

  const [diet, setDiet] = useState("VEG");
  const [goal, setGoal] = useState("MAINTAIN");

  const [plan, setPlan] = useState(null);
  const [selections, setSelections] = useState({});
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      setPlan(parsed.plan ?? null);
      setSelections(parsed.selections ?? {});
      setDiet(parsed.diet ?? "VEG");
      setGoal(parsed.goal ?? "MAINTAIN");
    } catch (err) {
      console.error("Failed to restore saved meal plan:", err);
    }
  }, []);

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
    fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const persist = (next) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const generatePlan = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get("/api/meals/plan", { params: { dietPreference: diet, goal } });
      const newPlan = res.data?.data ?? null;
      setPlan(newPlan);
      setSelections({});
      persist({ plan: newPlan, selections: {}, diet, goal });
    } catch (err) {
      console.error("Failed to generate meal plan:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const selectMeal = (mealType, mealId) => {
    const next = { ...selections, [mealType]: mealId };
    setSelections(next);
    persist({ plan, selections: next, diet, goal });
  };

  const toggleFavorite = async (e, mealId) => {
    e.stopPropagation();
    if (!userId) return;
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
      <div className="plan-header">
        <h1 className="page-title">Your Meal Options</h1>
        <p className="plan-subtitle">Pick your diet and goal, then choose one meal per slot.</p>
      </div>

      <div className="plan-form card-flat">
        <div className="plan-form-grid">
          <div>
            <label className="plan-form-label-row">Goal</label>
            <select value={goal} onChange={(e) => setGoal(e.target.value)} className="select-field">
              {GOAL_OPTIONS.map((g) => (
                <option key={g} value={g}>{g.replaceAll("_", " ")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="plan-form-label-row">Diet</label>
            <div className="diet-toggle-row">
              {DIET_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDiet(d)}
                  className={diet === d ? "toggle-btn-active" : "toggle-btn"}
                >
                  {d === "VEG" ? "Veg" : "Non-Veg"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="plan-form-actions">
          <button onClick={generatePlan} className="btn-primary w-full sm:w-auto" disabled={loading}>
            {loading ? "Generating..." : "Generate New Meals"}
          </button>
        </div>
      </div>

      {loading && <Loader label="Building your meal options..." />}
      {!loading && error && <ErrorState message="Couldn't generate meal options." onRetry={generatePlan} />}
      {!loading && !error && !plan && (
        <EmptyState title="No meals yet" description="Set your goal and diet preference above, then generate." />
      )}

      {!loading && !error && plan && (
        <div className="meal-plan-body">
          {plan.categories.map((category) => {
            const CategoryIcon = CATEGORY_ICONS[category.mealType] ?? Soup;
            return (
              <div key={category.mealType} className="meal-category-section">
                <div className="meal-category-header">
                  <span className="meal-category-icon">
                    <CategoryIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <h2 className="meal-category-title">{CATEGORY_LABELS[category.mealType]}</h2>
                    <p className="meal-category-count">Choose 1 · {category.options.length} options</p>
                  </div>
                </div>

                {category.options.length === 0 && (
                  <EmptyState title="No meals found" description="Try a different goal or diet preference." />
                )}

                <div className="meal-option-grid">
                  {category.options.map((meal) => {
                    const isSelected = selections[category.mealType] === meal.id;
                    const isFav = favoriteIds.has(meal.id);
                    return (
                      <div
                        key={meal.id}
                        onClick={() => selectMeal(category.mealType, meal.id)}
                        className={isSelected ? "meal-option-card-selected" : "meal-option-card"}
                      >
                        <div className="meal-option-header">
                          <div className="flex min-w-0 items-center gap-1.5">
                            <h3 className="meal-option-title">{meal.name}</h3>
                            {isSelected && <CheckCircle2 className="h-4 w-4 shrink-0 text-volt" />}
                          </div>
                          <button onClick={(e) => toggleFavorite(e, meal.id)} className="favorite-btn">
                            <Heart className={isFav ? "icon-favorite-active" : "icon-favorite"} />
                          </button>
                        </div>

                        <p className="meal-option-desc">{stripHtml(meal.description)}</p>

                        <div className="meal-macro-row">
                          <span className="macro-chip"><Flame className="h-3 w-3" /> {meal.calories} kcal</span>
                          <span className="macro-chip"><Beef className="h-3 w-3" /> {meal.protein}g</span>
                          <span className="macro-chip"><Wheat className="h-3 w-3" /> {meal.carbs}g</span>
                          <span className="macro-chip"><Droplet className="h-3 w-3" /> {meal.fat}g</span>
                        </div>

                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/meals/${meal.id}`); }}
                          className="meal-view-link"
                        >
                          <ExternalLink className="h-3.5 w-3.5" /> View details
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}