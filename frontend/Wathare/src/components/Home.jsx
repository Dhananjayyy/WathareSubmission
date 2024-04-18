import { useEffect, useState } from "react";
import MyD3Chart from "./MyD3Chart";
import LocationTemperature from "./LocationTemperature";
import Simulator from "./Simulator";
import axios from "axios";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData(24); // Default fetch for 24 hours data on component mount
  }, []);

  const fetchData = async (hours) => {
    setLoading(true);
    const startTime = "2024-01-21T15:00:00Z";
    let frequency;
    if (hours === 1) frequency = "hour";
    else if (hours === 8) frequency = "eighthours";
    else if (hours === 24) frequency = "day";
    else return; // Exit if no valid hours are provided

    const proxy = "/api/mongo-proxy";
    try {
      const response = await axios.post(proxy, { startTime, frequency });
      const filteredData = filterData(
        response.data.documents,
        frequency,
        startTime
      );
      setData(filteredData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const filterData = (sensorData, frequency, startTime) => {
    const start = new Date(startTime);
    const endTimes = {
      hour: new Date(start.getTime() + 60 * 60 * 1000),
      eighthours: new Date(start.getTime() + 8 * 60 * 60 * 1000),
      day: new Date(start.getTime() + 24 * 60 * 60 * 1000),
      week: new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000),
    };
    return sensorData.filter((item) => {
      const ts = new Date(item.ts);
      if (frequency === "month") {
        return (
          ts.getFullYear() === start.getFullYear() &&
          ts.getMonth() === start.getMonth()
        );
      } else {
        return ts >= start && ts < (endTimes[frequency] || start);
      }
    });
  };

  console.log("this is data: " + JSON.stringify(data));

  return (
    <div className="container mt-3 mb-3 text-center content-center">
      <div className="">
        <h1>Wathare Infotech Solutions Submission</h1>
      </div>
      <br />
      <div className="mt-2 mb-2">
        <button className="btn btn-light m-3" onClick={() => fetchData(1)}>
          1 hr
        </button>
        <button className="btn btn-primary m-3" onClick={() => fetchData(8)}>
          8 hr
        </button>
        <button className="btn btn-secondary m-3" onClick={() => fetchData(24)}>
          24 hr
        </button>
      </div>
      <div className="">
        <h2>Cycle Status</h2>
        {loading ? <p>Loading...</p> : <MyD3Chart data={data} />}
      </div>
      <hr />
      <div className="mt-2 mb-2">
        <h2>Temperature</h2>
        {loading ? <p>Loading...</p> : <LocationTemperature />}
      </div>
      <hr />
      <div className="mt-2 mb-2">
        <h2> Simulator </h2>
        <Simulator />
      </div>
    </div>
  );
}
