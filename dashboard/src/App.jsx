import { useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import Dashboard from "./admin/Dashboard";
import DriverManagement from "./admin/DriverManagement";
import InboundDeliveries from "./admin/InboundDeliveries";
import RfidEntrance from "./admin/RfidEntrance";
import ReportsAnalytics from "./admin/ReportAnalytics";
import Sidebar, { SIDEBAR_WIDTH } from "./admin/SideBar";
import Login from "./login/login";
import GateApp from "./terminal/GateApp";

const ADMIN_PAGES = {
  dashboard: Dashboard,
  drivers: DriverManagement,
  deliveries: InboundDeliveries,
  rfid: RfidEntrance,
  reports: ReportsAnalytics,
};

function loadAdminFromSession() {
  try {
    const raw = localStorage.getItem("admin_user") ?? sessionStorage.getItem("admin_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Everything under /admin/* — protected by the session set at login,
// with the sidebar driving real URLs instead of just internal state.
function AdminArea() {
  const [admin] = useState(loadAdminFromSession);
  const navigate = useNavigate();
  const location = useLocation();

  if (!admin) {
    return <Navigate to="/" replace />;
  }

  // "/admin/dashboard" -> "dashboard", "/admin/drivers" -> "drivers", etc.
  const activeKey = location.pathname.split("/")[2] || "dashboard";
  const ActivePage = ADMIN_PAGES[activeKey] || Dashboard;

function handleLogout() {
  localStorage.removeItem("admin_user");
  sessionStorage.removeItem("admin_user");
  navigate("/", { replace: true });
}

  return (
    <Box className="app-shell">
      <CssBaseline />
      <Sidebar active={activeKey} onNavigate={(key) => navigate(`/admin/${key}`)} onLogout={handleLogout} />
      <Box component="main" className="app-main" style={{ marginLeft: SIDEBAR_WIDTH }}>
        <ActivePage />
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin/*" element={<AdminArea />} />
      <Route path="/gate/*" element={<GateApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
