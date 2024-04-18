import { useState } from "react";

const Simulator = () => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [vibrationRange, setVibrationRange] = useState({ min: 500, max: 1000 });
  const [numEntries, setNumEntries] = useState(10);

  const simulateData = () => {
    // Simulate data based on the selected ranges
    const simulatedData = [];
    const startTimeMillis = new Date(startTime).getTime();
    const endTimeMillis = new Date(endTime).getTime();

    if (!startTime || !endTime || endTimeMillis <= startTimeMillis) {
      alert('Please select valid start and end times.');
      return;
    }

    let lastTimestamp = startTimeMillis;

    for (let i = 0; i < numEntries; i++) {
      const timestamp = new Date(lastTimestamp).toISOString();
      const machineStatus = Math.floor(Math.random() * 2);
      const vibration = Math.floor(Math.random() * (vibrationRange.max - vibrationRange.min) + vibrationRange.min);
      simulatedData.push({ ts: timestamp, machine_status: machineStatus, vibration: vibration });

      if (lastTimestamp > endTimeMillis) break;
    }

    const jsonOutput = JSON.stringify(simulatedData, null, 2);

    const element = document.createElement('a');
    const file = new Blob([jsonOutput], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'simulated_data.json';
    document.body.appendChild(element);
    element.click();
  };

return (
  <div style={{ display: "block", justifyContent: "center", width: "50%", margin: "auto", textAlign: "center" }}>
  <div className="row">
      <div className="col-md-6">
          <label className="form-label">Start Time:</label>
          <input type="datetime-local" className="form-control" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      </div>
      <div className="col-md-6">
          <label className="form-label">End Time:</label>
          <input type="datetime-local" className="form-control" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
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
          <input type="number" className="form-control" value={numEntries} onChange={(e) => setNumEntries(e.target.value)} />
      </div>
  </div>
  <div className="row" style={{ marginTop: "10px" }}>
      <div className="col">
          <button className="btn btn-primary" onClick={simulateData}>Download Json</button>
      </div>
  </div>
</div>

</div>

);
};

export default Simulator;
