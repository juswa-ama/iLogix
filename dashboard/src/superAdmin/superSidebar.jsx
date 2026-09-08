import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Button } from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
// Adjust this import path to wherever NVATlogo.png actually lives relative to this file
import nvatLogo from "../admin/NVATlogo.png";
import "../admin/styles/shared.css";
import "./superSidebar.css";

export const SUPER_SIDEBAR_WIDTH = 260;

const NAV_ITEMS = [
  { key: "employees", label: "Employee Management", icon: PeopleAltOutlinedIcon },
  { key: "audit", label: "Audit Logs", icon: AssessmentOutlinedIcon },
  { key: "settings", label: "Settings", icon: SettingsOutlinedIcon },
];

export default function SuperAdminSideBar({ active, onNavigate, onLogout }) {
  return (
    <Drawer variant="permanent" slotProps={{ paper: { className: "super-sidebar-paper" } }}>
      <Box>
        <Box className="super-sidebar-brand">
          <img src={nvatLogo} alt="iLogix logo" className="super-sidebar-logo" />
          <Box>
            <p className="super-sidebar-brand-name">iLogix</p>
            <p className="super-sidebar-brand-sub">Super Admin Console</p>
          </Box>
        </Box>

        <List className="super-sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            return (
              <ListItemButton
                key={item.key}
                selected={isActive}
                onClick={() => onNavigate?.(item.key)}
                className="super-sidebar-nav-item"
              >
                <ListItemIcon className="super-sidebar-nav-icon">
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  className="super-sidebar-nav-label"
                  slotProps={{ primary: { fontWeight: isActive ? 600 : 500 } }}
                  primary={item.label}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Box className="super-sidebar-footer">
        <Button
          fullWidth
          onClick={onLogout}
          startIcon={<LogoutOutlinedIcon fontSize="small" />}
          className="super-sidebar-logout-btn"
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
}