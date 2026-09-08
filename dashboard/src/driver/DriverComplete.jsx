import "./DriverComplete.css";

export default function DriverComplete({ driver, onDone }) {
  const firstName = driver.name.split(" ")[0];

  return (
    <div className="driver-complete">
      <div className="driver-complete-content">
        <div className="driver-success-icon">✓</div>
        <small>REGISTRATION COMPLETE</small>
        <h1>You're all set, {firstName}</h1>
        <p>Your delivery details have been recorded successfully.</p>

        <div className="driver-next-card">
          <strong>ⓘ &nbsp; What's next?</strong>
          <span>
            You may now proceed to the checkpoint for automatic RFID clearance. Please ensure that your vehicle is
            ready for inspection and that you have all necessary documents on hand.
          </span>
        </div>

        <div className="driver-registration-number">
          <small>REGISTRATION STATUS</small>
          <strong>READY FOR CHECKPOINT</strong>
        </div>

        <button className="driver-complete-button" onClick={onDone}>
          Done
        </button>
      </div>
    </div>
  );
}