import mongoose from "mongoose";

export const ConnectDb = async () => {

  
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("DB connection error:", error.message);
    process.exit(1);
  }
};