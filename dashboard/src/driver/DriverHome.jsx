import "./DriverHome.css";

export default function DriverHome({ driver, onBack, onStart, onLogout }) {
  const initials = driver.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="driver-home">
      <div className="driver-home-header">
        <button type="button" className="driver-home-back" onClick={onBack}>←</button>

        <div className="driver-home-title">
          <small>Good morning</small>
          <h1>{driver.name}</h1>
        </div>

        <div className="driver-home-account">
          <div className="driver-avatar">{initials}</div>
          <button type="button" className="driver-logout-button" onClick={onLogout}>
            Log out
          </button>
        </div>
      </div>

      <div className="driver-home-content">
        <div className="driver-delivery-card">
          <div className="driver-truck-icon">🚚</div>
          <div>
            <span>TODAY'S DELIVERY</span>
            <h2>Register today's delivery</h2>
            <p>
              Complete your delivery registration before entering NVAT for fast-track automatic RFID clearance.
            </p>
          </div>
        </div>

        <button className="driver-start-button" onClick={onStart}>
          <span>Start registration</span>
          <strong>→</strong>
        </button>

        <div className="driver-home-info">
          <span>DRIVER INFORMATION</span>
          <div>
            <p>
              <small>Vehicle</small>
              <strong>{driver.vehicle}</strong>
            </p>
            <p>
              <small>Plate number</small>
              <strong>{driver.plate}</strong>
            </p>
            <p>
              <small>Origin</small>
              <strong>{driver.origin}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}