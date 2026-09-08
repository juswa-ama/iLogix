import { useState } from "react";
import { TextField, MenuItem } from "@mui/material";
import "./WalkInEntry.css";

const VEHICLE_TYPES = ["6-Wheeler Truck", "10-Wheeler Truck", "Van", "Motorcycle", "Multicab"];

let lineIdCounter = 1;
function newLine() {
  return { id: lineIdCounter++, produce: "", farmer: "", weight: "" };
}

export default function WalkInEntry({ onSave, onCancel }) {
  const [fullName, setFullName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("6-Wheeler Truck");
  const [lines, setLines] = useState([newLine(), newLine()]);

  const totalWeight = lines.reduce((sum, l) => sum + (parseFloat(l.weight) || 0), 0);

  function updateLine(id, field, value) {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  }

  function addLine() {
    setLines((prev) => [...prev, newLine()]);
  }

  function removeLine(id) {
    setLines((prev) => (prev.length > 1 ? prev.filter((l) => l.id !== id) : prev));
  }

  function handleSave() {
    onSave?.({
      fullName,
      licenseNumber,
      contactNumber,
      plateNumber,
      vehicleType,
      lines,
      totalWeight,
    });
  }

  return (
    <div className="walkin-screen">
      <div className="walkin-header-row">
        <div>
          <p className="walkin-title">Walk-in Driver Entry</p>
          <p className="walkin-subtitle">No RFID on file — log this delivery manually</p>
        </div>
        <span className="walkin-unregistered-chip">⚠ Unregistered Vehicle</span>
      </div>

      <p className="walkin-section-label">Driver Details</p>
      <div className="walkin-grid-3">
        <div>
          <label className="walkin-field-label">Full Name</label>
          <TextField
            fullWidth
            size="small"
            placeholder="e.g. Ramon Villanueva"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div>
          <label className="walkin-field-label">License Number</label>
          <TextField
            fullWidth
            size="small"
            placeholder="N01-12-XXXXXX"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
          />
        </div>
        <div>
          <label className="walkin-field-label">Contact Number</label>
          <TextField
            fullWidth
            size="small"
            placeholder="09XX XXX XXXX"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
          />
        </div>
      </div>

      <p className="walkin-section-label">Vehicle Details</p>
      <div className="walkin-grid-2">
        <div>
          <label className="walkin-field-label">Plate Number</label>
          <TextField
            fullWidth
            size="small"
            placeholder="e.g. UNK-9941"
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value)}
          />
        </div>
        <div>
          <label className="walkin-field-label">Vehicle Type</label>
          <TextField fullWidth select size="small" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
            {VEHICLE_TYPES.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>
        </div>
      </div>

      <div className="walkin-cargo-box">
        <p className="walkin-section-label" style={{ marginBottom: 12 }}>
          Declared Cargo
        </p>

        {lines.map((line) => (
          <div className="walkin-produce-line" key={line.id}>
            <TextField
              size="small"
              placeholder="Produce type"
              value={line.produce}
              onChange={(e) => updateLine(line.id, "produce", e.target.value)}
            />
            <TextField
              size="small"
              placeholder="Farmer / source"
              value={line.farmer}
              onChange={(e) => updateLine(line.id, "farmer", e.target.value)}
            />
            <TextField
              size="small"
              placeholder="Weight (kg)"
              type="number"
              value={line.weight}
              onChange={(e) => updateLine(line.id, "weight", e.target.value)}
            />
            <button className="walkin-remove-line-btn" onClick={() => removeLine(line.id)} aria-label="Remove line">
              ✕
            </button>
          </div>
        ))}

        <button className="walkin-add-line-btn" onClick={addLine}>
          + Add produce line
        </button>

        <div className="walkin-total-row">
          <span className="walkin-total-label">Total declared weight</span>
          <span className="walkin-total-value">{totalWeight} kg</span>
        </div>
      </div>

      <div className="walkin-id-capture">
        <div className="walkin-id-capture-left">
          <span className="walkin-id-icon">🪪</span>
          <div>
            <p className="walkin-id-title">Capture valid ID</p>
            <p className="walkin-id-subtitle">Take a photo of the driver's license</p>
          </div>
        </div>
        <button className="walkin-capture-btn">Capture Photo</button>
      </div>

      <div className="walkin-actions">
        <button className="walkin-btn save" onClick={handleSave}>
          Save
        </button>
        <button className="walkin-btn cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}