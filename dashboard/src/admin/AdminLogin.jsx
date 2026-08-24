import { useState } from "react";
import "./AdminLogin.css";
import nvatLogo from "./NVATlogo.png";

export default function AdminLogin({ onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both your username/email and password.");
      return;
    }

    if (!onSubmit) return;

    try {
      setLoading(true);
      await onSubmit({ email, password, keepSignedIn });
    } catch (err) {
      setError(err?.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          {!logoFailed ? (
            <img
              src={nvatLogo}
              alt="iLogix logo"
              className="login-logo-img"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <div className="login-logo-placeholder">
              <span role="img" aria-label="iLogix">
                🚙
              </span>
            </div>
          )}

          <h1 className="login-title">iLogix</h1>
          <p className="login-subtitle">
            Nueva Vizcaya <strong>Agricultural Terminal</strong>
          </p>
        </div>

        <div className="login-heading">
          <h2>Sign In</h2>
          <p>Enter your credentials to access the portal</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="email">Username or Email</label>
            <input
              id="email"
              type="text"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ilogix.com"
              className="login-input"
            />
          </div>

          <div className="login-field">
            <div className="login-field-row">
              <label htmlFor="password">Password</label>
              <button
                type="button"
                className="login-forgot-btn"
                onClick={() => {
                }}
              >
                Forgot password?
              </button>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="login-input"
            />
          </div>

          <div className="login-toggle-row">
            <button
              type="button"
              role="switch"
              aria-checked={keepSignedIn}
              onClick={() => setKeepSignedIn((v) => !v)}
              className={`login-toggle ${keepSignedIn ? "on" : ""}`}
            >
              <span className="login-toggle-knob" />
            </button>
            <span className="login-toggle-label">Keep me signed in</span>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" disabled={loading} className="login-submit-btn">
            {loading ? "Signing in..." : "Sign In to Portal"}
          </button>
        </form>

        <p className="login-footer">
          Need system access?{" "}
          <a href="#" onClick={(e) => e.preventDefault()}>
            Contact your administrator
          </a>
        </p>
      </div>
    </div>
  );
}