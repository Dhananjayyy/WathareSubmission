import { useEffect, useState } from "react";
import MyD3Chart from "./MyD3Chart";
import LocationTemperature from "./LocationTemperature";
import Simulator from "./Simulator";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData(24);
  }, []);

  const fetchData = (hours) => {
    setLoading(true);
    const startTime = '2024-01-21T15:00:00Z';
    var frequency;
    if(hours === 1){
      frequency = 'hour';
    } else if(hours === 8){
      frequency = 'eighthours';
    }
    else if (hours === 24) {
      frequency = 'day';
    } else {
      frequency = null;
    }

    const url = `http://localhost:9000/sampleData?startTime=${startTime}&frequency=${frequency}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch data", error);
        setLoading(false);
      });
  };

  return (
    <div className="container mt-3 mb-3 text-center content-center">
      <h1>Wathare Infotech Solutions Submission</h1>
      <div>
        <button className="btn btn-outline-primary m-2" onClick={() => fetchData(1)}>1 hr</button>
        <button className="btn btn-outline-primary m-2" onClick={() => fetchData(8)}>8 hr</button>
        <button className="btn btn-outline-primary m-2" onClick={() => fetchData(24)}>24 hr</button>
      </div>
      <div>
      <h2>Cycle Status </h2>
      {loading ? <p>Loading...</p> : <MyD3Chart data={data} />}
      </div>
      <div>
      <h2>Temperature</h2>
      {loading ? <p>Loading...</p> : <LocationTemperature/>}
      </div>
      <div>
        <h2> Simulator </h2>
        <Simulator/>
      </div>
    </div>
  );
}
