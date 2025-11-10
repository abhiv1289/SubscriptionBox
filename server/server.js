// server/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { authRouter } from "./routes/auth.js";
import { boxRouter } from "./routes/boxes.js";
import { subscriptionRouter } from "./routes/subscription.js";

const app = express();

// read allowed client origins from env; support comma-separated list
const raw = process.env.CLIENT_URL || "http://localhost:5173";
const allowedOrigins = raw.split(",").map((s) => s.trim());

// configure CORS
app.use(
  cors({
    origin: allowedOrigins, // add your frontend URL here
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// routes
app.use("/api/auth", authRouter);
app.use("/api/boxes", boxRouter);
app.use("/api/subscriptions", subscriptionRouter);

app.get("/", (req, res) => res.send("Subscription Box API running"));

const PORT = process.env.PORT || 4000;
await connectDB(process.env.MONGO_URI);
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
