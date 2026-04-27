import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
  PORT: String,
  MONGODB_URI: String,
  ACCESS_TOKEN_SECRET: String,
  REFRESH_TOKEN_SECRET: String,
  JWT_SECRET: String,
});

const tokenModel = mongoose.model("Config", configSchema);

export default tokenModel;