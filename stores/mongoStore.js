const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
const dbName = "paymentDatabase";
const collectionName = "metadata";

module.exports = {
  add: async (metadata) => {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    await client.connect();
    await collection.insertOne(metadata);
  },
  getAll: async () => {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    await client.connect();
    return await collection.find().toArray();
  },
  delete: async (id) => {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    await client.connect();
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  },
};
