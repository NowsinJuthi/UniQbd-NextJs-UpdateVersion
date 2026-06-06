import jwt from "jsonwebtoken";

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JSON_WEB_TOKEN_SECRET_KEY,
    { expiresIn: "24h" }
  );
};

export default generateAccessToken;