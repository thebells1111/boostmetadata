import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017");
const dbName = "paymentDatabase";
const collectionName = "metadata";

export const add = async (metadata) => {
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  await client.connect();
  await collection.insertOne(metadata);
};

export const getAll = async () => {
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  await client.connect();
  return await collection.find().toArray();
};

export const deleteMetadata = async (id) => {
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  await client.connect();
  const result = await collection.deleteOne({ id });
  return result.deletedCount > 0;
};
