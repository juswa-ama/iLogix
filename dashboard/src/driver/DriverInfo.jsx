import "./DriverInfo.css";

export default function DriverInfo({ driver, onBack, onContinue }) {
  return (
    <div className="driver-info">
      <div className="driver-info-header">
        <button onClick={onBack} className="driver-back-button">←</button>
        <span>STEP 1 OF 4</span>
        <strong>25%</strong>
      </div>

      <div className="driver-info-progress">
        <i />
      </div>

      <div className="driver-info-title">
        <h1>Driver info</h1>
        <p>Enter truck & driver details</p>
      </div>

      <div className="driver-info-fields">
        <div className="driver-info-field">
          <label>Driver name <b>*</b></label>
          <div>{driver.name}</div>
        </div>

        <div className="driver-info-field">
          <label>Mobile number <b>*</b></label>
          <div>{driver.phone}</div>
        </div>

        <div className="driver-info-field">
          <label>Vehicle type <b>*</b></label>
          <div>
            {driver.vehicle}
            <span>⌄</span>
          </div>
        </div>

        <div className="driver-info-field">
          <label>Plate number <b>*</b></label>
          <div>{driver.plate}</div>
        </div>
      </div>

      <button className="driver-info-continue" onClick={onContinue}>
        Continue
        <span>→</span>
      </button>
    </div>
  );
}