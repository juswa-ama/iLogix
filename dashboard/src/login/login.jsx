import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import nvatLogo from "../admin/NVATlogo.png";
import "./login.css";

// TEMPORARY demo credential sets — replace both with real calls to
// /api/auth/login (see server/Auth.js) before shipping this anywhere.
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

const GUARD_USERNAME = "security";
const GUARD_PASSWORD = "security123";

const DRIVER_USERNAME = "driver";
const DRIVER_PASSWORD = "driver123";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Read straight from the DOM instead of only trusting React state.
    // Browser autofill / password managers can fill the inputs without
    // firing a React onChange in time, which left `username`/`password`
    // state empty on the very first submit (fixed by the retype/second try).
    const form = e.currentTarget;
    const enteredUsername = form.username.value.trim();
    const enteredPassword = form.password.value;

    if (!enteredUsername || !enteredPassword) {
      setError("Please enter both your username/email and password.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const storage = keepSignedIn ? localStorage : sessionStorage;

      if (enteredUsername === ADMIN_USERNAME && enteredPassword === ADMIN_PASSWORD) {
        storage.setItem("admin_user", JSON.stringify({ username: enteredUsername, role: "admin" }));
        navigate("/admin/dashboard", { replace: true });
        return;
      }

      if (enteredUsername === GUARD_USERNAME && enteredPassword === GUARD_PASSWORD) {
        storage.setItem("gate_guard", JSON.stringify({ username: enteredUsername, role: "security" }));
        navigate("/gate/dashboard", { replace: true });
        return;
      }

      if (enteredUsername === DRIVER_USERNAME && enteredPassword === DRIVER_PASSWORD) {
        storage.setItem("driver_user", JSON.stringify({ username: enteredUsername, role: "driver" }));
        navigate("/driver/dashboard", { replace: true });
        return;
      }

      setError("Invalid username or password.");
      setLoading(false);
    }, 300);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <img src={nvatLogo} alt="iLogix logo" className="login-logo-img" />
          <p className="login-title">iLogix</p>
          <p className="login-subtitle">
            Nueva Vizcaya <strong>Agricultural Terminal</strong>
          </p>
        </div>

        <div className="login-heading">
          <h2>Sign In</h2>
          <p>Enter your credentials to continue</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="login-username">Username or Email</label>
            <TextField
              id="login-username"
              name="username"
              fullWidth
              size="small"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <TextField
              id="login-password"
              name="password"
              type="password"
              fullWidth
              size="small"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
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

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="login-hint">
          Admin: admin / admin123 &nbsp;·&nbsp; Guard: security / security123 &nbsp;·&nbsp; Driver: driver / driver123
        </p>
      </div>
    </div>
  );
}