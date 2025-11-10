import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { authRouter } from "./routes/auth.js";
import { boxRouter } from "./routes/boxes.js";
import { subscriptionRouter } from "./routes/subscription.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/boxes", boxRouter);
app.use("/api/subscriptions", subscriptionRouter);

app.get("/", (req, res) => {
  res.send("Subscription Box API running");
});

// Start server
const PORT = process.env.PORT || 4000;
await connectDB(process.env.MONGO_URI);
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
