import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ConnectDb } from "./config/connectDb.js";
import router from "./routes/api.js";
import path from "path";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

app.set("trust proxy", 1);


const allowedOrigins = [
  "http://localhost:3000",
  "https://uniqbd-nextjs.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.options(/.*/, cors(corsOptions));
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

app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), "serverFolder/middleware/uploads")
  )
);


app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.json({ status: "API working" });
});


const startServer = async () => {
  try {
    await ConnectDb();
    console.log("MongoDB Connected");

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Server failed to start:", err);
    process.exit(1);
  }
};

startServer();