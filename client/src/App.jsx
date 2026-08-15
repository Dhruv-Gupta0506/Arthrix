import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/layout/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import OAuthSuccess from "./pages/OAuthSuccess";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import WorkoutDetail from "./pages/WorkoutDetail";
import Meals from "./pages/Meals";
import MealDetail from "./pages/MealDetail";
import Favorites from "./pages/Favorites";
import Challenges from "./pages/Challenges";
import Analytics from "./pages/Analytics";
import Chatbot from "./pages/Chatbot";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";


function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />

      {/* Protected — requires a valid token, enforced by ProtectedRoute */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/workouts/:workoutId" element={<WorkoutDetail />} />
        
        <Route path="/meals" element={<Meals />} />
        <Route path="/meals/:mealId" element={<MealDetail />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* 404 fallback — inline, no separate page needed for this */}
      <Route
        path="*"
        element={
          <div className="page-shell flex flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-4xl">404</h1>
            <p className="text-ink-muted">This page doesn't exist.</p>
            <a href="/" className="btn-primary">Back home</a>
          </div>
        }
      />
    </Routes>
  );
}

export default App;