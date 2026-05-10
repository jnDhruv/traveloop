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
  "Afghanistan","Albania","Algeria","Argentina","Australia","Austria","Bangladesh",
  "Belgium","Brazil","Canada","Chile","China","Colombia","Croatia","Czech Republic",
  "Denmark","Egypt","Ethiopia","Finland","France","Germany","Ghana","Greece","Hungary",
  "India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Japan","Jordan","Kenya",
  "Malaysia","Mexico","Morocco","Netherlands","New Zealand","Nigeria","Norway","Pakistan",
  "Peru","Philippines","Poland","Portugal","Romania","Russia","Saudi Arabia","South Africa",
  "South Korea","Spain","Sri Lanka","Sweden","Switzerland","Thailand","Turkey","Ukraine",
  "United Arab Emirates","United Kingdom","United States","Vietnam","Zimbabwe",
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

  if (!fields.email.trim()) {
    errors.email = "Required";
  } else if (!/\S+@\S+\.\S+/.test(fields.email)) {
    errors.email = "Invalid email";
  }

  if (!fields.phone.trim()) {
    errors.phone = "Required";
  } else if (!/^\+?[\d\s\-]{7,15}$/.test(fields.phone)) {
    errors.phone = "Invalid number";
  }

  if (!fields.country) errors.country = "Required";
  if (!fields.city.trim()) errors.city = "Required";

  if (!fields.password) {
    errors.password = "Required";
  } else if (fields.password.length < 8) {
    errors.password = "Min 8 characters";
  }

  if (fields.password !== fields.confirm) {
    errors.confirm = "Passwords don't match";
  }

  if (!fields.terms) {
    errors.terms = "You must agree to continue";
  }

  return errors;
}

// ─── FIXED FIELD COMPONENT ───────────────────────────────────────────────────

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
      <label className="signup-field__label">{label}</label>

      <div className="signup-field__input-wrap">
        <span className="signup-field__icon">{icon}</span>

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
  const [animState, setAnimState] = useState("enter");

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

  // ─── Destination Animation ───────────────────────

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

  // ─── Handlers ────────────────────────────────────

  function handleChange(e) {

    const { name, value, type, checked } = e.target;

    setFields((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));

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

    setTouched((t) => ({
      ...t,
      [name]: true,
    }));

    const errs = validate({ ...fields });

    if (errs[name]) {
      setErrors((er) => ({
        ...er,
        [name]: errs[name],
      }));
    } else {
      setErrors((er) => {
        const n = { ...er };
        delete n[name];
        return n;
      });
    }
  }

  async function handleSubmit(e) {

    e.preventDefault();

    const allTouched = Object.fromEntries(
      Object.keys(fields).map((k) => [k, true])
    );

    setTouched(allTouched);

    const errs = validate(fields);

    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    setLoading(true);

    await new Promise((r) => setTimeout(r, 1600));

    setLoading(false);

    setSubmitted(true);
  }

  return (
    <div className="signup-root">

      {/* Example fixed field usage */}

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

    </div>
  );
}