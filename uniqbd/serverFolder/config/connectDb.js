import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Connecting MongoDB...");
    console.log("URI exists:", !!process.env.MONGODB_URI);

    mongoose.connection.on("connected", () => {
      console.log("Mongoose Connected");
    });

    mongoose.connection.on("error", (err) => {
      console.log("Mongoose Error:", err);
    });

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected");
    console.log("Ready State:", mongoose.connection.readyState);
  } catch (error) {
    console.log("DB ERROR:", error);
  }
};

export default connectDB;