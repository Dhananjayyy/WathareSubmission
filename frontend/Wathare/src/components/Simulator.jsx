import { useState } from "react";
import MyD3Chart from "./MyD3Chart";

const Simulator = () => {
  const [startTime, setStartTime] = useState(null);
  const [vibrationRange, setVibrationRange] = useState({ min: 500, max: 1000 });
  const [numEntries, setNumEntries] = useState(10);
  const [data, setData] = useState(null);
  const [showSimulation, setShowSimulation] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const viewSimulation = () => {
    setShowSimulation(true);
  }

  const simulateData = () => {
    if (!startTime) {
      setErrorMessage('Please select a valid start time.');
      return;
    }
  
    const startTimeMillis = new Date(startTime).getTime();
    if (isNaN(startTimeMillis)) {
      setErrorMessage('Invalid start time. Please select a valid date and time.');
      return;
    }
  
    const simulatedData = [];
    let lastTimestamp = startTimeMillis;
    const interval = (numEntries > 1) ? (startTimeMillis + 1000 - lastTimestamp) / (numEntries - 1) : 0;
  
    for (let i = 0; i < numEntries; i++) {
      const timestamp = new Date(lastTimestamp).toISOString();
      const machineStatus = Math.floor(Math.random() * 2);
      const vibration = Math.floor(Math.random() * (vibrationRange.max - vibrationRange.min) + vibrationRange.min);
      simulatedData.push({ ts: timestamp, machine_status: machineStatus, vibration: vibration });
      lastTimestamp += interval;
    }

    setData(simulatedData);
    setShowSimulation(true);
    setErrorMessage("");
  };
  
  const calculateEndTime = () => {
    if (!startTime) return null;
    const endTime = new Date(startTime);
    endTime.setSeconds(endTime.getSeconds() + numEntries - 1);
    return endTime.toISOString();
  }

  return (
    <div className="container text-center" style={{ width: "50%", margin: "auto", textAlign: "center" }}>
      <div className="row">
        <div className="col">
          <label className="form-label">Start Time:</label>
          <input type="datetime-local" className="form-control" value={startTime || ''} onChange={(e) => setStartTime(e.target.value)} />
        </div>
      </div>
      <div className="row" style={{ marginTop: "10px" }}>
        <div className="col-md-6">
          <label className="form-label">Min Vibration:</label>
          <input
            type="number"
            className="form-control"
            value={vibrationRange.min}
            onChange={(e) => setVibrationRange({ ...vibrationRange, min: parseInt(e.target.value) })}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Max Vibration:</label>
          <input
            type="number"
            className="form-control"
            value={vibrationRange.max}
            onChange={(e) => setVibrationRange({ ...vibrationRange, max: parseInt(e.target.value) })}
          />
        </div>
      </div>
      <div className="row" style={{ marginTop: "10px" }}>
        <div className="col">
          <label className="form-label">Number of Entries:</label>
          <input type="number" className="form-control" value={numEntries} onChange={(e) => setNumEntries(parseInt(e.target.value))} />
        </div>
        <div className="col">
          <label className="form-label">End Time:</label>
          <input type="text" className="form-control" value={calculateEndTime()} readOnly />
        </div>
      </div>
      <div className="row" style={{ marginTop: "10px" }}>
        <div className="col">
          <button className="btn btn-primary" onClick={simulateData}>View Simulation</button>
          {errorMessage && <p className="text-danger">{errorMessage}</p>}
        </div>
        {showSimulation && (
          <div className="col" style={{ marginTop: "10px" }}>
            <MyD3Chart data={data} style={{ width: "100%" }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Simulator;
