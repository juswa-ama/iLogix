import "./DriverAdd.css";

const commodityOptions = [
  "Cabbage (Repolyo)",
  "Carrots (Karot)",
  "Potatoes (Patatas)",
  "Tomatoes (Kamatis)",
  "Eggplant (Talong)",
  "Green beans (Sitaw)",
  "Corn (Mais)",
  "Squash (Kalabasa)",
  "Onions (Sibuyas)",
  "Garlic (Bawang)",
  "Chili peppers (Siling labuyo)",
  "Spinach (Kangkong)",
  "Lettuce (Letsugas)",
  "Cucumber (Pipino)",
  "Bell peppers (Siling pangsabaw)",
  "Radish (Labanos)",
  "Sweet potatoes (Kamote)",
  "Bitter melon (Ampalaya)",
  "Okra (Okra)",
];

const originOptions = [
  "Bambang, Nueva Vizcaya",
  "Bayombong, Nueva Vizcaya",
  "Kayapa, Nueva Vizcaya",
  "Aritao, Nueva Vizcaya",
  "Kasibu, Nueva Vizcaya",
  "Tuba, Benguet",
  "Atok, Benguet",
  "La Trinidad, Benguet",
];

export default function DriverAdd({ driver, setDriver, commodities, setCommodities, farmerCount, setFarmerCount, onBack, onContinue }) {
  function addCommodity() {
    setCommodities((current) => [
      ...current,
      { name: "Cabbage (Repolyo)", weight: "0 kg" },
    ]);
  }

  function removeCommodity(index) {
    setCommodities((current) => {
      if (current.length === 1) return current;
      return current.filter((_, itemIndex) => itemIndex !== index);
    });
  }

  function changeFarmerCount(delta) {
    setFarmerCount((current) => Math.max(1, (Number(current) || 0) + delta));
  }

  function changeCommodity(index, name) {
    setCommodities((current) =>
      current.map((commodity, itemIndex) =>
        itemIndex === index ? { ...commodity, name } : commodity,
      ),
    );
  }

  function changeOrigin(origin) {
    setDriver((current) => ({ ...current, origin }));
  }

  return (
    <div className="driver-screen-page">
      <div className="driver-step-header">
        <button onClick={onBack} aria-label="Go back">←</button>
        <span>Step 1 of 3</span>
        <strong>33%</strong>
      </div>

      <div className="driver-step-progress">
        <i style={{ width: "33%" }} />
      </div>

      <div className="driver-step-title">
        <h1>Cargo details <span className="driver-tl">(Karga o dala)</span></h1>
        <p>Origin and commodities <span className="driver-tl">(Pinagmulan at mga produkto)</span></p>
      </div>

      <div className="driver-field">
        <label>
          Cargo origin <span className="driver-tl">(Pinagmulan ng dala)</span>
        </label>
        <select
          className="driver-value driver-select"
          value={driver.origin}
          onChange={(event) => changeOrigin(event.target.value)}
        >
          {originOptions.map((origin) => (
            <option key={origin} value={origin}>
              {origin}
            </option>
          ))}
        </select>
      </div>

      <div className="driver-section">
        Commodities <span className="driver-tl">(Mga produkto)</span>
      </div>

      <div className="driver-field">
        <label>
          How many farmers? <span className="driver-tl">(Ilang magsasaka?)</span>
        </label>
        <div className="driver-stepper">
          <button
            type="button"
            className="driver-stepper-button"
            onClick={() => changeFarmerCount(-1)}
            aria-label="Fewer farmers"
          >
            −
          </button>
          <span className="driver-stepper-value">{farmerCount}</span>
          <button
            type="button"
            className="driver-stepper-button"
            onClick={() => changeFarmerCount(1)}
            aria-label="More farmers"
          >
            +
          </button>
        </div>
      </div>

      {commodities.map((commodity, index) => (
        <div className="driver-commodity-card" key={`${commodity.name}-${index}`}>
          <div className="driver-commodity-title">
            <span>Commodity {index + 1}</span>
            {index > 0 && (
              <button type="button" className="driver-remove" onClick={() => removeCommodity(index)}>
                Remove
              </button>
            )}
          </div>

          <div className="driver-field">
            <label>
              Commodity <span className="driver-tl">(Uri ng produkto)</span>
            </label>
            <select
              className="driver-value driver-select"
              value={commodity.name}
              onChange={(event) => changeCommodity(index, event.target.value)}
            >
              {commodityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="driver-field">
            <label>
              Weight (kg) <span className="driver-tl">(Timbang)</span>
            </label>
            <div className="driver-value">{commodity.weight}</div>
          </div>
        </div>
      ))}

      <button type="button" className="driver-add-another" onClick={addCommodity}>
        + Add another commodity <span className="driver-tl">(Magdagdag ng produkto)</span>
      </button>

      <div className="driver-actions">
        <button type="button" className="driver-button secondary" onClick={onBack}>
          Back
        </button>
        <button className="driver-button primary" onClick={onContinue}>
          Continue
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}