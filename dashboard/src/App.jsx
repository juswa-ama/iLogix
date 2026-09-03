import { useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import Dashboard from "./admin/Dashboard";
import DriverManagement from "./admin/DriverManagement";
import InboundDeliveries from "./admin/InboundDeliveries";
import RfidEntrance from "./admin/RfidEntrance";
import ReportsAnalytics from "./admin/ReportAnalytics"; // note: no "s" on your filename
import Sidebar, { SIDEBAR_WIDTH } from "./admin/SideBar";
import AdminLogin from "./admin/AdminLogin";

const PAGES = {
  dashboard: Dashboard,
  drivers: DriverManagement,
  deliveries: InboundDeliveries,
  rfid: RfidEntrance,
  reports: ReportsAnalytics,
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const ActivePage = PAGES[activePage];

  async function handleLogin({ email, password }) {
    // TODO: replace with a real API call to your auth endpoint
    if (!email || !password) {
      throw new Error("Please enter both your username/email and password.");
    }
    setIsAuthenticated(true);
  }

  if (!isAuthenticated) {
    return <AdminLogin onSubmit={handleLogin} />;
  }

  return (
    <Box className="app-shell">
      <CssBaseline />
      <Sidebar
        active={activePage}
        onNavigate={setActivePage}
        onLogout={() => {
          setIsAuthenticated(false);
        }}
      />
      <Box component="main" className="app-main" style={{ marginLeft: SIDEBAR_WIDTH }}>
        <ActivePage />
      </Box>
    </Box>
  );
}