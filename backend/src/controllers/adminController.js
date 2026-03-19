import User from "../models/User.js";
import Booking from "../models/Booking.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

/* -----------------------------
   DASHBOARD APIS
------------------------------*/

// Total bookings + earnings summary
export const getDashboardSummary = async (req, res) => {
  try {
    const bookings = await Booking.find();

    const totalBookings = bookings.length;
    const totalEarnings = bookings.reduce((acc, b) => acc + b.price, 0);

    const dayBookings = bookings.filter((b) => b.period === "day").length;
    const nightBookings = bookings.filter((b) => b.period === "night").length;

    res.json({ totalBookings, totalEarnings, dayBookings, nightBookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Detailed bookings for dashboard
export const getDetailedBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: 1, startTime: 1 });

    const detailed = bookings.map((b) => ({
      id: b._id,
      slot: b.slot,
      date: b.date,
      startTime: b.startTime,
      endTime: b.endTime,
      period: b.period,
      price: b.price,
      name: b.name,
      phone: b.phone,
    }));

    res.json(detailed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Earnings for date range
export const getEarningsRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) return res.status(400).json({ message: "startDate and endDate required" });

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({ date: { $gte: start, $lte: end } });

    const totalEarnings = bookings.reduce((acc, b) => acc + b.price, 0);

    res.json({ totalEarnings, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* -----------------------------
   USER MANAGEMENT APIS
------------------------------*/

// Create new user (staff/admin)
export const createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) return res.status(400).json({ message: "All fields required" });

    // Check if username exists
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: "Username already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ username, password: hashedPassword, role });

    // Return token immediately
    const token = generateToken(user);

    res.status(201).json({ id: user._id, username: user.username, role: user.role, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// List all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide passwords
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};