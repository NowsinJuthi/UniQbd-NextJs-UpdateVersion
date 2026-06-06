import mongoose from "mongoose";

const smtpSchema = new mongoose.Schema(
  {
    host: String,
    email: String,
    password: String,
    port: String,
    jwtSecret: String,
    accessTokenSecret: String,
    refreshTokenSecret: String,
  },
  
  { timestamps: true }
);

const smtpModel = mongoose.model("SmtpConfig", smtpSchema);

export default smtpModel;