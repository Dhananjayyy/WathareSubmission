import axios from 'axios';

export default async function handler(req, res) {
    var data = JSON.stringify({
        "collection": "mySensorData",
        "database": "Wathare",
        "dataSource": "Wathare",
        "projection": {
            "_id": 1
        }
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
    const response = await axios(config)
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
