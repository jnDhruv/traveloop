import { useState, useEffect } from "react";
import "./Signup.css";

// ─── Data ─────────────────────────────────────────────────────────────────────

const DESTINATIONS = [
  {
    city: "Santorini",
    country: "Greece",
    color: "#1a6eb5",
    desc: "Perched on volcanic cliffs, where white-washed houses spill into a glittering caldera.",
  },
  {
    city: "Kyoto",
    country: "Japan",
    color: "#c0392b",
    desc: "Ancient temples shrouded in mist, where every season paints the city in a new palette.",
  },
  {
    city: "Marrakech",
    country: "Morocco",
    color: "#e67e22",
    desc: "A labyrinth of souks and riads, alive with spice, colour, and centuries of craft.",
  },
  {
    city: "Patagonia",
    country: "Argentina",
    color: "#27ae60",
    desc: "Wild, wind-scoured landscapes where glaciers calve into impossibly turquoise lakes.",
  },
  {
    city: "Amalfi",
    country: "Italy",
    color: "#8e44ad",
    desc: "Lemon groves and pastel villages cascading down cliffs into the Tyrrhenian Sea.",
  },
];

const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Argentina",
  "Australia",
  "Austria",
  "Bangladesh",
  "Belgium",
  "Brazil",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Croatia",
  "Czech Republic",
  "Denmark",
  "Egypt",
  "Ethiopia",
  "Finland",
  "France",
  "Germany",
  "Ghana",
  "Greece",
  "Hungary",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Japan",
  "Jordan",
  "Kenya",
  "Malaysia",
  "Mexico",
  "Morocco",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "Norway",
  "Pakistan",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Romania",
  "Russia",
  "Saudi Arabia",
  "South Africa",
  "South Korea",
  "Spain",
  "Sri Lanka",
  "Sweden",
  "Switzerland",
  "Thailand",
  "Turkey",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Vietnam",
  "Zimbabwe",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPasswordStrength(pw) {
  if (!pw) return { score: 0, label: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  return { score, label: labels[score] };
}

function validate(fields) {
  const errors = {};
  if (!fields.firstName.trim()) errors.firstName = "Required";
  if (!fields.lastName.trim()) errors.lastName = "Required";
  if (!fields.email.trim()) errors.email = "Required";
  else if (!/\S+@\S+\.\S+/.test(fields.email)) errors.email = "Invalid email";
  if (!fields.phone.trim()) errors.phone = "Required";
  else if (!/^\+?[\d\s\-]{7,15}$/.test(fields.phone))
    errors.phone = "Invalid number";
  if (!fields.country) errors.country = "Required";
  if (!fields.city.trim()) errors.city = "Required";
  if (!fields.password) errors.password = "Required";
  else if (fields.password.length < 8) errors.password = "Min 8 characters";
  if (fields.password !== fields.confirm)
    errors.confirm = "Passwords don't match";
  if (!fields.terms) errors.terms = "You must agree to continue";
  return errors;
}

function Field({
  name,
  label,
  icon,
  placeholder,
  type = "text",
  fields,
  touched,
  errors,
  handleChange,
  handleBlur,
}) {

  const hasError = touched[name] && errors[name];

  return (
    <div className="signup-field">

      <label className="signup-field__label">
        {label}
      </label>

      <div className="signup-field__input-wrap">

        <span className="signup-field__icon">
          {icon}
        </span>

        <input
          name={name}
          type={type}
          value={fields[name]}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoComplete={name}
          className={`signup-field__input${
            hasError ? " signup-field__input--error" : ""
          }`}
        />

      </div>

      {hasError && (
        <span className="signup-field__error">
          {errors[name]}
        </span>
      )}

    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Signup({ onLogin, onSuccess }) {
  const [destIndex, setDestIndex] = useState(0);
  const [animState, setAnimState] = useState("enter"); // enter | exit
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [fields, setFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    password: "",
    confirm: "",
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Cycle destination panel
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimState("exit");
      setTimeout(() => {
        setDestIndex((p) => (p + 1) % DESTINATIONS.length);
        setAnimState("enter");
      }, 500);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const dest = DESTINATIONS[destIndex];
  const strength = getPasswordStrength(fields.password);

  // ── Handlers ──────────────────────────────────────

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFields((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    // Clear error on change if touched
    if (touched[name]) {
      setErrors((er) => {
        const next = { ...er };
        delete next[name];
        return next;
      });
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    const errs = validate({ ...fields });
    if (errs[name]) setErrors((er) => ({ ...er, [name]: errs[name] }));
    else
      setErrors((er) => {
        const n = { ...er };
        delete n[name];
        return n;
      });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const allTouched = Object.fromEntries(
      Object.keys(fields).map((k) => [k, true]),
    );
    setTouched(allTouched);
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1600));
    setLoading(false);
    setSubmitted(true);
  }

  // ── Render ─────────────────────────────────────────

  return (
    <div className="signup-root">
      {/* ── LEFT PANEL ─────────────────────────────── */}
      <aside className="signup-panel">
        <div className="signup-panel__bg" />
        <div
          className="signup-panel__orb signup-panel__orb--a"
          style={{ background: dest.color }}
        />
        <div className="signup-panel__orb signup-panel__orb--b" />
        <div className="signup-panel__grid" />

        <div className="signup-panel__content">
          {/* Logo */}
          <span className="signup-panel__logo">
            <span className="signup-panel__logo-mark">T</span>raveloop
          </span>

          {/* Destination showcase */}
          <div className="signup-panel__showcase">
            <div className="signup-panel__dest-label">✦ Next destination</div>
            <div
              className={`signup-panel__dest-name signup-panel__dest-name--${animState}`}
            >
              {dest.city}
            </div>
            <div
              className="signup-panel__dest-bar"
              style={{ background: dest.color }}
            />
            <div className="signup-panel__dest-country">{dest.country}</div>
            <p className="signup-panel__desc">{dest.desc}</p>

            {/* Dots */}
            <div className="signup-panel__dots">
              {DESTINATIONS.map((d, i) => (
                <button
                  key={d.city}
                  className="signup-panel__dot"
                  style={{
                    background: i === destIndex ? dest.color : undefined,
                    width: i === destIndex ? 24 : 6,
                  }}
                  onClick={() => {
                    setAnimState("exit");
                    setTimeout(() => {
                      setDestIndex(i);
                      setAnimState("enter");
                    }, 400);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="signup-panel__testimonial">
            <p className="signup-panel__quote">
              "Traveloop turned our chaotic 3-week Euro-trip into the most
              organised adventure we've ever had."
            </p>
            <div className="signup-panel__author">
              <span className="signup-panel__avatar">SR</span>
              <div>
                <div className="signup-panel__author-name">Sara R.</div>
                <div className="signup-panel__author-meta">
                  Travelled to 14 countries
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── RIGHT — FORM ───────────────────────────── */}
      <main className="signup-form-side">
        {/* Mobile-only logo */}
        <div className="signup-mobile-logo">
          <span className="signup-mobile-logo__mark">T</span>raveloop
        </div>

        <div className="signup-form-wrap">
          {submitted ? (
            /* ── SUCCESS ── */
            <div className="signup-success">
              <div className="signup-success__icon">✈️</div>
              <h2 className="signup-success__title">You're on board!</h2>
              <p className="signup-success__sub">
                Welcome to Traveloop, {fields.firstName}. Your adventure begins
                now.
              </p>
              <button
                className="signup-success__btn"
                onClick={() => onSuccess && onSuccess(fields)}
              >
                Start planning →
              </button>
            </div>
          ) : (
            <>
              {/* ── HEADER ── */}
              <div className="signup-form__eyebrow">✦ Join Traveloop</div>
              <h1 className="signup-form__title">Create your account</h1>
              <p className="signup-form__subtitle">
                Already have one?{" "}
                <button type="button" onClick={onLogin}>
                  Sign in
                </button>
              </p>

              {/* ── FORM ── */}
              <form className="signup-form" onSubmit={handleSubmit} noValidate>
                {/* Name row */}
                <div className="signup-form__row">
                  <Field
                    name="firstName"
                    label="First name"
                    icon="👤"
                    placeholder="Ada"
                    fields={fields}
                    touched={touched}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                  />
                  <Field
                    name="lastName"
                    label="Last name"
                    icon="👤"
                    placeholder="Lovelace"
                    fields={fields}
                    touched={touched}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                  />
                </div>

                {/* Email */}
                <Field
                  name="email"
                  label="Email"
                  icon="✉"
                  placeholder="ada@example.com"
                  type="email"
                  fields={fields}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />

                {/* Phone */}
                <Field
                  name="phone"
                  label="Phone number"
                  icon="📱"
                  placeholder="+91 98765 43210"
                  type="tel"
                  fields={fields}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />
                {/* Country & City row */}
                <div className="signup-form__row">
                  {/* Country select */}
                  <div className="signup-field">
                    <label className="signup-field__label">Country</label>
                    <div className="signup-field__input-wrap">
                      <span className="signup-field__icon">🌍</span>
                      <select
                        name="country"
                        value={fields.country}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`signup-field__select${
                          touched.country && errors.country
                            ? " signup-field__input--error"
                            : ""
                        }`}
                      >
                        <option value="" disabled>
                          Select…
                        </option>
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <span className="signup-field__chevron">▾</span>
                    </div>
                    {touched.country && errors.country && (
                      <span className="signup-field__error">
                        {errors.country}
                      </span>
                    )}
                  </div>

                  {/* City */}
                  <Field
                    name="city"
                    label="City"
                    icon="🏙"
                    placeholder="Mumbai"
                    fields={fields}
                    touched={touched}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                  />
                </div>

                {/* Password */}
                <div className="signup-field">
                  <label className="signup-field__label">Password</label>
                  <div className="signup-field__input-wrap">
                    <span className="signup-field__icon">🔒</span>
                    <input
                      name="password"
                      type={showPw ? "text" : "password"}
                      value={fields.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Min 8 characters"
                      className={`signup-field__input signup-field__input--with-toggle${
                        touched.password && errors.password
                          ? " signup-field__input--error"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      className="signup-field__toggle"
                      onClick={() => setShowPw((s) => !s)}
                      tabIndex={-1}
                    >
                      {showPw ? "🙈" : "👁"}
                    </button>
                  </div>
                  {touched.password && errors.password && (
                    <span className="signup-field__error">
                      {errors.password}
                    </span>
                  )}
                  {/* Strength bar */}
                  {fields.password && (
                    <div className="signup-strength">
                      <div className="signup-strength__bars">
                        {[1, 2, 3, 4].map((n) => {
                          const cls =
                            strength.score >= n
                              ? strength.score === 1
                                ? "signup-strength__bar--weak"
                                : strength.score === 2
                                  ? "signup-strength__bar--fair"
                                  : strength.score === 3
                                    ? "signup-strength__bar--good"
                                    : "signup-strength__bar--strong"
                              : "";
                          return (
                            <div
                              key={n}
                              className={`signup-strength__bar ${cls}`}
                            />
                          );
                        })}
                      </div>
                      <span className="signup-strength__label">
                        {strength.label} password
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="signup-field">
                  <label className="signup-field__label">
                    Confirm password
                  </label>
                  <div className="signup-field__input-wrap">
                    <span className="signup-field__icon">🔒</span>
                    <input
                      name="confirm"
                      type={showConfirm ? "text" : "password"}
                      value={fields.confirm}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Repeat password"
                      className={`signup-field__input signup-field__input--with-toggle${
                        touched.confirm && errors.confirm
                          ? " signup-field__input--error"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      className="signup-field__toggle"
                      onClick={() => setShowConfirm((s) => !s)}
                      tabIndex={-1}
                    >
                      {showConfirm ? "🙈" : "👁"}
                    </button>
                  </div>
                  {touched.confirm && errors.confirm && (
                    <span className="signup-field__error">
                      {errors.confirm}
                    </span>
                  )}
                </div>

                {/* Terms */}
                <div className="signup-terms">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    checked={fields.terms}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="signup-terms__checkbox"
                  />
                  <label htmlFor="terms" className="signup-terms__text">
                    I agree to the <a href="#terms">Terms of Service</a> and{" "}
                    <a href="#privacy">Privacy Policy</a>
                  </label>
                </div>
                {touched.terms && errors.terms && (
                  <span className="signup-field__error">{errors.terms}</span>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  className={`signup-submit${loading ? " signup-submit--loading" : ""}`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="signup-spinner" />
                      Creating account…
                    </>
                  ) : (
                    "Create my account →"
                  )}
                </button>

                {/* Divider */}
                <div className="signup-divider">
                  <div className="signup-divider__line" />
                  <span className="signup-divider__text">or continue with</span>
                  <div className="signup-divider__line" />
                </div>

                {/* Social buttons */}
                <div className="signup-socials">
                  <button type="button" className="signup-social-btn">
                    <span className="signup-social-btn__icon">G</span>
                    Google
                  </button>
                  <button type="button" className="signup-social-btn">
                    <span className="signup-social-btn__icon">f</span>
                    Facebook
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
