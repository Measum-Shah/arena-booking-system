import express from "express";
import {
  createBooking,
  getAllBookings,
  getDailyEarnings,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a booking
router.post("/", protect, createBooking);

// Get all bookings
router.get("/", protect, getAllBookings);

// Get daily earnings
router.get("/earnings/:date", protect, getDailyEarnings);

export default router;