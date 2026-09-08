import "./VehicleVerified.css";

export default function VehicleVerified({ vehicle, onAccept, onDeny }) {
  if (!vehicle) return null;

  return (
    <div className="verified-screen">
      <span className="verified-badge">✓ RFID Verified — Registered Vehicle</span>

      <div className="verified-driver-row">
        <span className="verified-avatar">{vehicle.initials}</span>
        <div>
          <p className="verified-driver-name">{vehicle.name}</p>
          <p className="verified-driver-meta">
            {vehicle.driverId} · {vehicle.role} · License {vehicle.license}
          </p>
        </div>
      </div>

      <div className="verified-detail-grid">
        <div className="verified-detail-box">
          <p className="verified-detail-label">Plate Number</p>
          <p className="verified-detail-value">{vehicle.plate}</p>
        </div>
        <div className="verified-detail-box">
          <p className="verified-detail-label">Vehicle Type</p>
          <p className="verified-detail-value">{vehicle.vehicleType}</p>
        </div>
        <div className="verified-detail-box">
          <p className="verified-detail-label">RFID Tag</p>
          <p className="verified-detail-value" style={{ color: "#166534" }}>
            {vehicle.rfidTag}
          </p>
        </div>
      </div>

      <div className="verified-cargo-box">
        <div className="verified-cargo-header">
          <p className="verified-cargo-label">Declared Cargo (from pre-registration)</p>
          <p className="verified-cargo-origin">
            Origin
            <span>{vehicle.origin}</span>
          </p>
        </div>
        <p className="verified-cargo-summary">
          {vehicle.totalWeight} — {vehicle.farmers} Farmers · {vehicle.cargoLabel}
        </p>
        {vehicle.produceLines.map((line, i) => (
          <p className="verified-cargo-line" key={i}>
            · {line.name} ({line.weight})
          </p>
        ))}
      </div>

      <div className="verified-actions">
        <button className="verified-btn accept" onClick={onAccept}>
          Accept
        </button>
        <button className="verified-btn deny" onClick={onDeny}>
          Deny
        </button>
      </div>
    </div>
  );
}