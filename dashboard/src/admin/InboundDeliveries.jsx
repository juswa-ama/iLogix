import { useEffect, useState } from "react";
import {
  Box,
  Card,
  TextField,
  InputAdornment,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Pagination,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import TopBar from "./TopBar";
import StatCard from "./StatCard";
import StatusChip from "./StatusChip";
import "./styles/shared.css";
import "./InboundDeliveries.css";

// TODO: point this at your real API base URL (e.g. via an env var)
const API_BASE = "/api";

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

function DeliveryRow({ row, showTime }) {
  return (
    <TableRow>
      <TableCell className="driver-cell">
        <Box className="driver-cell-inner">
          <Avatar sx={{ bgcolor: row.color, width: 32, height: 32, fontSize: "0.75rem" }}>{row.initials}</Avatar>
          <Box>
            <p className="driver-name">{row.driver}</p>
            <p className="driver-id">{row.id}</p>
          </Box>
        </Box>
      </TableCell>
      <TableCell className="data-table-cell strong">{row.plate}</TableCell>
      <TableCell className="data-table-cell">{row.farmers}</TableCell>
      <TableCell className="data-table-cell">{row.weight}</TableCell>
      {showTime && <TableCell className="data-table-cell">{row.time}</TableCell>}
      {row.rfid && (
        <TableCell className="data-table-cell">
          <StatusChip label={row.rfid} />
        </TableCell>
      )}
      <TableCell className="data-table-cell">
        <StatusChip label={row.status} />
      </TableCell>
      <TableCell className="data-table-cell">
        <Button size="small" variant="contained" className="btn-solid-sm">
          View
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function InboundDeliveries() {
  const [search, setSearch] = useState("");
  const [liveDeliveries, setLiveDeliveries] = useState([]);
  const [walkIns, setWalkIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadDeliveries() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/deliveries`);
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const json = await res.json();
        if (!cancelled) {
          setLiveDeliveries(json.liveDeliveries || []);
          setWalkIns(json.walkIns || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Unable to load deliveries. Showing no data until the server responds.");
          setLiveDeliveries([]);
          setWalkIns([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadDeliveries();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredLive = liveDeliveries.filter(
    (d) =>
      d.driver.toLowerCase().includes(search.toLowerCase()) ||
      d.plate.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <TopBar title="Inbound Deliveries" subtitle="Monitor all incoming delivery vehicles" />

      {error && <p className="empty-state-text" style={{ color: "#b45309" }}>{error}</p>}

      <Box className="deliveries-sections">
        <SectionCard
          title="Live Deliveries"
          subtitle="Vehicles currently inside the terminal"
          action={
            <Button size="small" variant="outlined" startIcon={<FileDownloadOutlinedIcon fontSize="small" />} className="btn-outline">
              Export
            </Button>
          }
        >
          <Box className="filter-row">
            <TextField
              size="small"
              fullWidth
              placeholder="Search Driver or Plate Number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
                slotProps={{
                input: {
                    startAdornment: (
                    <InputAdornment position="start">
                        <SearchOutlinedIcon fontSize="small" sx={{ color: "#9ca3af" }} />
                    </InputAdornment>
                    ),
                },
                }}
            />
            <TextField select size="small" defaultValue="All Status" sx={{ minWidth: 130 }}>
              {["All Status", "Waiting", "Completed"].map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
            <TextField select size="small" defaultValue="Today" sx={{ minWidth: 110 }}>
              {["Today", "This Week", "This Month"].map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {loading && <p className="empty-state-text">Loading deliveries…</p>}

          {!loading && filteredLive.length === 0 && (
            <p className="empty-state-text">
              {liveDeliveries.length === 0 ? "No live deliveries right now." : "No deliveries match your search."}
            </p>
          )}

          {!loading && filteredLive.length > 0 && (
            <>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {["Driver", "Plate No.", "Farmers", "Total Weight", "Arrival Time", "RFID", "Status", "Action"].map((h) => (
                        <TableCell key={h} className="data-table-head-cell">
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredLive.map((row) => (
                      <DeliveryRow key={row.id} row={row} showTime />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box className="table-footer-row">
                <p className="table-footer-note">Showing 1-{filteredLive.length} of {liveDeliveries.length} deliveries</p>
                <Pagination count={Math.max(1, Math.ceil(liveDeliveries.length / 10))} size="small" shape="rounded" />
              </Box>
            </>
          )}
        </SectionCard>

        <SectionCard
          title="Walk-in Drivers"
          subtitle="Vehicles that walked in today"
          action={
            <Box className="panel-header-actions">
              <Button size="small" startIcon={<RefreshOutlinedIcon fontSize="small" />} className="btn-ghost-sm">
                Refresh
              </Button>
              <Button size="small" variant="contained" className="btn-solid-sm">
                View All
              </Button>
            </Box>
          }
        >
          {!loading && walkIns.length === 0 && (
            <p className="empty-state-text">No walk-in drivers today.</p>
          )}

          {!loading && walkIns.length > 0 && (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {["Driver", "Plate No.", "Farmers", "Total Weight", "Status", "Action"].map((h) => (
                      <TableCell key={h} className="data-table-head-cell">
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {walkIns.map((row) => (
                    <DeliveryRow key={row.id} row={row} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </SectionCard>
      </Box>
    </Box>
  );
}