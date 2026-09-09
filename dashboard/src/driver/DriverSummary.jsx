import "./DriverSummary.css";

export default function DriverSummary({ driver, commodities, farmerCount, onBack, onFinish }) {
  const totalWeight = commodities.reduce(
    (sum, commodity) => sum + (Number.parseInt(commodity.weight, 10) || 0),
    0
  );

  return (
    <div className="driver-screen-page">
      <div className="driver-step-header">
        <button onClick={onBack} aria-label="Go back">←</button>
        <span>Step 2 of 3</span>
        <strong>66%</strong>
      </div>

      <div className="driver-step-progress">
        <i style={{ width: "66%" }} />
      </div>

      <div className="driver-step-title">
        <h1>Review summary <span className="driver-tl">(Detalye)</span></h1>
        <p>Please check your details <span className="driver-tl">(Pakisuri ang mga detalye)</span></p>
      </div>

      <div className="driver-summary-card">
        <small>
          Vehicle & driver <span className="driver-tl">(Sasakyan at drayber)</span>
        </small>
        <div>
          <span>Driver</span>
          <strong>{driver.name}</strong>
        </div>
        <div>
          <span>Mobile</span>
          <strong>{driver.phone}</strong>
        </div>
        <div>
          <span>Vehicle</span>
          <strong>{driver.vehicle}</strong>
        </div>
        <div>
          <span>Plate</span>
          <strong>{driver.plate}</strong>
        </div>
        <div>
          <span>
            Origin <span className="driver-tl">(Pinagmulan)</span>
          </span>
          <strong>{driver.origin}</strong>
        </div>
      </div>

      <div className="driver-summary-card">
        <small>
          Commodities <span className="driver-tl">(Mga produkto)</span>
        </small>
        {commodities.map((commodity, index) => (
          <div className="driver-summary-commodity" key={`${commodity.name}-${index}`}>
            <div className="driver-summary-commodity-info">
              <span className="driver-summary-commodity-name">{commodity.name}</span>
              <span className="driver-summary-commodity-meta">
                {farmerCount} farmer{farmerCount === 1 ? "" : "s"}
              </span>
            </div>
            <strong>{commodity.weight}</strong>
          </div>
        ))}
      </div>

      <div className="driver-summary-totals">
        <div className="driver-summary-total">
          <span>
            Total farmers <span className="driver-tl">(Kabuuang magsasaka)</span>
          </span>
          <strong>{farmerCount}</strong>
        </div>
        <div className="driver-summary-total">
          <span>
            Total cargo weight <span className="driver-tl">(Kabuuang timbang)</span>
          </span>
          <strong>{totalWeight} kg</strong>
        </div>
      </div>

      <div className="driver-actions">
        <button type="button" className="driver-button secondary" onClick={onBack}>
          Back
        </button>
        <button className="driver-button primary" onClick={onFinish}>
          Finish registration
          <span aria-hidden="true">✓</span>
        </button>
      </div>
    </div>
  );
}