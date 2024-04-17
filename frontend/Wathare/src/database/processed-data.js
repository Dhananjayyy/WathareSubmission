import { initializeDb, getCollection, closeDb } from "./mongodb.js";

async function fetchedData(startTime, frequency) {
  try {
    await initializeDb(); // Ensure connection is initialized first
    const coll = await getCollection();
    if (!coll) {
      throw new Error("MongoDB collection is not initialized.");
    }

    if (!frequency && !startTime) {
      return coll.find().toArray();
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

    const cursor = coll.find({
      ts: { $gte: start.toISOString(), $lt: end.toISOString() },
    });

    const result = await cursor.toArray();
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

(async () => {
  try {
    await initializeDb();
    const data = await fetchedData("2024-01-21T15:00:00Z", "hour");
    console.log(data);
  } catch (error) {
    console.error("Error in process:", error);
  } finally {
    await closeDb();
  }
})();

export { initializeDb, fetchedData };
