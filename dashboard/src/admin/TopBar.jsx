import { Box, IconButton, Badge, Avatar } from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import "./TopBar.css";

export default function TopBar({ title, subtitle, userInitials = "AD" }) {
  return (
    <Box className="topbar">
      <Box>
        <p className="topbar-title">{title}</p>
        {subtitle && <p className="topbar-subtitle">{subtitle}</p>}
      </Box>

      <Box className="topbar-actions">
        <IconButton className="topbar-bell">
          <Badge variant="dot" color="warning">
            <NotificationsNoneOutlinedIcon fontSize="small" sx={{ color: "#374151" }} />
          </Badge>
        </IconButton>
        <Avatar className="topbar-avatar">{userInitials}</Avatar>
      </Box>
    </Box>
  );
}