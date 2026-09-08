import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import NfcOutlinedIcon from "@mui/icons-material/NfcOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import { Box, Button, Drawer, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
// Adjust this import path to wherever NVATlogo.png actually lives relative to this file
import nvatLogo from "./NVATlogo.png";
import "./SideBar.css";
import "./styles/shared.css";

export const SIDEBAR_WIDTH = 260;

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: DashboardOutlinedIcon },
  { key: "drivers", label: "Driver Management", icon: PeopleAltOutlinedIcon },
  { key: "deliveries", label: "Inbound Deliveries", icon: LocalShippingOutlinedIcon },
  { key: "rfid", label: "RFID Entrance", icon: NfcOutlinedIcon },
  { key: "reports", label: "Reports & Analytics", icon: BarChartOutlinedIcon },
];

export default function Sidebar({ active, onNavigate, onLogout }) {
  return (
    <Drawer variant="permanent" slotProps={{ paper: { className: "sidebar-paper" } }}>
      <Box>
        <Box className="sidebar-brand">
          <img src={nvatLogo} alt="iLogix logo" className="sidebar-logo" />
          <Box>
            <p className="sidebar-brand-name">iLogix</p>
            <p className="sidebar-brand-sub">Administration Portal</p>
          </Box>
        </Box>

        <List className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            return (
              <ListItemButton
                key={item.key}
                selected={isActive}
                onClick={() => onNavigate?.(item.key)}
                className="sidebar-nav-item"
              >
                <ListItemIcon className="sidebar-nav-icon">
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  className="sidebar-nav-label"
                  slotProps={{ primary: { fontWeight: isActive ? 600 : 500 } }}
                  primary={item.label}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Box className="sidebar-footer">
        <Button
          fullWidth
          onClick={onLogout}
          startIcon={<LogoutOutlinedIcon fontSize="small" />}
          className="sidebar-logout-btn"
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
}