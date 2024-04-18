import { useState } from "react";
import MyD3Chart from "./MyD3Chart";

const Simulator = () => {
  const [startTime, setStartTime] = useState('');
  const [vibrationRange, setVibrationRange] = useState({ min: 500, max: 1000 });
  const [numEntries, setNumEntries] = useState(10);
  const [data, setData] = useState(null);
  const [showSimulation, setShowSimulation] = useState(false);

  const viewSimulation = () => {
    setShowSimulation(true);
  }

  const simulateData = () => {
    const simulatedData = [];
    const getDate = new Date(startTime);
    const startTimeMillis = getDate.getMilliseconds();
  
    if (!startTime) {
      alert('Please select valid start time.');
      return;
    }
    let lastTimestamp = startTimeMillis;
  
    for (let i = 0; i < numEntries; i++) {
      const timestamp = new Date(lastTimestamp).toISOString();
      const machineStatus = Math.floor(Math.random() * 2);
      const vibration = Math.floor(Math.random() * (vibrationRange.max - vibrationRange.min) + vibrationRange.min);
      simulatedData.push({ ts: timestamp, machine_status: machineStatus, vibration: vibration });
      lastTimestamp += 1000;
    }
  
    setData(simulatedData);
    console.log("simulated data: "+JSON.stringify(simulatedData));
    setShowSimulation(true);
  };

  return (
    <div>
      <div
        className="container text-center content-center"
        style={{
          justifyContent: "center",
          width: "50%",
          margin: "auto",
          textAlign: "center",
        }}
      >
        <div className="row">
          <div className="col">
            <label className="form-label">Start Time:</label>
            <input
              type="datetime-local"
              className="form-control"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
        </div>
        <div className="row" style={{ marginTop: "10px" }}>
          <div className="col-md-6">
            <label className="form-label">Min Vibration:</label>
            <input
              type="number"
              className="form-control"
              value={vibrationRange.min}
              onChange={(e) =>
                setVibrationRange({
                  ...vibrationRange,
                  min: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Max Vibration:</label>
            <input
              type="number"
              className="form-control"
              value={vibrationRange.max}
              onChange={(e) =>
                setVibrationRange({
                  ...vibrationRange,
                  max: parseInt(e.target.value),
                })
              }
            />
          </div>
        </div>
        <div className="row" style={{ marginTop: "10px" }}>
          <div className="col">
            <label className="form-label">Number of Entries:</label>
            <input
              type="number"
              className="form-control"
              value={numEntries}
              onChange={(e) => setNumEntries(parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>
<div className="">
      <div className="">
        <button className="btn btn-primary" onClick={simulateData}>
          View Simulation
        </button>
      </div>
      {showSimulation && (
        <div className="" style={{ marginTop: "10px" }}>
          <MyD3Chart data={data} style={{ width: "100%" }} />
        </div>
      )}
    </div>
    </div>
  );
};

export default Simulator;
