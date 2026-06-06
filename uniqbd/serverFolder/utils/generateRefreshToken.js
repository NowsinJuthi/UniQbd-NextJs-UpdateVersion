import jwt from "jsonwebtoken";
import userModel from "../models/usersModel.js";

const generateRefreshToken = async (user) => {
  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JSON_WEB_TOKEN_SECRET_KEY,
    { expiresIn: "7d" }
  );

  await userModel.updateOne(
    { _id: user._id },
    { refreshToken: token }
  );

  return token;
};

export default generateRefreshToken;