import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Driver.css";

import DriverAdd from "./DriverAdd";
import DriverComplete from "./DriverComplete";
import DriverHome from "./DriverHome";
import DriverInfo from "./DriverInfo";
import DriverSummary from "./DriverSummary";

const initialDriver = {
  name: "Pedro Santos",
  phone: "0917 123 4567",
  vehicle: "6-Wheeler Forward Truck",
  plate: "CAV 8821",
  origin: "Bambang, Nueva Vizcaya",
};

const initialFarmers = [
  { name: "Maria Santos", commodities: [{ name: "Cabbage (Repolyo)", weight: "350 kg" }] },
];

export default function DriverApp() {
  const [screen, setScreen] = useState("home");
  const [driver, setDriver] = useState(initialDriver);
  const [farmers, setFarmers] = useState(initialFarmers);
  const navigate = useNavigate();

  function resetRegistration() {
    setDriver(initialDriver);
    setFarmers(initialFarmers);
    setScreen("home");
  }

  function handleLogout() {
    localStorage.removeItem("driver_user");
    sessionStorage.removeItem("driver_user");
    navigate("/", { replace: true });
  }

  return (
    <div className="driver-app">
      <div className="driver-phone-shell">
        <div className="driver-phone">
          <div className="driver-status" aria-hidden="true">
            <span>9:41</span>
            <span className="driver-status-icons">▴ ▪</span>
          </div>

          <div className="driver-screen">
            {screen === "home" && (
              <DriverHome
                driver={driver}
                onBack={() => navigate(-1)}
                onStart={() => setScreen("info")}
                onLogout={handleLogout}
              />
            )}

            {screen === "info" && (
              <DriverInfo driver={driver} onBack={() => setScreen("home")} onContinue={() => setScreen("add")} />
            )}

            {screen === "add" && (
              <DriverAdd
                driver={driver}
                farmers={farmers}
                setFarmers={setFarmers}
                onBack={() => setScreen("info")}
                onContinue={() => setScreen("summary")}
              />
            )}

            {screen === "summary" && (
              <DriverSummary
                driver={driver}
                farmers={farmers}
                onBack={() => setScreen("add")}
                onFinish={() => setScreen("complete")}
              />
            )}

            {screen === "complete" && (
              <DriverComplete driver={driver} onDone={resetRegistration} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}