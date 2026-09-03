import { Card, Typography } from "@mui/material";
import "./StatCard.css";

export default function StatCard({ label, value, delta, deltaColor = "#166534" }) {
  return (
    <Card variant="outlined" className="stat-card">
      <p className="stat-card-label">{label}</p>
      <p className="stat-card-value">{value}</p>
      {delta && (
        <p className="stat-card-delta" style={{ color: deltaColor }}>
          {delta}
        </p>
      )}
    </Card>
  );
}