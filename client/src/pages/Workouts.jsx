import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Circle, RefreshCcw, Heart } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/layout/AppLayout";
import Loader from "../components/ui/Loader";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import { stripHtml } from "../lib/utils";

const GOAL_OPTIONS = ["LOSE_FAT", "MAINTAIN", "GAIN_MUSCLE"];
const DIFFICULTY_OPTIONS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
const LOCATION_OPTIONS = ["GYM", "HOME"];

const STORAGE_KEY = "arthrix_workout_plan";

export default function Workouts() {
  const { userId } = useAuth();
  const navigate = useNavigate();

  const [goal, setGoal] = useState("GAIN_MUSCLE");
  const [difficulty, setDifficulty] = useState("BEGINNER");
  const [location, setLocation] = useState("GYM");
  const [daysPerWeek, setDaysPerWeek] = useState(3);

  const [plan, setPlan] = useState(null);
  const [completed, setCompleted] = useState({});
  const [activeDay, setActiveDay] = useState(1);
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      setPlan(parsed.plan ?? null);
      setCompleted(parsed.completed ?? {});
      setGoal(parsed.goal ?? "GAIN_MUSCLE");
      setDifficulty(parsed.difficulty ?? "BEGINNER");
      setLocation(parsed.location ?? "GYM");
      setDaysPerWeek(parsed.daysPerWeek ?? 3);
      setActiveDay(parsed.activeDay ?? 1);
    } catch (err) {
      console.error("Failed to restore saved plan:", err);
    }
  }, []);

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
      const res = await api.get("/api/workouts/plan", {
        params: { goal, difficulty, location, daysPerWeek },
      });
      const newPlan = res.data?.data ?? null;
      setPlan(newPlan);
      setCompleted({});
      setActiveDay(1);
      persist({ plan: newPlan, completed: {}, goal, difficulty, location, daysPerWeek, activeDay: 1 });
    } catch (err) {
      console.error("Failed to generate workout plan:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = (e, dayNumber, workoutId) => {
    e.stopPropagation();
    const key = `${dayNumber}-${workoutId}`;
    const next = { ...completed, [key]: !completed[key] };
    setCompleted(next);
    persist({ plan, completed: next, goal, difficulty, location, daysPerWeek, activeDay });
  };

  const toggleFavorite = async (e, workoutId) => {
    e.stopPropagation();
    if (!userId) return;
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

  const resetProgress = () => {
    setCompleted({});
    persist({ plan, completed: {}, goal, difficulty, location, daysPerWeek, activeDay });
  };

  const selectDay = (dayNumber) => {
    setActiveDay(dayNumber);
    persist({ plan, completed, goal, difficulty, location, daysPerWeek, activeDay: dayNumber });
  };

  const activeDayPlan = plan?.days?.find((d) => d.dayNumber === activeDay);

  const dayProgress = (dayPlan) => {
    if (!dayPlan || dayPlan.exercises.length === 0) return 0;
    const done = dayPlan.exercises.filter((ex) => completed[`${dayPlan.dayNumber}-${ex.id}`]).length;
    return Math.round((done / dayPlan.exercises.length) * 100);
  };

  const formatMuscleGroup = (m) => m.charAt(0) + m.slice(1).toLowerCase();

  return (
    <AppLayout>
      <div className="plan-header">
        <h1 className="page-title">Weekly Workout Plan</h1>
      </div>

      <div className="plan-form card-flat">
        <div className="plan-form-grid">
          <div>
            <label className="label-field">Goal</label>
            <select value={goal} onChange={(e) => setGoal(e.target.value)} className="select-field">
              {GOAL_OPTIONS.map((g) => (
                <option key={g} value={g}>{g.replaceAll("_", " ")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field">Level</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="select-field">
              {DIFFICULTY_OPTIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field">Location</label>
            <select value={location} onChange={(e) => setLocation(e.target.value)} className="select-field">
              {LOCATION_OPTIONS.map((l) => (
                <option key={l} value={l}>{l === "GYM" ? "Gym" : "Home"}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field">Days / Week</label>
            <input
              type="number"
              min={1}
              max={7}
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(Number(e.target.value))}
              className="input-field"
            />
          </div>
        </div>

        <div className="plan-form-actions">
          <button onClick={generatePlan} className="btn-primary" disabled={loading}>
            {loading ? "Generating..." : "Generate New Plan"}
          </button>
          {plan && (
            <button onClick={resetProgress} className="btn-secondary">
              <RefreshCcw className="h-4 w-4" /> Reset Progress
            </button>
          )}
        </div>
      </div>

      {loading && <Loader label="Building your plan..." />}
      {!loading && error && <ErrorState message="Couldn't generate a plan." onRetry={generatePlan} />}
      {!loading && !error && !plan && (
        <EmptyState title="No plan yet" description="Set your preferences above and generate a plan." />
      )}

      {!loading && !error && plan && (
        <div className="plan-body">
          <div className="tab-row">
            {plan.days.map((d) => (
              <button
                key={d.dayNumber}
                onClick={() => selectDay(d.dayNumber)}
                className={d.dayNumber === activeDay ? "tab-btn-active" : "tab-btn"}
              >
                Day {d.dayNumber}
              </button>
            ))}
          </div>

          {activeDayPlan && (
            <div className="plan-day-card card-flat">
              <div className="plan-day-header">
                <div>
                  <h2 className="plan-day-title">
                    Day {activeDayPlan.dayNumber} — {activeDayPlan.muscleGroups.map(formatMuscleGroup).join(" & ")}
                  </h2>
                  <p className="plan-day-meta">
                    {location === "GYM" ? "Gym" : "Home"}, {goal.replaceAll("_", " ")}, {difficulty.toLowerCase()}, {daysPerWeek} days/week
                  </p>
                </div>
                <span className="plan-day-progress">{dayProgress(activeDayPlan)}%</span>
              </div>

              {activeDayPlan.exercises.length === 0 && (
                <EmptyState title="No exercises found" description="Try a different goal, level, or location." />
              )}

              <div className="plan-exercise-list">
                {activeDayPlan.exercises.map((ex) => {
                  const key = `${activeDayPlan.dayNumber}-${ex.id}`;
                  const isDone = !!completed[key];
                  const isFav = favoriteIds.has(ex.id);
                  return (
                    <div
                      key={key}
                      className="plan-exercise-item"
                      onClick={() => navigate(`/workouts/${ex.id}`)}
                      role="button"
                    >
                      <div className="plan-exercise-info">
                        <h3 className={isDone ? "plan-exercise-title-done" : "plan-exercise-title"}>{ex.name}</h3>
                        <p className="plan-exercise-desc">{stripHtml(ex.description)}</p>
                      </div>
                      <div className="plan-exercise-actions">
                        <button onClick={(e) => toggleFavorite(e, ex.id)} className="favorite-btn">
                          <Heart className={isFav ? "icon-favorite-active" : "icon-favorite"} />
                        </button>
                        <button onClick={(e) => toggleComplete(e, activeDayPlan.dayNumber, ex.id)} className="plan-mark-btn">
                          {isDone ? <CheckCircle2 className="icon-favorite-active" /> : <Circle className="icon-favorite" />}
                          {isDone ? "Done" : "Mark"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}