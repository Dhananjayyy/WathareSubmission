import { useEffect, useState } from "react";
import MyD3Chart from "./MyD3Chart";
import LocationTemperature from "./LocationTemperature";
import Simulator from "./Simulator";
import axios from "axios";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData(24);
  }, []);

  var mydata = JSON.stringify({
    collection: "mySensorData",
    database: "Wathare",
    dataSource: "Wathare",
    projection: {
      _id: 1,
    },
  });

  var config = {
    method: "post",
    url: "https://ap-south-1.aws.data.mongodb-api.com/app/data-iogss/endpoint/data/v1/action/findOne",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": process.env.MONGODB_URI,
    },
    data: mydata,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });

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

    try {
      const fetchedDataResult = await fetchedData(startTime, frequency);
      setData(fetchedDataResult);
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
        {loading ? <p>Loading...</p> : <MyD3Chart data={data} />}
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
