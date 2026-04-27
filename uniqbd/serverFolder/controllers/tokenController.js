import tokenModel from "../models/tokenModel.js";


export const saveConfig = async (req, res) => {
  try {
    const {
      PORT,
      MONGODB_URI,
      ACCESS_TOKEN_SECRET,
      REFRESH_TOKEN_SECRET,
      JWT_SECRET,
    } = req.body;

    let config = await tokenModel.findOne();

    if (!config) {
      config = new tokenModel({
        PORT,
        MONGODB_URI,
        ACCESS_TOKEN_SECRET,
        REFRESH_TOKEN_SECRET,
        JWT_SECRET,
      });
    } else {
      config.PORT = PORT;
      config.MONGODB_URI = MONGODB_URI;
      config.ACCESS_TOKEN_SECRET = ACCESS_TOKEN_SECRET;
      config.REFRESH_TOKEN_SECRET = REFRESH_TOKEN_SECRET;
      config.JWT_SECRET = JWT_SECRET;
    }

    await config.save();

    res.json({ success: true, message: "Config saved" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getConfig = async (req, res) => {
  const config = await tokenModel.findOne();
  res.json({ success: true, data: config });
};