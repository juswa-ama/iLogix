import "./DriverSummary.css";

export default function DriverSummary({ driver, farmers, onBack, onFinish }) {
  function getCommodities(farmer) {
    return farmer.commodities || [{ name: farmer.commodity, weight: farmer.weight }];
  }

  const total = farmers.reduce((sum, farmer) => {
    return sum + getCommodities(farmer).reduce(
      (farmerTotal, commodity) => farmerTotal + (Number.parseInt(commodity.weight, 10) || 0),
      0
    );
  }, 0);

  return (
    <div className="driver-summary-screen">
      <div className="driver-summary-header">
        <button onClick={onBack} className="driver-summary-back">←</button>
        <span>STEP 3 OF 4</span>
        <strong>75%</strong>
      </div>

      <div className="driver-summary-progress">
        <i />
      </div>

      <div className="driver-summary-title">
        <h1>Review summary</h1>
        <p>Please check your details</p>
      </div>

      <div className="driver-summary-card">
        <small>VEHICLE & DRIVER</small>
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
          <span>Origin</span>
          <strong>{driver.origin}</strong>
        </div>
      </div>

      <div className="driver-summary-card">
        <small>FARMERS & COMMODITIES</small>
        {farmers.map((farmer, farmerIndex) =>
          getCommodities(farmer).map((commodity, commodityIndex) => (
            <div
              className="driver-summary-farmer"
              key={`${farmer.name}-${farmerIndex}-${commodity.name}-${commodityIndex}`}
            >
              <span>
                {farmer.name}
                <em>{commodity.name}</em>
              </span>
              <strong>{commodity.weight}</strong>
            </div>
          ))
        )}
      </div>

      <div className="driver-summary-total">
        <span>Total cargo weight</span>
        <strong>{total} kg</strong>
      </div>

      <div className="driver-summary-actions">
        <button type="button" className="driver-button secondary" onClick={onBack}>
          Back
        </button>
        <button className="driver-summary-finish" onClick={onFinish}>
          Finish registration
          <span>✓</span>
        </button>
      </div>
    </div>
  );
}