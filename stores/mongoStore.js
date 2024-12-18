import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017");
const dbName = "paymentDatabase";
const collectionName = "metadata";

export const add = async (metadata) => {
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  await client.connect();
  const result = await collection.insertOne(metadata);
  return result.insertedId;
};

export const getAll = async () => {
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  await client.connect();
  return await collection.find().toArray();
};

export const get = async (id) => {
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  await client.connect();
  return await collection.findOne({ id });
};

export const save = async (metadata) => {
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  await client.connect();
  const result = await collection.updateOne(
    { id: metadata.id },
    { $set: metadata },
    { upsert: true }
  );
  return result.upsertedId || metadata.id;
};

export const update = async (id, updatedData) => {
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  await client.connect();
  const result = await collection.updateOne({ id }, { $set: updatedData });
  return result.matchedCount > 0 ? await get(id) : null;
};

export const deleteMetadata = async (id) => {
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  await client.connect();
  const result = await collection.deleteOne({ id });
  return result.deletedCount > 0;
};
