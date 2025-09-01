import mongoose from "mongoose";

declare global {
  var _mongooseConn: Promise<typeof mongoose> | undefined;
}

export async function connectToDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  if (!global._mongooseConn) {
    global._mongooseConn = mongoose
      .connect(uri, { dbName: process.env.MONGODB_DB || undefined })
      .then((m: typeof mongoose) => {
        return m;
      });
  }
  return global._mongooseConn;
}

export default connectToDB;
