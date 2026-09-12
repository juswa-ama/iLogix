import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import {
  Avatar,
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment, MenuItem,
  Pagination,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import "./DriverManagement.css";
import RegisterDriverDialog from "./RegisterDriverDialog";
import StatusChip from "./StatusChip";
import "./styles/shared.css";
import TopBar from "./TopBar";

const API_BASE = "/api";

const SAMPLE_DRIVERS = [
  {
    id: "DRV-1001",
    name: "Pedro Santos",
    plate: "CAV 8821",
    contact: "0917 123 4567",
    rfid: "Verified",
    status: "Active",
    color: "#14532d",
    initials: "PS",
  },
  {
    id: "DRV-1002",
    name: "Maria Santos",
    plate: "NVA 4821",
    contact: "0918 234 5678",
    rfid: "Verified",
    status: "Active",
    color: "#2563eb",
    initials: "MS",
  },
  {
    id: "DRV-1003",
    name: "Joel Ramirez",
    plate: "KDA 7710",
    contact: "0919 345 6789",
    rfid: "Verified",
    status: "Active",
    color: "#0f766e",
    initials: "JR",
  },
  {
    id: "DRV-1004",
    name: "Lina Cruz",
    plate: "BMB 1934",
    contact: "0920 456 7890",
    rfid: "Pending",
    status: "Active",
    color: "#b45309",
    initials: "LC",
  },
  {
    id: "DRV-1005",
    name: "Pedro Garcia",
    plate: "KAS 9082",
    contact: "0921 567 8901",
    rfid: "Pending",
    status: "Inactive",
    color: "#7c3aed",
    initials: "PG",
  },
  {
    id: "DRV-1006",
    name: "Ana Villanueva",
    plate: "BMB 6645",
    contact: "0922 678 9012",
    rfid: "Verified",
    status: "Active",
    color: "#be123c",
    initials: "AV",
  },
];

export default function DriverManagement() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [registerOpen, setRegisterOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadDrivers() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/drivers`);
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const json = await res.json();
        if (!cancelled) setDrivers(Array.isArray(json) ? json : json.drivers || []);
      } catch (err) {
        if (!cancelled) {
          setError("Unable to load drivers. Showing sample data until the server responds.");
          setDrivers(SAMPLE_DRIVERS);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadDrivers();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    return drivers.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(search.toLowerCase()) || d.plate.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All Status" || d.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [drivers, search, statusFilter]);

  function handleSaveDriver(form) {
    const initials = `${form.firstName?.[0] ?? ""}${form.lastName?.[0] ?? ""}`.toUpperCase() || "NA";
    const newDriver = {
      id: form.driverId,
      name: [form.firstName, form.middleName, form.lastName].filter(Boolean).join(" "),
      plate: form.plateNumber,
      contact: form.contactNumber,
      rfid: form.rfidTag ? "Verified" : "Pending",
      status: "Active",
      color: "#14532d",
      initials,
    };
    setDrivers((prev) => [newDriver, ...prev]);
    // TODO: also POST `form` to `${API_BASE}/drivers` to persist this driver server-side
  }

  return (
    <Box>
      <TopBar title="Driver Management" subtitle="Manage all registered drivers" />

      {error && <p className="empty-state-text" style={{ color: "#b45309" }}>{error}</p>}

      <Card variant="outlined" className="panel-card">
        <Box className="panel-header">
          <Box>
            <p className="panel-title" style={{ fontSize: "1rem" }}>Drivers</p>
            <p className="panel-subtitle">View, register and manage all drivers.</p>
          </Box>
          <Box className="panel-header-actions">
            <Button variant="outlined" startIcon={<FileDownloadOutlinedIcon fontSize="small" />} className="btn-outline">
              Export
            </Button>
            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon fontSize="small" />}
              className="btn-solid"
              onClick={() => setRegisterOpen(true)}
            >
              Register Driver
            </Button>
          </Box>
        </Box>

        <Box className="filter-row">
          <TextField
            size="small"
            fullWidth
            placeholder="Search Driver..."
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
          <TextField select size="small" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 140 }}>
            {["All Status", "Active", "Inactive"].map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {loading && <p className="empty-state-text">Loading drivers…</p>}

        {!loading && filtered.length === 0 && (
          <p className="empty-state-text">
            {drivers.length === 0 ? "No drivers registered yet." : "No drivers match your search."}
          </p>
        )}

        {!loading && filtered.length > 0 && (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {["Driver", "Plate No.", "Contact", "RFID", "Status", "Actions"].map((h) => (
                    <TableCell key={h} className="data-table-head-cell">
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="driver-cell">
                      <Box className="driver-cell-inner">
                        <Avatar sx={{ bgcolor: d.color, width: 32, height: 32, fontSize: "0.75rem" }}>{d.initials}</Avatar>
                        <Box>
                          <p className="driver-name">{d.name}</p>
                          <p className="driver-id">{d.id}</p>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell className="data-table-cell strong">{d.plate}</TableCell>
                    <TableCell className="data-table-cell">{d.contact}</TableCell>
                    <TableCell className="data-table-cell">
                      <StatusChip label={d.rfid} />
                    </TableCell>
                    <TableCell className="data-table-cell">{d.status}</TableCell>
                    <TableCell className="data-table-cell">
                      <Box className="action-icon-group">
                        <IconButton size="small" className="action-icon-btn edit">
                          <EditOutlinedIcon sx={{ fontSize: "1rem" }} />
                        </IconButton>
                        <IconButton size="small" className="action-icon-btn suspend">
                          <BlockOutlinedIcon sx={{ fontSize: "1rem" }} />
                        </IconButton>
                        <IconButton size="small" className="action-icon-btn delete">
                          <DeleteOutlineOutlinedIcon sx={{ fontSize: "1rem" }} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {!loading && drivers.length > 0 && (
          <Box className="table-footer-row">
            <p className="table-footer-note">Showing 1-{filtered.length} of {drivers.length} drivers</p>
            <Pagination count={Math.max(1, Math.ceil(drivers.length / 10))} size="small" shape="rounded" />
          </Box>
        )}
      </Card>

      <RegisterDriverDialog
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSave={handleSaveDriver}
      />
    </Box>
  );
}