import { Box, CssBaseline } from "@mui/material";
import { useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Dashboard from "./admin/Dashboard";
import DriverManagement from "./admin/DriverManagement";
import InboundDeliveries from "./admin/InboundDeliveries";
import ReportsAnalytics from "./admin/ReportAnalytics";
import RfidEntrance from "./admin/RfidEntrance";
import Sidebar, { SIDEBAR_WIDTH } from "./admin/SideBar";
import DriverApp from "./driver/DriverApp";
import Login from "./login/login";
import GateApp from "./terminal/GateApp";
import SuperAdmin from "./superAdmin/superAdmin";

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

function loadSuperAdminFromSession() {
  try {
    const raw = localStorage.getItem("super_admin") ?? sessionStorage.getItem("super_admin");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function SuperAdminArea() {
  const [superAdmin] = useState(loadSuperAdminFromSession);
  const navigate = useNavigate();

  if (!superAdmin) {
    return <Navigate to="/" replace />;
  }

  function handleLogout() {
    localStorage.removeItem("super_admin");
    sessionStorage.removeItem("super_admin");
    navigate("/", { replace: true });
  }

  return <SuperAdmin user={superAdmin} onLogout={handleLogout} />;
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
      <Route path="/superadmin/*" element={<SuperAdminArea />} />
      <Route path="/gate/*" element={<GateApp />} />
      <Route path="/driver/*" element={<DriverApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
