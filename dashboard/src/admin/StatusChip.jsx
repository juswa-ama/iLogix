import { Chip } from "@mui/material";
import "./StatusChip.css";

export default function StatusChip({ label }) {
  return <Chip label={label} size="small" className={`status-chip ${label.toLowerCase()}`} />;
}