import "./DriverComplete.css";

export default function DriverComplete({ driver, onDone }) {
  const firstName = driver.name.split(" ")[0];

  return (
    <div className="driver-screen-page">
      <div className="driver-complete-content">
        <div className="driver-success-icon">✓</div>
        <p className="driver-complete-eyebrow">Registration complete</p>
        <h1>You're all set, {firstName}</h1>
        <p className="driver-complete-lead">Your delivery details have been recorded successfully.</p>

        <div className="driver-next-card">
          <strong>What's next?</strong>
          <span>
            You may now proceed to the checkpoint for automatic RFID clearance. Please ensure that your vehicle is
            ready for inspection and that you have all necessary documents on hand.
          </span>
        </div>

        <div className="driver-registration-status">
          <span>Registration status</span>
          <strong>Ready for checkpoint</strong>
        </div>
      </div>

      <div className="driver-actions">
        <button className="driver-button primary" style={{ width: "100%" }} onClick={onDone}>
          Done
        </button>
      </div>
    </div>
  );
}