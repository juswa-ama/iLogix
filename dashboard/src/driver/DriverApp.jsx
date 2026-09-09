import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Driver.css";

import DriverAdd from "./DriverAdd";
import DriverComplete from "./DriverComplete";
import DriverHome from "./DriverHome";
import DriverSummary from "./DriverSummary";

const initialDriver = {
  name: "Pedro Santos",
  phone: "0917 123 4567",
  vehicle: "6-Wheeler Forward Truck",
  plate: "CAV 8821",
  origin: "Bambang, Nueva Vizcaya",
};

const initialCommodities = [
  { name: "Cabbage (Repolyo)", weight: "350 kg" },
];

const initialFarmerCount = 3;

export default function DriverApp() {
  const [screen, setScreen] = useState("home");
  const [driver, setDriver] = useState(initialDriver);
  const [commodities, setCommodities] = useState(initialCommodities);
  const [farmerCount, setFarmerCount] = useState(initialFarmerCount);
  const navigate = useNavigate();

  function resetRegistration() {
    setDriver(initialDriver);
    setCommodities(initialCommodities);
    setFarmerCount(initialFarmerCount);
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
                onStart={() => setScreen("add")}
                onLogout={handleLogout}
              />
            )}

            {screen === "add" && (
              <DriverAdd
                driver={driver}
                setDriver={setDriver}
                commodities={commodities}
                setCommodities={setCommodities}
                farmerCount={farmerCount}
                setFarmerCount={setFarmerCount}
                onBack={() => setScreen("home")}
                onContinue={() => setScreen("summary")}
              />
            )}

            {screen === "summary" && (
              <DriverSummary
                driver={driver}
                commodities={commodities}
                farmerCount={farmerCount}
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