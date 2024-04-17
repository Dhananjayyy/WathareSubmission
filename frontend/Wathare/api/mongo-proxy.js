import axios from 'axios';

export default async function handler(req, res) {
    // Pagination parameters
    const pageSize = 100; // Adjust this as needed
    let pageNumber = 1;
    let allData = [];

    try {
        while (true) {
            // Define the query with pagination parameters
            const data = {
                collection: "mySensorData",
                database: "Wathare",
                dataSource: "Wathare",
                projection: {
                    "_id": 1,
                    "ts": 1,
                    "machine_status": 1,
                    "vibration": 1
                },
                options: {
                    limit: pageSize,
                    skip: (pageNumber - 1) * pageSize
                }
            };

            const config = {
                method: 'post',
                url: 'https://ap-south-1.aws.data.mongodb-api.com/app/data-iogss/endpoint/data/v1/action/find',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Request-Headers': '*',
                    'api-key': '0qaAC8RoGqWQ3yPaxgLhP9d0fHTVVR9jkBcaZ5ug30RKlfw8p0o9QEBWh7Pt9C9z',
                },
                data: JSON.stringify(data)
            };

            const response = await axios(config);

            // Add the retrieved data to the result array
            allData.push(...response.data.results);

            // If the number of retrieved documents is less than the page size, break the loop
            if (response.data.results.length < pageSize) {
                break;
            }

            // Increment the page number for the next request
            pageNumber++;
        }

        // Return all the retrieved data
        res.status(200).json(allData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
