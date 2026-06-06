import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/connectDb.js";
import router from "./routes/api.js";
import http from "http";
import { uploadDir } from "./config/uploadPath.js";
import { Server } from "socket.io";
import dns from "dns";
import mongoose from "mongoose";


dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

app.set("trust proxy", 1);

const allowedOrigins = String(process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn("Blocked CORS origin:", origin);
      return callback(null, false);
    },
    credentials: true,
  })
);

export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Admin connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Admin disconnected:", socket.id);
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static(uploadDir));

app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.json({ status: "API working" });
});

const startServer = async () => {
  try {
    await connectDB();

    
    console.log("DB READY:", mongoose.connection.readyState);

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Server failed:", err);
    process.exit(1);
  }
};

startServer(); 