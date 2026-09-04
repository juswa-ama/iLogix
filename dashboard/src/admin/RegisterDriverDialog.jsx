import { useState } from "react";
import { Dialog, Box, TextField, MenuItem, Button, IconButton } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import NfcOutlinedIcon from "@mui/icons-material/NfcOutlined";
import "./styles/shared.css";
import "./RegisterDriverDialog.css";

const VEHICLE_TYPES = ["6-Wheeler Truck", "10-Wheeler Truck", "Multicab", "Motorcycle", "Van"];
const GENDERS = ["Male", "Female", "Prefer not to say"];

const STEPS = [
  { key: "personal", label: "Personal Info", sub: "Driver details" },
  { key: "rfid", label: "RFID Tag", sub: "Assign credentials" },
];

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  middleName: "",
  gender: "Male",
  plateNumber: "",
  contactNumber: "",
  vehicleType: "6-Wheeler Truck",
  username: "",
  address: "",
  driverId: "",
  rfidTag: "",
  commodityOrigin: "",
};

export default function RegisterDriverDialog({ open, onClose, onSave }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY_FORM);
  const [scanning, setScanning] = useState(false);

  function handleChange(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleClose() {
    setStep(0);
    setForm(EMPTY_FORM);
    onClose?.();
  }

  function handleNext() {
    // Auto-generate a Driver ID once personal info is complete, if not already set
    setForm((f) => ({
      ...f,
      driverId: f.driverId || `DRV-${Math.floor(1000 + Math.random() * 9000)}`,
    }));
    setStep(1);
  }

  function handleBack() {
    setStep(0);
  }

  function handleScanRfid() {
    setScanning(true);
    // TODO: replace with real RFID reader integration
    setTimeout(() => {
      setForm((f) => ({
        ...f,
        rfidTag: f.rfidTag || `RFID-${Math.floor(100000 + Math.random() * 899999)}`,
      }));
      setScanning(false);
    }, 1200);
  }

  function handleSave() {
    onSave?.(form);
    handleClose();
  }

  const fullName = [form.firstName, form.lastName].filter(Boolean).join(" ") || "—";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { className: "register-driver-paper" } }}
    >
      <Box className="rd-header">
        <Box>
          <p className="rd-title">Register New Driver</p>
          <p className="rd-subtitle">Create a new driver account and link vehicle, cargo &amp; RFID credentials</p>
        </Box>
        <IconButton size="small" onClick={handleClose} className="rd-close-btn">
          <CloseOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box className="rd-steps">
        {STEPS.map((s, i) => (
          <Box key={s.key} className={`rd-step ${i === step ? "active" : ""}`}>
            <Box className={`rd-step-num ${i === step ? "active" : ""}`}>{i + 1}</Box>
            <Box>
              <p className="rd-step-label">{s.label}</p>
              <p className="rd-step-sub">{s.sub}</p>
            </Box>
          </Box>
        ))}
      </Box>

      <Box className="rd-body">
        {step === 0 && (
          <>
            <p className="rd-section-title">Personal Information</p>
            <Box className="rd-grid">
            <Field label="First Name *" placeholder="Juan" value={form.firstName} onChange={handleChange("firstName")} />
            <Field label="Last Name *" placeholder="Dela Cruz" value={form.lastName} onChange={handleChange("lastName")} />
            <Field label="Middle Name" placeholder="Optional" value={form.middleName} onChange={handleChange("middleName")} />
            <Field label="Gender" select options={GENDERS} value={form.gender} onChange={handleChange("gender")} />
            <Field label="Plate Number *" placeholder="ABC 1234" value={form.plateNumber} onChange={handleChange("plateNumber")} />
            <Field label="Contact Number *" placeholder="09XXXXXXXXX" value={form.contactNumber} onChange={handleChange("contactNumber")} />
            <Field label="Vehicle Type *" select options={VEHICLE_TYPES} value={form.vehicleType} onChange={handleChange("vehicleType")} />
            <Field label="Username *" placeholder="juan.delacruz" value={form.username} onChange={handleChange("username")} />
            <Field
                label="Complete Address"
                placeholder="Enter complete address..."
                value={form.address}
                onChange={handleChange("address")}
                fullWidth
                multiline
                rows={3}
            />
            </Box>

            <Box className="rd-footer">
              <Button variant="outlined" className="btn-outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="contained" className="btn-solid" onClick={handleNext}>
                Next →
              </Button>
            </Box>
          </>
        )}

        {step === 1 && (
          <>
            <p className="rd-section-title">RFID Registration</p>
            <Box className="rd-rfid-grid">
              <Box className="rd-rfid-fields">
                <Field label="Driver ID" value={form.driverId} onChange={handleChange("driverId")} />
                <Field label="RFID Tag Number" placeholder="Tap or scan a card" value={form.rfidTag} onChange={handleChange("rfidTag")} />
              </Box>

              <Box className="rd-scan-box">
                <NfcOutlinedIcon className="rd-scan-icon" />
                <p className="rd-scan-title">{scanning ? "Scanning…" : "Tap RFID Card"}</p>
                <p className="rd-scan-sub">Place card against the terminal scanner</p>
                <Button
                  variant="contained"
                  className="btn-solid-sm rd-scan-btn"
                  onClick={handleScanRfid}
                  disabled={scanning}
                >
                  {scanning ? "Scanning…" : "Scan RFID Card"}
                </Button>
              </Box>
            </Box>

            <Box className="rd-summary">
              <p className="rd-summary-label">Registration Summary</p>
              <Box className="rd-summary-grid">
                <SummaryItem label="Driver" value={fullName} />
                <SummaryItem label="Driver ID" value={form.driverId || "—"} />
                <SummaryItem label="Plate Number" value={form.plateNumber || "—"} />
                <SummaryItem label="Commodity Origin" value={form.commodityOrigin || "Bambang, Nueva Vizcaya"} />
              </Box>
            </Box>

            <Box className="rd-footer rd-footer-split">
              <Button variant="outlined" className="btn-outline" onClick={handleBack}>
                ← Back
              </Button>
              <Box className="rd-footer-right">
                <Button variant="outlined" className="btn-outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="contained" className="btn-solid" onClick={handleSave} disabled={!form.rfidTag}>
                  Save Driver
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Dialog>
  );
}

function Field({ label, fullWidth, select, options, ...rest }) {
  return (
    <Box className={`rd-field ${fullWidth ? "full" : ""}`}>
      <label className="rd-field-label">{label}</label>
      {select ? (
        <TextField select size="small" fullWidth {...rest}>
          {options.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </TextField>
      ) : (
        <TextField size="small" fullWidth {...rest} />
      )}
    </Box>
  );
}

function SummaryItem({ label, value }) {
  return (
    <Box className="rd-summary-item">
      <p className="rd-summary-item-label">{label}</p>
      <p className="rd-summary-item-value">{value}</p>
    </Box>
  );
}