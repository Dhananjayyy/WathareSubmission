const exp = require("express");
const fs = require("fs");
const mongo = require('mongoose');
const cors = require("cors");

const app = exp();
app.use(cors());
app.use(exp.json());

const raw_data = fs.readFileSync("./sample-data.json");
const sample_data = JSON.parse(raw_data);
if (sample_data) {
  console.log('data read successfully');
} else {
  console.log('failed to read the data');
}

mongo.connect('mongodb://localhost:27017/Wathare')
  .then(() => {
    console.log('connected successfully to mongodb');
    const dataCollection = mongo.connection.collection('mySensorData');
    dataCollection.insertMany(sample_data)
      .then(() => {
        console.log('data inserted successfully into database: Wathare and collection: mySensorData');
      })
      .catch((err) => {
        console.error('failed to insert data:', err);
      });
  })
  .catch((err) => {
    console.error('failed to connect to mongodb:', err);
  });

app.get("/hello", (req, res) => {
  res.send("Hello World");
});

app.listen(9000, function () {
  console.log("server started on http://localhost:9000");
});
