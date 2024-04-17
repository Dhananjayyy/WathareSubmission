import axios from "axios";

export default async function handler(req, res) {
  const { startTime, frequency } = req.body;
  console.log("startTime: " + startTime);
  console.log("frequency: " + frequency);

  var data = JSON.stringify({
    collection: "mySensorData",
    database: "Wathare",
    dataSource: "Wathare",
    projection: {
      _id: 1,
      ts: 1,
      machine_status: 1,
      vibration: 1,
    },
    limit: 50000,
  });

  var config = {
    method: "post",
    url: "https://ap-south-1.aws.data.mongodb-api.com/app/data-iogss/endpoint/data/v1/action/find",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key":
        "0qaAC8RoGqWQ3yPaxgLhP9d0fHTVVR9jkBcaZ5ug30RKlfw8p0o9QEBWh7Pt9C9z",
    },
    data: data,
  };

  var formattedResponse = null;
  try {
    const response = await axios(config);

    if (!frequency && !startTime) {
      res.status(response.status).json(response.data);
    }

    const start = new Date(startTime);
    console.log("start: " + start);
    let end;

    switch (frequency) {
      case "hour":
        end = new Date(start.getTime() + 60 * 60 * 1000);
        console.log("hour end: " + end);
        break;
      case "eighthours":
        end = new Date(start.getTime() + 8 * (60 * 60 * 1000));
        console.log("hour end: " + end);
        break;
      case "day":
        end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
        console.log("day end: " + end);
        break;
      case "week":
        end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
        console.log("week end: " + end);
        break;
      case "month":
        end = new Date(
          start.getFullYear(),
          start.getMonth() + 1,
          start.getDate()
        );
        console.log("month end: " + end);
        break;
      default:
        return [];
    }

    // const cursor = coll.find({
    //   ts: { $gte: start.toISOString(), $lt: end.toISOString() },
    // });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
