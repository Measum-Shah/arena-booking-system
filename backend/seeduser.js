import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./src/models/User.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  await connectDB();

  const users = [
    {
      username: "admin1",
      password: await bcrypt.hash("admin123", 10),
      role: "admin",
    },
    {
      username: "staff1",
      password: await bcrypt.hash("staff123", 10),
      role: "staff",
    },
  ];

  // Remove existing users if any
  await User.deleteMany();
  await User.insertMany(users);

  console.log("✅ Users seeded");
  process.exit();
};

seedUsers();