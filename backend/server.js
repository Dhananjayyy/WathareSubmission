const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./database');

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello");
});

// app.get("/sampleData", async (req, res) => {
//   try {
//     const data = await db.fetchData();
//     res.send(data);
//   } catch (err) {
//     console.error('Failed to fetch sample data:', err);
//     res.status(500).send('Internal Server Error');
//   }
// });

app.get("/sampleData", async (req, res) => {
  const { startTime, frequency } = req.query;
  if (!startTime || !frequency) {
    const data = await db.fetchData(startTime, frequency);
    res.send(data);
  } else {
    try {
      const data = await db.fetchData(startTime, frequency);
      res.send(data);
    } catch (err) {
      console.error('Failed to fetch sample data:', err);
      res.status(500).send('Internal Server Error');
    }
  }
});

app.post("/sampleData", async (req, res) => {
  try {
    await db.addData(req.body);
    res.status(201).send('Data added successfully');
  } catch (err) {
    console.error('Failed to add data:', err);
    res.status(500).send('Internal Server Error');
  }
});


db.initializeDb().catch(err => console.error(err));

app.listen(9000, () => console.log('Server is running on port 9000'));