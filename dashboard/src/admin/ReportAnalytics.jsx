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
import TopBar from "./TopBar";
import StatCard from "./StatCard";
import StatusChip from "./StatusChip";
import "./styles/shared.css";
import "./ReportAnalytics.css";

const RANK_COLORS = { 1: "#14532d", 2: "#166534", 3: "#b45309" };

// TODO: point this at your real API base URL (e.g. via an env var)
const API_BASE = "/api";

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

  useEffect(() => {
    let cancelled = false;
    async function loadReport() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/reports`);
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const json = await res.json();
        if (!cancelled) setData({ ...EMPTY_REPORT, ...json });
      } catch (err) {
        if (!cancelled) {
          setError("Unable to load report data. Showing no data until the server responds.");
          setData(EMPTY_REPORT);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadReport();
    return () => {
      cancelled = true;
    };
  }, []);

  const { stats, commodityOrigins, topGoods, inflowLogs } = data;

  return (
    <Box>
      <TopBar title="Reports & Analytics" subtitle="Real-time inflow tracking, commodity weight breakdowns, and origin analysis" />

      {error && <p className="empty-state-text" style={{ color: "#b45309" }}>{error}</p>}
      {loading && <p className="empty-state-text">Loading report data…</p>}

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