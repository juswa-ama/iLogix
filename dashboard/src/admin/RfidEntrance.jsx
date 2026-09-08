import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
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
import "./RfidEntrance.css";
import StatusChip from "./StatusChip";
import "./styles/shared.css";
import TopBar from "./TopBar";

// TODO: point this at your real API base URL (e.g. via an env var)
const API_BASE = "/api";

export default function RfidEntrance() {
  const [search, setSearch] = useState("");
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadScans() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/rfid-scans`);
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const json = await res.json();
        if (!cancelled) setScans(Array.isArray(json) ? json : json.scans || []);
      } catch (err) {
        if (!cancelled) {
          setError("Unable to load RFID scans. Showing no data until the server responds.");
          setScans([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadScans();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredScans = scans.filter(
    (row) =>
      row.driver?.toLowerCase().includes(search.toLowerCase()) ||
      row.plate?.toLowerCase().includes(search.toLowerCase()) ||
      row.rfid?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <TopBar title="RFID Entrance Monitoring" subtitle="Real-time gate scan events, RFID card validations, and barrier status" />

      {error && <p className="empty-state-text" style={{ color: "#b45309" }}>{error}</p>}

      <Card variant="outlined" className="panel-card">
        <Box className="panel-header">
          <Box>
            <p className="panel-title">Live Gate Scans</p>
            <p className="panel-subtitle">Automatic detection at Main Terminal Gate 1 & Gate 2</p>
          </Box>
          <Button size="small" variant="outlined" startIcon={<FileDownloadOutlinedIcon fontSize="small" />} className="btn-outline">
            Export Scans
          </Button>
        </Box>

        <Box className="filter-row">
          <TextField
            size="small"
            fullWidth
            placeholder="Search RFID Tag, Driver Name, or Plate Number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
            input: {
                startAdornment: (
                <InputAdornment position="start">
                    <span aria-hidden="true" style={{ color: "#9ca3af", fontSize: 16 }}>⌕</span>
                </InputAdornment>
                ),
            },
            }}
          />
          <TextField select size="small" defaultValue="All Gates" sx={{ minWidth: 120 }}>
            {["All Gates", "Gate 1", "Gate 2"].map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
          <TextField select size="small" defaultValue="All Verification" sx={{ minWidth: 150 }}>
            {["All Verification", "Verified", "Unregistered"].map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {loading && <p className="empty-state-text">Loading scans…</p>}

        {!loading && filteredScans.length === 0 && (
          <p className="empty-state-text">
            {scans.length === 0 ? "No entrance scans recorded yet." : "No scans match your search."}
          </p>
        )}

        {!loading && filteredScans.length > 0 && (
          <>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {["Driver Details", "Plate No.", "RFID Tag UID", "Scan Time", "Verification", "Action"].map((h) => (
                      <TableCell key={h} className="data-table-head-cell">
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredScans.map((row, i) => (
                    <TableRow key={row.id || i}>
                      <TableCell className="driver-cell">
                        <Box className="driver-cell-inner">
                          <Avatar sx={{ bgcolor: row.color || "#14532d", width: 32, height: 32, fontSize: "0.75rem" }}>
                            {row.initials || "-"}
                          </Avatar>
                          <Box>
                            <p className="driver-name">{row.driver}</p>
                            <p className="driver-id">{row.sub || row.id}</p>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell className="data-table-cell strong">{row.plate}</TableCell>
                      <TableCell className={`rfid-tag-cell ${row.verification === "Unregistered" ? "flagged" : "normal"}`}>
                        {row.rfid}
                      </TableCell>
                      <TableCell className="data-table-cell">{row.time}</TableCell>
                      <TableCell className="data-table-cell">
                        <StatusChip label={row.verification} />
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

            <Box className="table-footer-row">
              <p className="table-footer-note">Showing 1-{filteredScans.length} of {scans.length} entrance scans today</p>
              <Pagination count={Math.max(1, Math.ceil(scans.length / 10))} size="small" shape="rounded" />
            </Box>
          </>
        )}
      </Card>
    </Box>
  );
}