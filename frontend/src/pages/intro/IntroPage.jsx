import { useState, useEffect, useRef } from "react";
import "./IntroPage.css";

const DESTINATIONS = [
  { city: "Santorini", country: "Greece",    emoji: "🇬🇷", color: "#1a6eb5" },
  { city: "Kyoto",     country: "Japan",     emoji: "🇯🇵", color: "#c0392b" },
  { city: "Marrakech", country: "Morocco",   emoji: "🇲🇦", color: "#e67e22" },
  { city: "Patagonia", country: "Argentina", emoji: "🇦🇷", color: "#27ae60" },
  { city: "Amalfi",    country: "Italy",     emoji: "🇮🇹", color: "#8e44ad" },
];

const FEATURES = [
  {
    icon: "✦",
    title: "Smart Itineraries",
    desc: "Build day-by-day plans with curated activities, dining, and stays — all in one place.",
  },
  {
    icon: "◈",
    title: "Budget Tracking",
    desc: "Set budgets per city, log expenses, and never get caught off-guard mid-trip.",
  },
  {
    icon: "⬡",
    title: "Packing Lists",
    desc: "Auto-generated or custom packing lists that travel with your itinerary.",
  },
  {
    icon: "❋",
    title: "Share & Explore",
    desc: "Publish your trips to the community or share a private link with travel companions.",
  },
];

const STATS = [
  { num: "50K+", label: "Trips planned" },
  { num: "120+", label: "Countries covered" },
  { num: "4.9★", label: "User rating" },
  { num: "Free", label: "Always & forever" },
];

const STEPS = [
  { step: "01", title: "Create your trip", desc: "Name it, set dates, pick your cities." },
  { step: "02", title: "Build your days",  desc: "Add activities, stays, and meals from our curated library." },
  { step: "03", title: "Travel & track",   desc: "Log costs, check off packing, share with friends." },
];

export function IntroPage({ onGetStarted, onLogin }) {
  const [activeDestination, setActiveDestination] = useState(0);
  const [scrolled, setScrolled]                   = useState(false);
  const [visible, setVisible]                     = useState({});
  const featureRefs = useRef([]);

  // Cycle destinations every 2.8 s
  useEffect(() => {
    const timer = setInterval(
      () => setActiveDestination((p) => (p + 1) % DESTINATIONS.length),
      2800
    );
    return () => clearInterval(timer);
  }, []);

  // Sticky nav shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-reveal for feature cards
  useEffect(() => {
    const observers = featureRefs.current.map((ref, i) => {
      if (!ref) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setVisible((v) => ({ ...v, [i]: true }));
        },
        { threshold: 0.2 }
      );
      obs.observe(ref);
      return obs;
    });
    return () => observers.forEach((o) => o && o.disconnect());
  }, []);

  const dest = DESTINATIONS[activeDestination];

  return (
    <div className="intro-root">

      {/* ── NAV ─────────────────────────────────────── */}
      <nav className={`intro-nav${scrolled ? " intro-nav--scrolled" : ""}`}>
        <div className="intro-nav__inner">
          <span className="intro-logo">
            <span className="intro-logo__mark">T</span>raveloop
          </span>
          <div className="intro-nav__links">
            <button className="intro-nav__link" onClick={onLogin}>
              Sign in
            </button>
            <button className="btn-cta-small" onClick={onGetStarted}>
              Get started
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────── */}
      <section className="intro-hero">
        {/* Background layers */}
        <div className="intro-hero__mesh-bg" />
        {/* Dynamic colour orb — only the colour changes, driven by JS */}
        <div className="intro-hero__orb" style={{ background: dest.color }} />
        <div className="intro-hero__orb2" />

        {/* Floating destination card (desktop only) */}
        <div className="intro-hero__floating-cards">
          {DESTINATIONS.map((d, i) => (
            <div
              key={d.city}
              className="intro-hero__floating-card"
              style={{
                opacity:   i === activeDestination ? 1 : 0,
                transform: i === activeDestination
                  ? "translateY(0) scale(1)"
                  : "translateY(12px) scale(0.95)",
              }}
            >
              <span className="intro-hero__card-emoji">{d.emoji}</span>
              <div>
                <div className="intro-hero__card-city">{d.city}</div>
                <div className="intro-hero__card-country">{d.country}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Hero copy */}
        <div className="intro-hero__content">
          <div className="intro-hero__eyebrow">✦ Your journey, beautifully planned</div>

          <h1 className="intro-hero__title">
            Every trip
            <br />
            <span
              className="intro-hero__title-accent"
              style={{ color: dest.color }}
            >
              deserves a
            </span>
            <br />
            great story.
          </h1>

          <p className="intro-hero__sub">
            Traveloop turns scattered plans into seamless adventures — itineraries,
            budgets, packing lists, and memories, all in one loop.
          </p>

          <div className="intro-hero__actions">
            <button className="btn-cta-primary" onClick={onGetStarted}>
              Start planning free <span className="cta-arrow">→</span>
            </button>
            <button className="btn-cta-ghost" onClick={onLogin}>
              I have an account
            </button>
          </div>

          {/* Ticker dots */}
          <div className="intro-hero__ticker">
            {DESTINATIONS.map((d, i) => (
              <button
                key={d.city}
                className="intro-hero__ticker-dot"
                style={{
                  background: i === activeDestination
                    ? dest.color
                    : "rgba(255,255,255,0.2)",
                  width: i === activeDestination ? 28 : 8,
                }}
                onClick={() => setActiveDestination(i)}
              />
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="intro-hero__scroll-hint">
          <div className="intro-hero__scroll-line" />
          <span className="intro-hero__scroll-text">scroll</span>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────── */}
      <section className="intro-stats">
        {STATS.map((s) => (
          <div key={s.label} className="intro-stats__item">
            <div className="intro-stats__num">{s.num}</div>
            <div className="intro-stats__label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── FEATURES ────────────────────────────────── */}
      <section className="intro-features">
        <div className="intro-section-tag">◈ What's inside</div>
        <h2 className="intro-section-title">Everything your trip needs</h2>

        <div className="intro-features__grid">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              ref={(el) => (featureRefs.current[i] = el)}
              className={`intro-feature-card ${
                visible[i]
                  ? "intro-feature-card--visible"
                  : "intro-feature-card--hidden"
              }`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <span className="intro-feature-card__icon">{f.icon}</span>
              <h3 className="intro-feature-card__title">{f.title}</h3>
              <p className="intro-feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────── */}
      <section className="intro-steps">
        <div className="intro-section-tag">❋ How it works</div>
        <h2 className="intro-section-title">Plan in three steps</h2>

        <div className="intro-steps__row">
          {STEPS.map((s, i) => (
            <div key={s.step} className="intro-step-card">
              <div className="intro-step-card__num">{s.step}</div>
              {i < STEPS.length - 1 && (
                <div className="intro-step-card__connector" />
              )}
              <h3 className="intro-step-card__title">{s.title}</h3>
              <p className="intro-step-card__desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────── */}
      <section className="intro-cta-banner">
        <div className="intro-cta-banner__orb" />
        <h2 className="intro-cta-banner__title">Ready to loop in?</h2>
        <p className="intro-cta-banner__sub">
          Join thousands of travelers who plan smarter with Traveloop.
        </p>
        <button className="btn-cta-primary" onClick={onGetStarted}>
          Create your first trip <span className="cta-arrow">→</span>
        </button>
      </section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer className="intro-footer">
        <span className="intro-logo">
          <span className="intro-logo__mark">T</span>raveloop
        </span>
        <span className="intro-footer__text">© 2025 Traveloop. Made for wanderers.</span>
      </footer>

    </div>
  );
}
