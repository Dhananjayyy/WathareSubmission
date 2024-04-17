import axios from 'axios';

export default async function handler(req, res) {
    const { startTime, frequency } = req.body;
    console.log("startTime: " + startTime);
    console.log("frequency: " + frequency);
    
    var data = JSON.stringify({
        "collection": "mySensorData",
        "database": "Wathare",
        "dataSource": "Wathare",
        "projection": {
            "_id": 1,
            "ts": 1,
            "machine_status": 1,
            "vibration": 1
        },
        "limit": 50000
    });

    var config = {
        method: 'post',
        url: 'https://ap-south-1.aws.data.mongodb-api.com/app/data-iogss/endpoint/data/v1/action/find',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Request-Headers': '*',
          'api-key': '0qaAC8RoGqWQ3yPaxgLhP9d0fHTVVR9jkBcaZ5ug30RKlfw8p0o9QEBWh7Pt9C9z',
        },
        data: data
    };

    try {
        const response = await axios(config);

        if (!frequency && !startTime) {
            res.status(response.status).json(response.data);
            return;
        }

        const sensorData = response.data; // Assuming this is how your sensor data is received
        
        // Convert object to array of values
        const dataArray = Object.values(sensorData);
        console.log("dataArray: " + JSON.stringify(dataArray));

        // Filter data based on startTime and frequency
        let filteredData = dataArray.filter(item => {
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

        res.status(response.status).json(filteredData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
