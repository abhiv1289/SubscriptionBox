import "dotenv/config";
import { connectDB } from "./config/db.js";
import { Box } from "./models/Box.js";
import { User } from "./models/User.js";
import bcrypt from "bcryptjs";

await connectDB(process.env.MONGO_URI);

await Box.deleteMany({});
await User.deleteMany({});

const boxes = [
  {
    title: "Snack Lovers Box",
    description: "Curated international snacks",
    priceMonthlyUSD: 19.99,
    items: ["Chips", "Cookies", "Candy"],
  },
  {
    title: "Beauty Starter Box",
    description: "Sample beauty products",
    priceMonthlyUSD: 24.99,
    items: ["Serum", "Mask", "Moisturizer"],
  },
];

await Box.insertMany(boxes);

const adminPass = await bcrypt.hash("adminpass", 10);
await User.create({
  name: "Admin",
  email: "admin@example.com",
  password: adminPass,
  isAdmin: true,
});

console.log("✅ Seeded admin + boxes");
process.exit(0);
