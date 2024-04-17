const { MongoClient } = require("mongodb");
const fs = require("fs");
const moment = require('moment');

let raw_data;
try {
    raw_data = fs.readFileSync("./sample-data.json");
} catch (error) {
    console.error("Error reading sample data:", error);
    return;
}
const sample_data = JSON.parse(raw_data);


let client;
let coll;

async function initializeDb() {
  client = await MongoClient.connect('mongodb://localhost:27017');
  coll = client.db('Wathare').collection('mySensorData');
}

async function addData() {
    const collections = await client.db('Wathare').listCollections().toArray();
    const coll_names = collections.map(c => c.name);
    if (!coll_names.includes('mySensorData')) {
        await coll.insertMany(sample_data);
    }
}

const filter = {};

// async function fetchData() {
//   const cursor = coll.find(filter);
//   const result = await cursor.toArray();
//   return result;
// }

async function fetchData(startTime, frequency) {
  if(!frequency && !startTime){
    return coll.find().toArray();
  }

  const start = new Date(startTime);
  console.log("start: " + start)
  let end;

  switch (frequency) {
    case 'hour':
      end = new Date(start.getTime() + (60 * 60 * 1000));
      console.log("hour end: " + end);
      break;
      case 'eighthours':
        end = new Date(start.getTime() + 8*(60 * 60 * 1000));
        console.log("hour end: " + end);
        break;
    case 'day':
      end = new Date(start.getTime() + (24 * 60 * 60 * 1000));
      console.log("day end: " + end);
      break;
    case 'week':
      end = new Date(start.getTime() + (7 * 24 * 60 * 60 * 1000));
      console.log("week end: " + end);
      break;
    case 'month':
      end = new Date(start.getFullYear(), start.getMonth() + 1, start.getDate());
      console.log("month end: " + end);
      break;
    default:
      return [];
  }

  const cursor = coll.find({
    ts: { $gte: start.toISOString(), $lt: end.toISOString() }
  });
  
  const result = await cursor.toArray();
  return result;
}

module.exports = { initializeDb, addData, fetchData };