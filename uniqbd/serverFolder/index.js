import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";

import { ConnectDb } from "./config/connectDb.js";
import router from "./routes/api.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3001;

// ================= CORS =================
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://uniqbd-nextjs-updateversion-frontend.onrender.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },

  credentials: true,
};

app.use(cors(corsOptions));

// VERY IMPORTANT
app.options(/.*/, cors(corsOptions));

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ================= SOCKET =================
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// ================= ROUTES =================
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Running 🚀",
  });
});

// ================= ERROR =================
app.use((err, req, res, next) => {
  console.log(err);

  res.status(500).json({
    success: false,
    message: err.message,
  });
});

// ================= START =================
const startServer = async () => {
  try {
    await ConnectDb();

    console.log("✅ DB Connected");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();