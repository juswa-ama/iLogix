import "./DriverAdd.css";

export default function DriverAdd({ driver, farmers, setFarmers, onBack, onContinue }) {
  function getCommodities(farmer) {
    return farmer.commodities || [{ name: farmer.commodity, weight: farmer.weight }];
  }

  function addFarmer() {
    setFarmers((current) => [
      ...current,
      { name: "New farmer", commodities: [{ name: "Cabbage (Repolyo)", weight: "0 kg" }] },
    ]);
  }

  function addCommodity(farmerIndex) {
    setFarmers((current) =>
      current.map((farmer, index) => {
        if (index !== farmerIndex) return farmer;
        return { ...farmer, commodities: [...getCommodities(farmer), { name: "New commodity", weight: "0 kg" }] };
      })
    );
  }

  function removeCommodity(farmerIndex, commodityIndex) {
    setFarmers((current) =>
      current.map((farmer, index) => {
        if (index !== farmerIndex) return farmer;
        const commodities = getCommodities(farmer);
        if (commodities.length === 1) return farmer;
        return { ...farmer, commodities: commodities.filter((_, itemIndex) => itemIndex !== commodityIndex) };
      })
    );
  }

  function removeFarmer(index) {
    setFarmers((current) => current.filter((_, farmerIndex) => farmerIndex !== index));
  }

  return (
    <div className="driver-add">
      <div className="driver-add-header">
        <button onClick={onBack} className="driver-add-back">←</button>
        <span>STEP 2 OF 4</span>
        <strong>50%</strong>
      </div>

      <div className="driver-add-progress">
        <i />
      </div>

      <div className="driver-add-title">
        <h1>Cargo details</h1>
        <p>Origin and farmer commodities</p>
      </div>

      <div className="driver-add-field">
        <label>Cargo origin</label>
        <div>{driver.origin}</div>
      </div>

      <div className="driver-add-section">FARMERS</div>

      {farmers.map((farmer, index) => (
        <div className="driver-farmer-card" key={`${farmer.name}-${index}`}>
          <div className="driver-farmer-title">
            <strong>FARMER {index + 1}</strong>
            {index > 0 && (
              <button onClick={() => removeFarmer(index)}>Remove</button>
            )}
          </div>

          <div className="driver-add-field">
            <label>Farmer name</label>
            <div>{farmer.name}</div>
          </div>

          {getCommodities(farmer).map((commodity, commodityIndex) => (
            <div className="driver-commodity" key={`${commodity.name}-${commodityIndex}`}>
              <div className="driver-commodity-heading">
                <span>COMMODITY {commodityIndex + 1}</span>
                {commodityIndex > 0 && (
                  <button type="button" onClick={() => removeCommodity(index, commodityIndex)}>Remove</button>
                )}
              </div>

              <div className="driver-add-field">
                <label>Commodity</label>
                <div>
                  {commodity.name}
                  <span>⌄</span>
                </div>
              </div>

              <div className="driver-add-field">
                <label>Weight (kg)</label>
                <div>{commodity.weight}</div>
              </div>
            </div>
          ))}

          <button type="button" className="driver-add-commodity" onClick={() => addCommodity(index)}>
            + Add commodity
          </button>
        </div>
      ))}

      <button className="driver-add-another" onClick={addFarmer}>+ Add another farmer</button>

      <div className="driver-add-actions">
        <button type="button" className="driver-button secondary" onClick={onBack}>
          Back
        </button>
        <button className="driver-add-continue" onClick={onContinue}>
          Continue
          <span>→</span>
        </button>
      </div>
    </div>
  );
}