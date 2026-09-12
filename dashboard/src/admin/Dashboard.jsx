import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
    Avatar,
    Box,
    Button,
    Card,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import "./Dashboard.css";
import StatCard from "./StatCard";
import StatusChip from "./StatusChip";
import "./styles/shared.css";
import TopBar from "./TopBar";

// TODO: point this at your real API base URL (e.g. via an env var)
const API_BASE = "/api";

const DATE_RANGE_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7d", label: "Last 7 Days" },
  { value: "month", label: "This Month" },
  { value: "custom", label: "Custom Range" },
];

// Shape the dashboard expects back from the server:
// {
//   stats: { vehiclesToday, produceReceivedKg, registeredDrivers, walkIn },
//   liveVehicles: [{ id, driver, plate, farmers, weight, status, rfidVerified }],
//   walkInDrivers: [{ id, driver, plate, farmers, weight, status, rfidVerified }],
//   rfidEntrance: { online, todaysScans, lastScan, readerHealth },
//   todaysSummary: { completedDeliveries, totalFarmers }
// }
const EMPTY_DASHBOARD = {
  stats: null,
  liveVehicles: [],
  walkInDrivers: [],
  rfidEntrance: null,
  todaysSummary: null,
};

function initialsOf(name = "") {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function DriverTable({ rows, emptyMessage = "No records yet." }) {
  if (!rows || rows.length === 0) {
    return <p className="empty-state-text">{emptyMessage}</p>;
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            {["Driver", "Plate No.", "Farmers", "Total Weight", "RFID", "Status", "Action"].map((h) => (
              <TableCell key={h} className="data-table-head-cell">
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="driver-cell">
                <Box className="driver-cell-inner">
                  <Avatar sx={{ bgcolor: row.color || "#14532d", width: 32, height: 32, fontSize: "0.75rem" }}>
                    {row.initials || initialsOf(row.driver)}
                  </Avatar>
                  <Box>
                    <p className="driver-name">{row.driver}</p>
                    <p className="driver-id">{row.id}</p>
                  </Box>
                </Box>
              </TableCell>
              <TableCell className="data-table-cell strong">{row.plate}</TableCell>
              <TableCell className="data-table-cell">{row.farmers}</TableCell>
              <TableCell className="data-table-cell">{row.weight}</TableCell>
              <TableCell className="data-table-cell">
                {row.rfidVerified && (
                  <Chip
                    icon={<CheckCircleOutlinedIcon sx={{ fontSize: "0.9rem !important" }} />}
                    label="Verified"
                    size="small"
                    className="verified-inline-chip"
                  />
                )}
              </TableCell>
              <TableCell className="data-table-cell">
                <StatusChip label={row.status} />
              </TableCell>
              <TableCell className="data-table-cell">
                <Button size="small" variant="contained" className="btn-solid-sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function SectionCard({ title, subtitle, action, children }) {
  return (
    <Card variant="outlined" className="panel-card">
      <Box className="panel-header">
        <Box>
          <p className="panel-title">{title}</p>
          {subtitle && <p className="panel-subtitle">{subtitle}</p>}
        </Box>
        {action}
      </Box>
      {children}
    </Card>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(EMPTY_DASHBOARD);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [dateRange, setDateRange] = useState("today");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ range: dateRange });
      if (dateRange === "custom") {
        if (customFrom) params.set("from", customFrom);
        if (customTo) params.set("to", customTo);
      }

      const res = await fetch(`${API_BASE}/dashboard?${params.toString()}`);
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const json = await res.json();
      setData({ ...EMPTY_DASHBOARD, ...json });
    } catch (err) {
      setError("Unable to load dashboard data. Showing no data until the server responds.");
      setData(EMPTY_DASHBOARD);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
    // Custom range re-fetches only when "Apply" is clicked (see button below),
    // so it's intentionally excluded from this dependency list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  const { stats, liveVehicles, walkInDrivers, rfidEntrance, todaysSummary } = data;
  const activeRangeLabel = DATE_RANGE_OPTIONS.find((opt) => opt.value === dateRange)?.label;

  return (
    <Box>
      <TopBar title="Dashboard" subtitle="Nueva Vizcaya Agricultural Terminal" />

      {error && <p className="empty-state-text" style={{ color: "#b45309" }}>{error}</p>}

      <Box className="stats-filter-bar">
        <Box className="stats-filter-left">
          <CalendarTodayOutlinedIcon className="stats-filter-icon" />
          <span className="stats-filter-label">Data range</span>
          <span className="stats-filter-active-pill">{activeRangeLabel}</span>
        </Box>

        <Box className="stats-filter-right">
          <Box className="stats-filter-select-wrap">
            <select
              className="stats-filter-select"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              {DATE_RANGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <KeyboardArrowDownOutlinedIcon className="stats-filter-chevron" />
          </Box>

          {dateRange === "custom" && (
            <>
              <Box className="stats-filter-divider" />
              <input
                type="date"
                className="stats-filter-date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
              />
              <span className="stats-filter-dash">to</span>
              <input
                type="date"
                className="stats-filter-date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
              />
              <Button
                size="small"
                variant="contained"
                className="btn-solid-sm"
                onClick={loadDashboard}
                disabled={loading || !customFrom || !customTo}
              >
                Apply
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Box className="dashboard-stats-grid">
        <StatCard
          label="Vehicles Today"
          value={stats ? stats.vehiclesToday : "—"}
          delta={stats?.vehiclesTodayDelta || "No data yet"}
        />
        <StatCard
          label="Produce Received"
          value={stats ? `${stats.produceReceivedKg} kg` : "—"}
          delta={stats?.produceReceivedDelta || "No data yet"}
        />
        <StatCard
          label="Registered Drivers"
          value={stats ? stats.registeredDrivers : "—"}
          delta={stats?.registeredDriversDelta || "No data yet"}
          deltaColor="#b45309"
        />
        <StatCard
          label="Walk-in"
          value={stats ? stats.walkIn : "—"}
          delta={stats?.walkInDelta || "No data yet"}
          deltaColor="#b45309"
        />
      </Box>

      <Box className="dashboard-sections">
        <SectionCard
          title="Live Vehicle Monitoring"
          subtitle="Vehicles currently processing deliveries"
          action={
            <Box className="panel-header-actions">
              <Button
                size="small"
                startIcon={<RefreshIcon fontSize="small" />}
                className="btn-ghost-sm"
                onClick={loadDashboard}
                disabled={loading}
              >
                Refresh
              </Button>
              <Button size="small" variant="contained" className="btn-solid-sm">
                View All
              </Button>
            </Box>
          }
        >
          <DriverTable rows={liveVehicles} emptyMessage="No vehicles currently processing." />
        </SectionCard>

        <SectionCard
          title="Walk-in Drivers"
          subtitle="Vehicles that walked in today"
          action={
            <Box className="panel-header-actions">
              <Button
                size="small"
                startIcon={<RefreshIcon fontSize="small" />}
                className="btn-ghost-sm"
                onClick={loadDashboard}
                disabled={loading}
              >
                Refresh
              </Button>
              <Button size="small" variant="contained" className="btn-solid-sm">
                View All
              </Button>
            </Box>
          }
        >
          <DriverTable rows={walkInDrivers} emptyMessage="No walk-in drivers today." />
        </SectionCard>
      </Box>

      <Box className="dashboard-bottom-grid">
        <Card variant="outlined" className="panel-card">
          <Box className="rfid-summary-header">
            <Box>
              <p className="panel-title">RFID Entrance</p>
              <p className="panel-subtitle">Main Entrance Gate</p>
            </Box>
            <Chip
              label={rfidEntrance?.online ? "ONLINE" : "OFFLINE"}
              size="small"
              className="rfid-online-chip"
            />
          </Box>
          <Box className="rfid-summary-stats">
            <Box>
              <p className="rfid-summary-stat-label">Today's Scans</p>
              <p className="rfid-summary-stat-value">{rfidEntrance?.todaysScans ?? "—"}</p>
            </Box>
            <Box>
              <p className="rfid-summary-stat-label">Last Scan</p>
              <p className="rfid-summary-stat-value">{rfidEntrance?.lastScan ?? "—"}</p>
            </Box>
            <Box>
              <p className="rfid-summary-stat-label">Reader Health</p>
              <p className="rfid-summary-stat-value" style={{ color: "#166534" }}>
                {rfidEntrance?.readerHealth ?? "—"}
              </p>
            </Box>
          </Box>
          <Button fullWidth variant="contained" className="btn-solid">
            Open RFID Entrance Monitoring
          </Button>
        </Card>

        <Card variant="outlined" className="panel-card">
          <p className="panel-title" style={{ marginBottom: 2 }}>Today's Summary</p>
          <p className="panel-subtitle" style={{ marginBottom: 16 }}>Overall terminal operations</p>
          <Box className="today-summary-grid">
            <Card className="today-summary-tile completed">
              <CheckCircleOutlinedIcon sx={{ color: "#166534" }} />
              <p className="today-summary-value">{todaysSummary?.completedDeliveries ?? "—"}</p>
              <p className="today-summary-label">Completed Deliveries</p>
            </Card>
            <Card className="today-summary-tile farmers">
              <GroupsOutlinedIcon sx={{ color: "#1d4ed8" }} />
              <p className="today-summary-value">{todaysSummary?.totalFarmers ?? "—"}</p>
              <p className="today-summary-label">Total Farmers</p>
            </Card>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}