import "./DriverHome.css";
import nvatLogo from "../admin/NVATlogo.png";

export default function DriverHome({ driver, onStart, onLogout }) {
  const initials = driver.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="driver-screen-page">
      <div className="driver-home-header">
        <div className="driver-home-title">
          <small>Good morning</small>
          <h1>{driver.name}</h1>
        </div>
        <div className="driver-avatar">{initials}</div>
      </div>

      <div className="driver-home-content">
        <div className="driver-delivery-card">
          <div className="driver-delivery-badge">
            <img src={nvatLogo} alt="NVAT logo" />
          </div>
          <span className="driver-delivery-eyebrow">
            Today's delivery <span className="driver-tl">(Paghahatid ngayon)</span>
          </span>
          <h2>Register today's delivery</h2>
          <p>
            Complete your delivery registration before entering NVAT for fast-track automatic RFID clearance.
          </p>
        </div>

        <button className="driver-start-button" onClick={onStart}>
          <span>
            Start registration <span className="driver-tl-light">(Simulan ang pagpaparehistro)</span>
          </span>
          <strong>→</strong>
        </button>

        <div className="driver-home-info">
          <span>
            Driver information <span className="driver-tl">(Impormasyon ng drayber)</span>
          </span>
          <div>
            <p>
              <small>Driver</small>
              <strong>{driver.name}</strong>
            </p>
            <p>
              <small>Mobile</small>
              <strong>{driver.phone}</strong>
            </p>
            <p>
              <small>
                Vehicle <span className="driver-tl">(Sasakyan)</span>
              </small>
              <strong>{driver.vehicle}</strong>
            </p>
            <p>
              <small>Plate number</small>
              <strong className="driver-plate">{driver.plate}</strong>
            </p>
            <p>
              <small>
                Origin <span className="driver-tl">(Pinagmulan)</span>
              </small>
              <strong>{driver.origin}</strong>
            </p>
          </div>
        </div>
      </div>

      <div className="driver-actions">
        <button
          type="button"
          className="driver-button secondary driver-logout-button"
          onClick={onLogout}
        >
          Log out
        </button>
      </div>
    </div>
  );
}