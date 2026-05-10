import { useState } from "react";
import "./Login.css";

// ─── Data ──────────────────────────────────────────────────────────────────────

const TRIP_CARDS = [
  { emoji: "🏔️", city: "Manali, India",      badge: "5 days · Dec 2025" },
  { emoji: "🌊", city: "Bali, Indonesia",     badge: "10 days · Mar 2026" },
  { emoji: "🏛️", city: "Rome, Italy",         badge: "7 days · Jun 2026" },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function validate(fields) {
  const errors = {};
  if (!fields.email.trim())
    errors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(fields.email))
    errors.email = "Enter a valid email";
  if (!fields.password)
    errors.password = "Password is required";
  else if (fields.password.length < 6)
    errors.password = "Min 6 characters";
  return errors;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function Login({ onSignup, onSuccess }) {
  const [fields, setFields]   = useState({ email: "", password: "", remember: false });
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [shake, setShake]     = useState(false);

  // ── Handlers ────────────────────────────────────────

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFields((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    if (touched[name]) {
      const errs = validate({ ...fields, [name]: type === "checkbox" ? checked : value });
      setErrors((er) => ({ ...er, [name]: errs[name] }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    const errs = validate(fields);
    setErrors((er) => ({ ...er, [name]: errs[name] || undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const errs = validate(fields);
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      // Shake the card on error
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setLoggedIn(true);
  }

  // ── Render ──────────────────────────────────────────

  return (
    <div className="login-root">

      {/* ── LEFT PANEL ───────────────────────────────── */}
      <aside className="login-panel">
        <div className="login-panel__dots" />
        <div className="login-panel__glow" />
        <div className="login-panel__glow2" />

        <div className="login-panel__content">

          {/* Logo */}
          <span className="login-panel__logo">
            <span className="login-panel__logo-mark">T</span>raveloop
          </span>

          {/* Headline */}
          <div className="login-panel__headline">
            <div className="login-panel__tag">
              ✦ &nbsp;Welcome back, explorer
            </div>
            <h1 className="login-panel__title">
              Your trips are<br />
              <em>waiting for you.</em>
            </h1>
            <p className="login-panel__body">
              Sign in to pick up right where you left off — itineraries,
              budgets, and memories all in one loop.
            </p>

            {/* Stats */}
            <div className="login-panel__stats">
              {[
                { num: "50K+", label: "Trips planned" },
                { num: "120+", label: "Countries" },
                { num: "4.9★", label: "Rating" },
              ].map((s) => (
                <div key={s.label} className="login-panel__stat">
                  <div className="login-panel__stat-num">{s.num}</div>
                  <div className="login-panel__stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Floating trip cards */}
            <div className="login-panel__cards">
              {TRIP_CARDS.map((c) => (
                <div key={c.city} className="login-panel__card">
                  <span className="login-panel__card-emoji">{c.emoji}</span>
                  <div>
                    <div className="login-panel__card-city">{c.city}</div>
                    <div className="login-panel__card-meta">Upcoming trip</div>
                  </div>
                  <span className="login-panel__card-badge">{c.badge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="login-panel__testimonial">
            <p className="login-panel__quote">
              "Every morning of our trip I opened Traveloop — it was like having
              a personal travel concierge in my pocket."
            </p>
            <div className="login-panel__author">
              <div className="login-panel__avatar">AK</div>
              <div>
                <div className="login-panel__author-name">Arjun K.</div>
                <div className="login-panel__author-meta">Solo traveller · 22 countries</div>
              </div>
            </div>
          </div>

        </div>
      </aside>

      {/* ── RIGHT — FORM SIDE ─────────────────────────── */}
      <main className="login-form-side">

        {/* Mobile logo */}
        <div className="login-mobile-logo">
          <span className="login-mobile-logo__mark">T</span>raveloop
        </div>

        {/* Card */}
        <div
          className="login-card"
          style={
            shake
              ? { animation: "shakeX 0.45s cubic-bezier(.36,.07,.19,.97) both" }
              : undefined
          }
        >
          {loggedIn ? (

            /* ── SUCCESS ── */
            <div className="login-success">
              <div className="login-success__icon">🗺️</div>
              <h2 className="login-success__title">Welcome back!</h2>
              <p className="login-success__sub">
                Great to see you again. Your trips are ready to explore.
              </p>
              <button
                className="login-success__btn"
                onClick={() => onSuccess && onSuccess(fields)}
              >
                Go to dashboard →
              </button>
            </div>

          ) : (

            <>
              {/* ── HEADER ── */}
              <div className="login-form__eyebrow">✦ Sign in</div>
              <h1 className="login-form__title">Welcome back</h1>
              <p className="login-form__subtitle">
                New here?{" "}
                <button type="button" onClick={onSignup}>
                  Create a free account
                </button>
              </p>

              {/* ── FORM ── */}
              <form className="login-form" onSubmit={handleSubmit} noValidate>

                {/* Email */}
                <div className="login-field">
                  <label className="login-field__label">Email</label>
                  <div className="login-field__input-wrap">
                    <span className="login-field__icon">✉</span>
                    <input
                      name="email"
                      type="email"
                      value={fields.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className={`login-field__input${
                        touched.email && errors.email ? " login-field__input--error" : ""
                      }`}
                    />
                  </div>
                  {touched.email && errors.email && (
                    <span className="login-field__error">{errors.email}</span>
                  )}
                </div>

                {/* Password */}
                <div className="login-field">
                  <label className="login-field__label">Password</label>
                  <div className="login-field__input-wrap">
                    <span className="login-field__icon">🔒</span>
                    <input
                      name="password"
                      type={showPw ? "text" : "password"}
                      value={fields.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Your password"
                      autoComplete="current-password"
                      className={`login-field__input login-field__input--padded${
                        touched.password && errors.password ? " login-field__input--error" : ""
                      }`}
                    />
                    <button
                      type="button"
                      className="login-field__toggle"
                      onClick={() => setShowPw((s) => !s)}
                      tabIndex={-1}
                    >
                      {showPw ? "🙈" : "👁"}
                    </button>
                  </div>
                  {touched.password && errors.password && (
                    <span className="login-field__error">{errors.password}</span>
                  )}
                </div>

                {/* Remember + Forgot */}
                <div className="login-form__meta">
                  <label className="login-remember">
                    <input
                      type="checkbox"
                      name="remember"
                      checked={fields.remember}
                      onChange={handleChange}
                      className="login-remember__checkbox"
                    />
                    <span className="login-remember__label">Remember me</span>
                  </label>
                  <button type="button" className="login-forgot">
                    Forgot password?
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="login-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="login-spinner" />
                      Signing in…
                    </>
                  ) : (
                    "Sign in →"
                  )}
                </button>

                {/* Divider */}
                <div className="login-divider">
                  <div className="login-divider__line" />
                  <span className="login-divider__text">or</span>
                  <div className="login-divider__line" />
                </div>

                {/* Social */}
                <div className="login-socials">
                  <button type="button" className="login-social-btn">
                    <span className="login-social-btn__icon login-social-btn__icon--g">G</span>
                    Google
                  </button>
                  <button type="button" className="login-social-btn">
                    <span className="login-social-btn__icon login-social-btn__icon--f">f</span>
                    Facebook
                  </button>
                </div>

              </form>
            </>
          )}

          {/* Footer note */}
          {!loggedIn && (
            <p className="login-card__footer">
              Protected by 256-bit encryption ·{" "}
              <a href="#privacy">Privacy Policy</a>
            </p>
          )}
        </div>

      </main>

      {/* Shake keyframe injected inline so it's self-contained */}
      <style>{`
        @keyframes shakeX {
          0%,100% { transform: translateX(0); }
          15%      { transform: translateX(-8px); }
          30%      { transform: translateX(7px); }
          45%      { transform: translateX(-5px); }
          60%      { transform: translateX(4px); }
          75%      { transform: translateX(-2px); }
        }
      `}</style>

    </div>
  );
}