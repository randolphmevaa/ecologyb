// /lib/mongodb.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // your connection string (set in .env.local)
const options = {};

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

const client = new MongoClient(uri, options);
let clientPromise: Promise<MongoClient>;

// Extend Node's global type to include our MongoClient promise.
// This tells TypeScript that `global._mongoClientPromise` is a Promise<MongoClient> or undefined.
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value is preserved across module reloads.
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  clientPromise = client.connect();
}

export default clientPromise;
