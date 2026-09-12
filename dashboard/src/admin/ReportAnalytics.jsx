import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Avatar,
} from "@mui/material";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import TopBar from "./TopBar";
import StatCard from "./StatCard";
import StatusChip from "./StatusChip";
import "./styles/shared.css";
import "./ReportAnalytics.css";

const RANK_COLORS = { 1: "#14532d", 2: "#166534", 3: "#b45309" };

// TODO: point this at your real API base URL (e.g. via an env var)
const API_BASE = "/api";

const DATE_RANGE_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7d", label: "Last 7 Days" },
  { value: "month", label: "This Month" },
  { value: "custom", label: "Custom Range" },
];

const EMPTY_REPORT = {
  stats: null,
  commodityOrigins: [],
  topGoods: [],
  inflowLogs: [],
};

export default function ReportsAnalytics() {
  const [data, setData] = useState(EMPTY_REPORT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [dateRange, setDateRange] = useState("today");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  async function loadReport() {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ range: dateRange });
      if (dateRange === "custom") {
        if (customFrom) params.set("from", customFrom);
        if (customTo) params.set("to", customTo);
      }

      const res = await fetch(`${API_BASE}/reports?${params.toString()}`);
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const json = await res.json();
      setData({ ...EMPTY_REPORT, ...json });
    } catch (err) {
      setError("Unable to load report data. Showing no data until the server responds.");
      setData(EMPTY_REPORT);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReport();
    // Custom range re-fetches only when "Apply" is clicked (see button below),
    // so it's intentionally excluded from this dependency list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  const { stats, commodityOrigins, topGoods, inflowLogs } = data;
  const activeRangeLabel = DATE_RANGE_OPTIONS.find((opt) => opt.value === dateRange)?.label;

  return (
    <Box>
      <TopBar title="Reports & Analytics" subtitle="Real-time inflow tracking, commodity weight breakdowns, and origin analysis" />

      {error && <p className="empty-state-text" style={{ color: "#b45309" }}>{error}</p>}
      {loading && <p className="empty-state-text">Loading report data…</p>}

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
                onClick={loadReport}
                disabled={loading || !customFrom || !customTo}
              >
                Apply
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Box className="reports-stats-grid">
        <StatCard
          label="Total Daily Deliveries"
          value={stats ? stats.totalDeliveries : "—"}
          delta={stats?.totalDeliveriesDelta || "No data yet"}
        />
        <StatCard
          label="Total Inflow Volume"
          value={stats ? `${stats.totalInflowKg} kg` : "—"}
          delta={stats?.totalInflowDelta || "No data yet"}
        />
        <Card variant="outlined" className="top-origin-card">
          <p className="stat-card-label">Top Commodity Origin</p>
          <Box className="top-origin-value-row">
            <p className="top-origin-value">{stats?.topOrigin ?? "—"}</p>
            {stats?.topOriginSharePct != null && (
              <Chip label={`${stats.topOriginSharePct}% Share`} size="small" className="top-origin-chip" />
            )}
          </Box>
          <p className="panel-subtitle">Nueva Vizcaya main hub</p>
        </Card>
      </Box>

      <Box className="reports-mid-grid">
        <Card variant="outlined" className="panel-card">
          <Box className="panel-header">
            <Box>
              <p className="panel-title">Commodity Volume by Point of Origin</p>
              <p className="panel-subtitle">Top supplying municipalities & regional farm origins</p>
            </Box>
            <Chip label="Origin Tracking" size="small" className="badge-chip tracking" />
          </Box>

          {commodityOrigins.length === 0 ? (
            <p className="empty-state-text">No commodity origin data yet.</p>
          ) : (
            commodityOrigins.map((c) => (
              <Box key={c.place} className="commodity-row">
                <Box className="commodity-row-header">
                  <p className="commodity-place">{c.place}</p>
                  <p className="commodity-weight">
                    {c.weight} <span>({c.pct}%)</span>
                  </p>
                </Box>
                <Box className="commodity-bar-track">
                  <Box className="commodity-bar-fill" style={{ width: `${c.pct}%` }} />
                </Box>
              </Box>
            ))
          )}
        </Card>

        <Card variant="outlined" className="panel-card">
          <Box className="panel-header">
            <Box>
              <p className="panel-title">Top Goods by Volume</p>
              <p className="panel-subtitle">Highest tonnage produce mapped to origin</p>
            </Box>
            <Chip label="Leaderboard" size="small" className="badge-chip leaderboard" />
          </Box>

          {topGoods.length === 0 ? (
            <p className="empty-state-text">No goods volume data yet.</p>
          ) : (
            topGoods.map((g) => (
              <Box key={g.rank} className="goods-row">
                <Box className="goods-row-left">
                  <Avatar className="goods-rank-avatar" sx={{ bgcolor: RANK_COLORS[g.rank] || "#14532d" }}>
                    {g.rank}
                  </Avatar>
                  <Box>
                    <p className="goods-name">{g.name}</p>
                    <p className="goods-origin">{g.origin}</p>
                  </Box>
                </Box>
                <Box>
                  <p className="goods-weight">
                    {g.weight} <span>kg</span>
                  </p>
                  <p className="goods-share">{g.share}</p>
                </Box>
              </Box>
            ))
          )}
        </Card>
      </Box>

      <Card variant="outlined" className="panel-card">
        <Box className="panel-header">
          <Box>
            <p className="panel-title">Recent Terminal Inflow Logs</p>
            <p className="panel-subtitle">Latest RFID entries</p>
          </Box>
          <p className="logs-date-note">
            {new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </Box>

        {inflowLogs.length === 0 ? (
          <p className="empty-state-text">No inflow logs recorded yet.</p>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {["Driver Name", "Plate No.", "Commodity Origin", "Cargo Type", "RFID Tag", "Time In"].map((h) => (
                    <TableCell key={h} className="data-table-head-cell">
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {inflowLogs.map((log, i) => (
                  <TableRow key={i}>
                    <TableCell className="data-table-cell strong">{log.driver}</TableCell>
                    <TableCell className="data-table-cell">{log.plate}</TableCell>
                    <TableCell className="data-table-cell" style={{ color: "#166534", fontWeight: 600 }}>
                      {log.origin}
                    </TableCell>
                    <TableCell className="data-table-cell">{log.cargo}</TableCell>
                    <TableCell className="data-table-cell">{log.rfid}</TableCell>
                    <TableCell className="data-table-cell">{log.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
          <Button variant="outlined" className="btn-outline">
            Export PDF
          </Button>
          <Button variant="contained" className="btn-solid">
            Export CSV
          </Button>
        </Box>
      </Card>
    </Box>
  );
}