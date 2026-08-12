import { Dumbbell, Utensils, Flame, MessageCircle, ArrowRight } from "lucide-react";
import { GOOGLE_LOGIN_URL } from "../lib/utils";

const FEATURES = [
  {
    icon: Dumbbell,
    title: "Workouts built for your goal",
    description: "Filter by fitness goal and difficulty. Every session is picked to move you forward, not just fill time.",
  },
  {
    icon: Utensils,
    title: "Meals that match your macros",
    description: "Veg or non-veg, breakfast to dinner — meals mapped to your calorie and protein targets.",
  },
  {
    icon: Flame,
    title: "Daily challenges, real streaks",
    description: "Five challenges a day. Show up, check them off, watch your streak climb.",
  },
  {
    icon: MessageCircle,
    title: "An AI coach in your pocket",
    description: "Ask about form, nutrition, or your plan — get an answer that knows your profile.",
  },
];

export default function LandingPage() {
  const handleLogin = () => {
    window.location.href = GOOGLE_LOGIN_URL;
  };

  return (
    <div className="page-shell">
      {/* Hero */}
      <section className="grid-bg relative overflow-hidden border-b border-border">
        <div className="container-arthrix section flex flex-col items-center text-center">
          <span className="badge bg-surface-hi text-ink-muted mb-6">
            Train with intention
          </span>
          <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Your body's next rep,
            <span className="text-volt"> tracked and coached.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-ink-muted lg:text-lg">
            Arthrix turns workouts, meals, and daily challenges into one streak
            worth protecting — backed by an AI coach that actually knows your plan.
          </p>
          <button onClick={handleLogin} className="btn-primary entrance mt-8">
            Continue with Google
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container-arthrix">
          <h2 className="text-center font-display text-2xl font-semibold lg:text-3xl">
            Everything you need, nothing you don't
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="card hover-float">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-volt/10">
                  <Icon className="h-5 w-5 text-volt" />
                </div>
                <h3 className="font-display text-base font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section border-t border-border">
        <div className="container-arthrix flex flex-col items-center text-center">
          <h2 className="font-display text-2xl font-semibold lg:text-3xl">
            Ready to start your streak?
          </h2>
          <p className="mt-2 max-w-md text-sm text-ink-muted">
            One click, no forms, no passwords to remember.
          </p>
          <button onClick={handleLogin} className="btn-primary mt-6">
            Continue with Google
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}