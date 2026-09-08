import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import GateTerminal from "./GateTerminal";

function loadGuardFromSession() {
  try {
    const raw = localStorage.getItem("gate_guard") ?? sessionStorage.getItem("gate_guard");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function GateApp() {
  const [guard] = useState(loadGuardFromSession);
  const navigate = useNavigate();

  // No valid session (e.g. someone typed /gate/dashboard directly without
  // logging in) — bounce back to the shared login page.
  if (!guard) {
    return <Navigate to="/" replace />;
  }

  function handleLogout() {
    localStorage.removeItem("gate_guard");
    sessionStorage.removeItem("gate_guard");
    navigate("/", { replace: true });
  }

  return <GateTerminal guard={guard} onLogout={handleLogout} />;
}