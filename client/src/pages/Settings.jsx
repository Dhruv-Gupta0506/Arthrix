import { useEffect, useState } from "react";
import { UserCog, CalendarDays, UserRound, Ruler, Scale, Utensils, Target, Sliders } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/layout/AppLayout";
import Loader from "../components/ui/Loader";
import ErrorState from "../components/ui/ErrorState";
import { GENDER_OPTIONS, DIET_OPTIONS, FITNESS_GOAL_OPTIONS } from "../lib/utils";

export default function Settings() {
  const { userId } = useAuth();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchSettings = async () => {
    if (!userId) return;
    setLoading(true);
    setError(false);
    try {
      const res = await api.get(`/api/settings/${userId}`);
      setForm(res.data?.data ?? {});
    } catch (err) {
      console.error("Failed to load settings:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/api/settings/${userId}`, {
        age: Number(form.age),
        gender: form.gender,
        height: Number(form.height),
        weight: Number(form.weight),
        dietPreference: form.dietPreference,
        fitnessGoal: form.fitnessGoal,
      });
      setSaved(true);
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AppLayout><Loader label="Loading settings..." /></AppLayout>;
  if (error || !form) return <AppLayout><ErrorState message="Couldn't load settings." onRetry={fetchSettings} /></AppLayout>;

  return (
    <AppLayout>
      <div className="content-stack">
        <h1 className="page-title">Settings</h1>

        <form onSubmit={handleSave} className="card-flat">
          <div className="form-section-header">
            <span className="form-section-icon"><UserCog className="h-4 w-4" /></span>
            <h2 className="form-section-title">Account Details</h2>
          </div>

          <div className="form-grid">
            <div>
              <label className="plan-form-label-row"><CalendarDays className="h-3.5 w-3.5" /> Age</label>
              <input type="number" className="input-field" value={form.age ?? ""} onChange={(e) => handleChange("age", e.target.value)} />
            </div>
            <div>
              <label className="plan-form-label-row"><UserRound className="h-3.5 w-3.5" /> Gender</label>
              <select className="select-field" value={form.gender ?? ""} onChange={(e) => handleChange("gender", e.target.value)}>
                {GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="plan-form-label-row"><Ruler className="h-3.5 w-3.5" /> Height (cm)</label>
              <input type="number" className="input-field" value={form.height ?? ""} onChange={(e) => handleChange("height", e.target.value)} />
            </div>
            <div>
              <label className="plan-form-label-row"><Scale className="h-3.5 w-3.5" /> Weight (kg)</label>
              <input type="number" className="input-field" value={form.weight ?? ""} onChange={(e) => handleChange("weight", e.target.value)} />
            </div>
            <div>
              <label className="plan-form-label-row"><Utensils className="h-3.5 w-3.5" /> Diet Preference</label>
              <select className="select-field" value={form.dietPreference ?? ""} onChange={(e) => handleChange("dietPreference", e.target.value)}>
                {DIET_OPTIONS.map((d) => <option key={d} value={d}>{d.replaceAll("_", " ")}</option>)}
              </select>
            </div>
            <div>
              <label className="plan-form-label-row"><Target className="h-3.5 w-3.5" /> Fitness Goal</label>
              <select className="select-field" value={form.fitnessGoal ?? ""} onChange={(e) => handleChange("fitnessGoal", e.target.value)}>
                {FITNESS_GOAL_OPTIONS.map((g) => <option key={g} value={g}>{g.replaceAll("_", " ")}</option>)}
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" disabled={saving} className="btn-primary w-full sm:w-auto">
              {saving ? "Saving..." : "Save Changes"}
            </button>
            {saved && <span className="text-sm text-volt">Saved!</span>}
          </div>
        </form>

        <div className="card-flat">
          <div className="form-section-header">
            <span className="form-section-icon"><Sliders className="h-4 w-4" /></span>
            <h2 className="form-section-title">More</h2>
          </div>
          <div className="content-stack">
            <div className="coming-soon-row">
              <span className="coming-soon-label">Theme preference</span>
              <span className="coming-soon-badge">Coming soon</span>
            </div>
            <div className="coming-soon-row">
              <span className="coming-soon-label">Delete account</span>
              <span className="coming-soon-badge">Coming soon</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}