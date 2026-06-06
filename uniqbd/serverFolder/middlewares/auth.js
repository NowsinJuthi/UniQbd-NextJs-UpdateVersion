import jwt from "jsonwebtoken";
import userModel from "../models/usersModel.js";

const auth = async (req, res, next) => {
  try {
    let token = req.cookies?.accessToken;

    const header = req.headers.authorization;

    if (!token && header?.startsWith("Bearer ")) {
      token = header.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token found",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JSON_WEB_TOKEN_SECRET_KEY
    );

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.userId = user._id;
    req.role = user.role;
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export default auth;