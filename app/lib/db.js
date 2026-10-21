import mongoose from "mongoose";

// Reuse one connection across hot reloads and serverless invocations.
let cached = globalThis.__mongoose;
if (!cached) cached = globalThis.__mongoose = { conn: null, promise: null };

export const isDbConfigured = () => Boolean(process.env.MONGO_URI);

export async function dbConnect() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set");
  }
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 8000,
      })
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
