import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/layout/AppLayout";
import Loader from "../components/ui/Loader";
import ErrorState from "../components/ui/ErrorState";
import { GENDER_OPTIONS, DIET_OPTIONS, FITNESS_GOAL_OPTIONS } from "../lib/utils";

export default function Profile() {
  const { userId, setUser } = useAuth();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchProfile = async () => {
    if (!userId) return;
    setLoading(true);
    setError(false);
    try {
      const res = await api.get(`/api/users/${userId}/profile`);
      setForm(res.data?.data ?? {});
    } catch (err) {
      console.error("Failed to load profile:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
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
      const res = await api.put(`/api/users/${userId}/profile`, {
        age: Number(form.age),
        gender: form.gender,
        height: Number(form.height),
        weight: Number(form.weight),
        dietPreference: form.dietPreference,
        fitnessGoal: form.fitnessGoal,
      });
      setUser(res.data?.data ?? form);
      setSaved(true);
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AppLayout><Loader label="Loading profile..." /></AppLayout>;
  if (error || !form) return <AppLayout><ErrorState message="Couldn't load your profile." onRetry={fetchProfile} /></AppLayout>;

  return (
    <AppLayout>
      <div className="content-stack">
        <h1 className="page-title">Profile</h1>

        <form onSubmit={handleSave} className="card-flat">
          <h2 className="form-section-title">Your Details</h2>
          <div className="form-grid">
            <div>
              <label className="label-field">Age</label>
              <input
                type="number"
                className="input-field"
                value={form.age ?? ""}
                onChange={(e) => handleChange("age", e.target.value)}
              />
            </div>
            <div>
              <label className="label-field">Gender</label>
              <select className="select-field" value={form.gender ?? ""} onChange={(e) => handleChange("gender", e.target.value)}>
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">Height (cm)</label>
              <input
                type="number"
                className="input-field"
                value={form.height ?? ""}
                onChange={(e) => handleChange("height", e.target.value)}
              />
            </div>
            <div>
              <label className="label-field">Weight (kg)</label>
              <input
                type="number"
                className="input-field"
                value={form.weight ?? ""}
                onChange={(e) => handleChange("weight", e.target.value)}
              />
            </div>
            <div>
              <label className="label-field">Diet Preference</label>
              <select className="select-field" value={form.dietPreference ?? ""} onChange={(e) => handleChange("dietPreference", e.target.value)}>
                {DIET_OPTIONS.map((d) => (
                  <option key={d} value={d}>{d.replaceAll("_", " ")}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">Fitness Goal</label>
              <select className="select-field" value={form.fitnessGoal ?? ""} onChange={(e) => handleChange("fitnessGoal", e.target.value)}>
                {FITNESS_GOAL_OPTIONS.map((g) => (
                  <option key={g} value={g}>{g.replaceAll("_", " ")}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Saving..." : "Save Changes"}
            </button>
            {saved && <span className="text-sm text-volt">Saved!</span>}
          </div>
        </form>
      </div>
    </AppLayout>
  );
}