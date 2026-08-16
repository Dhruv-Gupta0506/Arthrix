import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { GENDER_OPTIONS, DIET_OPTIONS, FITNESS_GOAL_OPTIONS } from "../lib/utils";

export default function Onboarding() {
  const { userId, setUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    age: "",
    gender: "MALE",
    height: "",
    weight: "",
    dietPreference: "VEG",
    fitnessGoal: "MAINTAIN",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isValid = form.age && form.height && form.weight;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || !userId) return;

    setSaving(true);
    setError(false);
    try {
      const res = await api.put(`/api/settings/${userId}`, {
        age: Number(form.age),
        gender: form.gender,
        height: Number(form.height),
        weight: Number(form.weight),
        dietPreference: form.dietPreference,
        fitnessGoal: form.fitnessGoal,
      });
      setUser(res.data?.data ?? null);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Failed to save onboarding profile:", err);
      setError(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="onboarding-shell">
      <div className="onboarding-card card-flat">
        <h1 className="onboarding-title">Let's set up your profile</h1>
        <p className="onboarding-subtitle">
          A few quick details so Arthrix can personalize your plan.
        </p>

        <form onSubmit={handleSubmit} className="form-grid onboarding-form">
          <div>
            <label className="label-field">Age</label>
            <input
              type="number"
              className="input-field"
              value={form.age}
              onChange={(e) => handleChange("age", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label-field">Gender</label>
            <select
              className="select-field"
              value={form.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
            >
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
              value={form.height}
              onChange={(e) => handleChange("height", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label-field">Weight (kg)</label>
            <input
              type="number"
              className="input-field"
              value={form.weight}
              onChange={(e) => handleChange("weight", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label-field">Diet Preference</label>
            <select
              className="select-field"
              value={form.dietPreference}
              onChange={(e) => handleChange("dietPreference", e.target.value)}
            >
              {DIET_OPTIONS.map((d) => (
                <option key={d} value={d}>{d.replaceAll("_", " ")}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-field">Fitness Goal</label>
            <select
              className="select-field"
              value={form.fitnessGoal}
              onChange={(e) => handleChange("fitnessGoal", e.target.value)}
            >
              {FITNESS_GOAL_OPTIONS.map((g) => (
                <option key={g} value={g}>{g.replaceAll("_", " ")}</option>
              ))}
            </select>
          </div>

          {error && <p className="onboarding-error">Couldn't save your profile. Try again.</p>}

          <div className="onboarding-actions">
            <button type="submit" className="btn-primary" disabled={!isValid || saving}>
              {saving ? "Saving..." : "Start My Journey"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}