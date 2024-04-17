import { MongoClient, ServerApiVersion } from "mongodb";

const uri =
  "mongodb+srv://root:root@wathare.m4vgvd2.mongodb.net/?retryWrites=true&w=majority&appName=Wathare";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let coll;
export async function initializeDb() {
  try {
    await client.connect();
    coll = client.db("Wathare").collection("mySensorData");
    console.log("Successfully connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
    throw error;
  }
}

export async function getCollection() {
  return client.db("Wathare").collection("mySensorData");
}

export async function closeDb() {
  await client.close();
}
