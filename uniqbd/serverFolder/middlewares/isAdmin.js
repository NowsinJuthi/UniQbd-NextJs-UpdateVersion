import userModel from "../models/usersModel.js";

const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (req.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin only access",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export default isAdmin;