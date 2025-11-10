import express from "express";
import { Box } from "../models/Box.js";
import { auth } from "../middleware/auth.js";

export const boxRouter = express.Router();

// Get all boxes
boxRouter.get("/", async (req, res) => {
  const boxes = await Box.find({ active: true });
  res.json(boxes);
});

// Get single box
boxRouter.get("/:id", async (req, res) => {
  const box = await Box.findById(req.params.id);
  if (!box) return res.status(404).json({ message: "Box not found" });
  res.json(box);
});

// Admin create
boxRouter.post("/", auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Admin only" });
  const { title, description, priceMonthlyUSD, items, imageUrl } = req.body;

  const box = new Box({ title, description, priceMonthlyUSD, items, imageUrl });
  await box.save();
  res.json(box);
});
