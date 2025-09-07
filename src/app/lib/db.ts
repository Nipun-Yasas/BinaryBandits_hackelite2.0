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
    const options = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 10,
      retryWrites: true,
      retryReads: true,
      dbName: process.env.MONGODB_DB || 'hacklightDb'
    };

    global._mongooseConn = mongoose
      .connect(uri, options)
      .then((m: typeof mongoose) => {
        console.log('MongoDB connected successfully');
        return m;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        throw error;
      });
  }
  return global._mongooseConn;
}

export default connectToDB;
