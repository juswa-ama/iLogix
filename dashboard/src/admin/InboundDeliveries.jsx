import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import {
    Avatar,
    Box,
    Button,
    Card,
    InputAdornment,
    MenuItem,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import "./InboundDeliveries.css";
import StatusChip from "./StatusChip";
import "./styles/shared.css";
import TopBar from "./TopBar";

// TODO: point this at your real API base URL (e.g. via an env var)
const API_BASE = "/api";

const SAMPLE_LIVE_DELIVERIES = [
  {
    id: "DLV-1042",
    driver: "Maria Santos",
    plate: "NVA 4821",
    farmers: 3,
    weight: "1,240 kg",
    time: "09:12 AM",
    status: "Verified",
    color: "#2563eb",
    initials: "MS",
  },
  {
    id: "DLV-1043",
    driver: "Joel Ramirez",
    plate: "KDA 7710",
    farmers: 2,
    weight: "860 kg",
    time: "09:28 AM",
    status: "Verified",
    color: "#0f766e",
    initials: "JR",
  },
  {
    id: "DLV-1044",
    driver: "Lina Cruz",
    plate: "BMB 1934",
    farmers: 4,
    weight: "1,680 kg",
    time: "09:41 AM",
    status: "Waiting",
    color: "#b45309",
    initials: "LC",
  },
];

const SAMPLE_WALK_INS = [
  {
    id: "WALK-201",
    driver: "Pedro Garcia",
    plate: "KAS 9082",
    farmers: 1,
    weight: "420 kg",
    status: "Waiting",
    color: "#7c3aed",
    initials: "PG",
  },
  {
    id: "WALK-202",
    driver: "Ana Villanueva",
    plate: "BMB 6645",
    farmers: 2,
    weight: "730 kg",
    status: "Verified",
    color: "#be123c",
    initials: "AV",
  },
];

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
  const [liveDeliveries, setLiveDeliveries] = useState(SAMPLE_LIVE_DELIVERIES);
  const [walkIns, setWalkIns] = useState(SAMPLE_WALK_INS);
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
      } catch {
        if (!cancelled) {
          setError("Unable to load deliveries. Showing sample inbound data.");
          setLiveDeliveries(SAMPLE_LIVE_DELIVERIES);
          setWalkIns(SAMPLE_WALK_INS);
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
              {["All Status", "Waiting", "Verified"].map((opt) => (
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
                      {["Driver", "Plate No.", "Farmer Count", "Total Weight", "Arrival Time", "Status", "Action"].map((h) => (
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
                    {["Driver", "Plate No.", "Farmer Count", "Total Weight", "Status", "Action"].map((h) => (
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