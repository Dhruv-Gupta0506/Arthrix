import { useEffect, useRef, useState } from "react";
import { Dumbbell, Utensils, Flame, MessageCircle, ArrowRight, Sparkles } from "lucide-react";
import { GOOGLE_LOGIN_URL } from "../lib/utils";

const FEATURES = [
  {
    icon: Dumbbell,
    tag: "Train",
    title: "Workouts built for your goal",
    description: "Filter by fitness goal and difficulty. Every session is picked to move you forward, not just fill time.",
  },
  {
    icon: Utensils,
    tag: "Fuel",
    title: "Meals that match your macros",
    description: "Veg or non-veg, breakfast to dinner — meals mapped to your calorie and protein targets.",
  },
  {
    icon: Flame,
    tag: "Streak",
    title: "Daily challenges, real streaks",
    description: "Five challenges a day. Show up, check them off, watch your streak climb.",
  },
  {
    icon: MessageCircle,
    tag: "Coach",
    title: "An AI coach in your pocket",
    description: "Ask about form, nutrition, or your plan — get an answer that knows your profile.",
  },
];

const STEPS = [
  { index: "01", title: "Set your goal", desc: "Pick a fitness goal and difficulty. Arthrix shapes your plan around it, not the other way round." },
  { index: "02", title: "Get your plan", desc: "Workouts and meals mapped to your targets — nothing to scroll past that doesn't fit you." },
  { index: "03", title: "Protect your streak", desc: "Show up, check off your challenges, and let the AI coach keep you honest." },
];

const MARQUEE_ITEMS = ["PUSH · PULL · LEGS", "MACROS DIALED IN", "STREAKS THAT STICK", "COACHED BY AI", "NO GUESSWORK"];

function PulseLine({ className = "" }) {
  return (
    <svg viewBox="0 0 300 40" fill="none" className={className} preserveAspectRatio="none">
      <path
        d="M0 20 H80 L95 6 L110 34 L125 20 H180 L195 8 L208 32 L220 20 H300"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pulse-line-path animate-draw-line"
      />
    </svg>
  );
}

export default function LandingPage() {
  const heroRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogin = () => {
    window.location.href = GOOGLE_LOGIN_URL;
  };

  const handlePointerMove = (e) => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--spot-x", `${x}%`);
    el.style.setProperty("--spot-y", `${y}%`);
  };

  return (
    <div className="page-shell">
      {/* Header */}
      <header className={`landing-header ${scrolled ? "landing-header-scrolled" : ""}`}>
        <div className="container-arthrix flex h-16 items-center justify-between sm:h-20">
          <div className="landing-logo">
            <span className="landing-logo-mark">A</span>
            <span className="landing-logo-text">ARTHRIX</span>
          </div>
          <button onClick={handleLogin} className="btn-primary hidden sm:inline-flex">
            Continue with Google
          </button>
        </div>
      </header>

      {/* Hero */}
      <section ref={heroRef} onMouseMove={handlePointerMove} className="hero">
        <div className="hero-grid" />
        <div className="hero-spotlight" />
        <div className="container-arthrix relative z-10 grid grid-cols-1 items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div>
            <span className="hero-eyebrow">
              <Sparkles className="h-3 w-3" />
              Train with intention
            </span>
            <h1 className="hero-title">
              Your body's next rep,
              <span className="text-volt"> tracked and coached.</span>
            </h1>
            <p className="hero-subtitle">
              Arthrix turns workouts, meals, and daily challenges into one streak worth
              protecting — backed by an AI coach that actually knows your plan.
            </p>
            <div className="hero-actions">
              <button onClick={handleLogin} className="btn-primary">
                Continue with Google
                <ArrowRight className="h-4 w-4" />
              </button>
              <a href="#how-it-works" className="btn-ghost">
                See how it works
              </a>
            </div>
            <p className="hero-note">No spreadsheets. No credit card. Just sign in.</p>
            <PulseLine className="hero-pulse-wrap" />
          </div>

          {/* Device mock — built with CSS, no image needed */}
          <div className="hero-mock">
            <div className="hero-mock-card entrance">
              <div className="hero-mock-head">
                <div>
                  <p className="hero-mock-head-label">Today's session</p>
                  <p className="hero-mock-head-value">Push Day · 45 min</p>
                </div>
                <div
                  className="hero-mock-ring"
                  style={{ background: "conic-gradient(var(--color-volt) 78%, var(--color-border) 0)" }}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface">
                    <span className="hero-mock-ring-value">78%</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="hero-mock-row-done">
                  <span className="hero-mock-row-title-done">Barbell bench press</span>
                  <span className="hero-mock-row-meta">4×8</span>
                </div>
                <div className="hero-mock-row-done">
                  <span className="hero-mock-row-title-done">Incline dumbbell press</span>
                  <span className="hero-mock-row-meta">3×10</span>
                </div>
                <div className="hero-mock-row">
                  <span className="hero-mock-row-title">Weighted dips</span>
                  <span className="hero-mock-row-meta">3×12</span>
                </div>
              </div>
            </div>

            <div className="hero-chip hero-chip-streak">
              <Flame className="h-4 w-4 text-ember" />
              <div>
                <p className="hero-chip-value">12 days</p>
                <p className="hero-chip-label">Streak</p>
              </div>
            </div>

            <div className="hero-chip hero-chip-ai">
              <MessageCircle className="h-4 w-4 text-volt" />
              <div>
                <p className="hero-chip-value">Ask your coach</p>
                <p className="hero-chip-label">Always on</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="marquee-item">
              <span className="marquee-dot" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* How it works */}
      <section id="how-it-works" className="section">
        <div className="container-arthrix">
          <h2 className="text-center font-display text-2xl font-semibold lg:text-3xl">
            Three steps. No guesswork.
          </h2>
          <div className="steps-grid">
            {STEPS.map(({ index, title, desc }) => (
              <div key={index} className="step-card">
                <span className="step-index">{index}</span>
                <h3 className="step-title">{title}</h3>
                <p className="step-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section border-t border-border">
        <div className="container-arthrix">
          <h2 className="text-center font-display text-2xl font-semibold lg:text-3xl">
            Everything you need, nothing you don't
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, tag, title, description }) => (
              <div key={title} className="feature-card group">
                <div className="flex items-center justify-between">
                  <div className="feature-icon-wrap">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="feature-tag">{tag}</span>
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-ink-muted">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="cta-band section">
        <div className="hero-grid" />
        <div className="container-arthrix relative flex flex-col items-center text-center">
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

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container-arthrix flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="landing-logo">
            <span className="landing-logo-mark">A</span>
            <span className="landing-logo-text">ARTHRIX</span>
          </div>
          <p className="font-mono text-xs text-ink-faint">Train with intention.</p>
        </div>
      </footer>
    </div>
  );
}