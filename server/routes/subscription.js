import express from "express";
import { Subscription } from "../models/Subscription.js";
import { Box } from "../models/Box.js";
import { auth } from "../middleware/auth.js";

export const subscriptionRouter = express.Router();

// Subscribe to a box (simulate payment)
subscriptionRouter.post("/:boxId/subscribe", auth, async (req, res) => {
  const { boxId } = req.params;
  const box = await Box.findById(boxId);
  if (!box) return res.status(404).json({ message: "Box not found" });

  // Find ANY existing subscription for this user & box
  const existing = await Subscription.findOne({
    user: req.user._id,
    box: boxId,
  });

  // If already active or paused, do not create a new one
  if (
    existing &&
    (existing.status === "active" || existing.status === "paused")
  ) {
    return res
      .status(400)
      .json({ message: "You already have a subscription for this box." });
  }

  // If cancelled, reactivate instead of creating new
  if (existing && existing.status === "cancelled") {
    existing.status = "active";
    existing.nextBilling = new Date(
      new Date().setMonth(new Date().getMonth() + 1)
    );
    await existing.save();
    return res.json(existing);
  }

  // Otherwise create a new subscription
  const nextBilling = new Date();
  nextBilling.setMonth(nextBilling.getMonth() + 1);

  const newSub = new Subscription({
    user: req.user._id,
    box: boxId,
    status: "active",
    nextBilling,
  });
  await newSub.save();
  res.json(newSub);
});

// 🆕 Get all subscriptions for logged-in user
subscriptionRouter.get("/", auth, async (req, res) => {
  try {
    const subs = await Subscription.find({ user: req.user._id }).populate(
      "box"
    );
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: "Failed to load subscriptions" });
  }
});

// Cancel subscription
subscriptionRouter.post("/:id/cancel", auth, async (req, res) => {
  const sub = await Subscription.findById(req.params.id);
  if (!sub) return res.status(404).json({ message: "Not found" });
  if (!sub.user.equals(req.user._id))
    return res.status(403).json({ message: "Not owner" });
  sub.status = "cancelled";
  await sub.save();
  res.json(sub);
});

// Pause / Resume
subscriptionRouter.post("/:id/pause", auth, async (req, res) => {
  const sub = await Subscription.findById(req.params.id);
  if (!sub) return res.status(404).json({ message: "Not found" });
  if (!sub.user.equals(req.user._id))
    return res.status(403).json({ message: "Not owner" });
  sub.status = sub.status === "paused" ? "active" : "paused";
  await sub.save();
  res.json(sub);
});
