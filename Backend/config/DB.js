import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

const connectDB = async () => {
  if (!MONGODB_URL) {
    console.warn("MONGODB_URL not defined - database connection skipped");
    return;
  }
  
  try {
    const conn = await mongoose.connect(MONGODB_URL);
    console.log(`MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed through app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    // Don't exit - server can run without DB for testing
  }
};

export default connectDB;
