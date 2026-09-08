import { useEffect, useState } from "react";
import nvatLogo from "../admin/NVATlogo.png";
import WaitingForScan from "./WaitingForScan";
import VehicleVerified from "./VehicleVerified";
import WalkInEntry from "./WalkInEntry";
import "./GateTerminal.css";

const RECENT_SCANS = [
  { initials: "MR", color: "#14532d", name: "Mario Ramos", time: "09:08 AM", plate: "LMN-4488", ok: true },
  { initials: "PS", color: "#166534", name: "Pedro Santos", time: "08:52 AM", plate: "XYZ-5678", ok: true },
  { initials: "CR", color: "#166534", name: "Carlos Reyes", time: "08:15 AM", plate: "JKL-9021", ok: true },
];

// Demo vehicle shown when a scan is simulated. In production this comes from
// the RFID reader event + a lookup against your registered-vehicles API.
const DEMO_VERIFIED_VEHICLE = {
  initials: "JC",
  name: "Juan Dela Cruz",
  driverId: "DRV-1001",
  role: "Cargo Driver",
  license: "N01-12-123456",
  plate: "ABC-1234",
  vehicleType: "6-Wheeler Truck",
  rfidTag: "RFID-000125",
  totalWeight: "1,250 kg",
  farmers: 5,
  cargoLabel: "Upland Vegetables",
  origin: "Bambang, Nueva Vizcaya",
  produceLines: [
    { name: "Cabbage", weight: "400kg" },
    { name: "Carrots", weight: "350kg" },
    { name: "Tomatoes", weight: "500kg" },
  ],
};

export default function GateTerminal({ guard, onLogout }) {
  const [now, setNow] = useState(new Date());
  const [screen, setScreen] = useState("waiting"); // "waiting" | "verified" | "walkin"

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeLabel = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateLabel = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  function handleSimulateScan() {
    // Placeholder for the real RFID reader event handler — wire this up to
    // your hardware/websocket event instead of a click in production.
    setScreen("verified");
  }

  function handleAccept() {
    setScreen("waiting");
  }

  function handleDeny() {
    setScreen("waiting");
  }

  function handleWalkInSave() {
    setScreen("waiting");
  }

  function handleWalkInCancel() {
    setScreen("waiting");
  }

  return (
    <div className="gate-terminal-page">
      <div className="gate-topbar">
        <div className="gate-topbar-brand">
          <img src={nvatLogo} alt="iLogix logo" className="gate-topbar-logo" />
          <div>
            <p className="gate-topbar-brand-name">iLogix</p>
            <p className="gate-topbar-brand-sub">Gate Terminal</p>
          </div>
        </div>

        <div className="gate-topbar-station">
          <p className="gate-topbar-station-label">Station</p>
          <p className="gate-topbar-station-name">Gate 1 — Main Entrance</p>
          <span className="gate-topbar-guard">
            <span className="gate-guard-dot" />
            Guard: {guard?.username === "security" ? "R. Domingo" : guard?.username} (on duty)
          </span>
        </div>

        <div className="gate-topbar-clock">
          <p className="gate-topbar-time">{timeLabel}</p>
          <p className="gate-topbar-date">{dateLabel}</p>
        </div>
      </div>

      <div className="gate-body">
        <div className="gate-main-panel">
          {screen === "waiting" && <WaitingForScan onSimulateScan={handleSimulateScan} />}
          {screen === "verified" && (
            <VehicleVerified vehicle={DEMO_VERIFIED_VEHICLE} onAccept={handleAccept} onDeny={handleDeny} />
          )}
          {screen === "walkin" && <WalkInEntry onSave={handleWalkInSave} onCancel={handleWalkInCancel} />}
        </div>

        <div className="gate-side-panel">
          <div className="gate-side-card">
            <p className="gate-side-card-title">Reader Status</p>
            <div className="gate-reader-status-pill">
              <span className="gate-reader-dot" />
              <p className="gate-reader-status-text">Reader — Online &amp; Ready</p>
            </div>
          </div>

          <div className="gate-side-card">
            <p className="gate-side-card-title">Today at This Gate</p>
            <div className="gate-today-stats">
              <div className="gate-today-stat">
                <p className="gate-today-stat-value">47</p>
                <p className="gate-today-stat-label">Total Scans</p>
              </div>
              <div className="gate-today-stat">
                <p className="gate-today-stat-value">1</p>
                <p className="gate-today-stat-label">Flagged</p>
              </div>
            </div>
          </div>

          <div className="gate-side-card">
            <p className="gate-side-card-title">Recent Scan Log</p>
            {RECENT_SCANS.map((scan, i) => (
              <div className="gate-scan-log-row" key={i}>
                <div className="gate-scan-log-left">
                  <span className="gate-scan-avatar" style={{ backgroundColor: scan.color }}>
                    {scan.initials}
                  </span>
                  <div>
                    <p className="gate-scan-name">{scan.name}</p>
                    <p className="gate-scan-meta">
                      {scan.time} · {scan.plate}
                    </p>
                  </div>
                </div>
                <span className={`gate-scan-status-dot ${scan.ok ? "ok" : "flagged"}`} />
              </div>
            ))}
          </div>

          <div className="gate-side-actions">
            <button className="gate-btn" onClick={() => setScreen("walkin")}>
              Walk-in
            </button>
            <button className="gate-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}