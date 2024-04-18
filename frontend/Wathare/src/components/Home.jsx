import { useEffect, useState } from "react";
import MyD3Chart from "./MyD3Chart";
import LocationTemperature from "./LocationTemperature";
import Simulator from "./Simulator";
import axios from "axios";

export default function Home() {
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData(24);
  }, []);

  const fetchData = async (hours) => {
    setLoading(true);
    const startTime = "2024-01-21T15:00:00Z";
    let frequency;
    if (hours === 1) {
      frequency = "hour";
    } else if (hours === 8) {
      frequency = "eighthours";
    } else if (hours === 24) {
      frequency = "day";
    } else {
      frequency = null;
    }

    const fetchedData = (startTime, frequency) => {
      const SERVERLESS_FUNCTION_URL = "/api/mongo-proxy";
      let totaldata = null;
      axios
        .post(SERVERLESS_FUNCTION_URL)
        .then(function (response) {
          totaldata = response.data.documents;
        })
        .catch(function (error) {
          console.log(error);
        });
      return totaldata;
    };

    try {
      const fetchedDataResult = fetchedData(startTime, frequency);
      setData(fetchedDataResult);






      const sensorData = fetchedDataResult; // Assuming this is how your sensor data is received
        
      // Filter data based on startTime and frequency
      let filteredData = sensorData.filter(item => {
          const ts = new Date(item.ts);
          switch (frequency) {
              case "hour":
                  return ts >= new Date(startTime) && ts < new Date(startTime + 60 * 60 * 1000);
              case "eighthours":
                  return ts >= new Date(startTime) && ts < new Date(startTime + 8 * 60 * 60 * 1000);
              case "day":
                  return ts >= new Date(startTime) && ts < new Date(startTime + 24 * 60 * 60 * 1000);
              case "week":
                  return ts >= new Date(startTime) && ts < new Date(startTime + 7 * 24 * 60 * 60 * 1000);
              case "month":
                  return ts.getFullYear() === new Date(startTime).getFullYear() && ts.getMonth() === new Date(startTime).getMonth();
              default:
                  return false;
          }
      });

      setFilterData(filteredData);






      console.log("sensor data: " + sensorData.toString());
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data", error);
      setLoading(false);
    }
  };

  return (
    <div className="container mt-3 mb-3 text-center content-center">
      <h1>Wathare Infotech Solutions Submission</h1>
      <div>
        <button
          className="btn btn-outline-primary m-2"
          onClick={() => fetchData(1)}
        >
          1 hr
        </button>
        <button
          className="btn btn-outline-primary m-2"
          onClick={() => fetchData(8)}
        >
          8 hr
        </button>
        <button
          className="btn btn-outline-primary m-2"
          onClick={() => fetchData(24)}
        >
          24 hr
        </button>
      </div>
      <div>
        <h2>Cycle Status</h2>
        {loading ? <p>Loading...</p> : <MyD3Chart data={filterData} />}
      </div>
      <div>
        <h2>Temperature</h2>
        {loading ? <p>Loading...</p> : <LocationTemperature />}
      </div>
      <div>
        <h2> Simulator </h2>
        <Simulator />
      </div>
    </div>
  );
}
