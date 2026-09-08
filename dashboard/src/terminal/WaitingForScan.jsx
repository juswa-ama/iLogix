import "./WaitingForScan.css";

export default function WaitingForScan({ onSimulateScan }) {
  return (
    <div className="waiting-screen" onClick={onSimulateScan} role="button" tabIndex={0}>
      <div className="waiting-icon-ring">
        {/* Antenna/reader icon */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4l7 7" />
          <path d="M8 3a10 10 0 0 1 13 13" />
          <path d="M5 6a7 7 0 0 1 9 9" />
          <circle cx="5" cy="19" r="2" />
          <path d="M12 15l-6 6" />
        </svg>
      </div>
      <p className="waiting-text">Waiting for RFID Scan</p>
      <p className="waiting-hint">(click to simulate a scan for this demo)</p>
    </div>
  );
}