import Booking from "../models/Booking.js";
import { getIO } from "../sockets/socketHandler.js";

// Price constants
const PRICE_DAY = 1500;
const PRICE_NIGHT = 2500;

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (admin/staff)
export const createBooking = async (req, res) => {
  try {
    const { slot, date, startTime, endTime, name, phone } = req.body;

    if (!slot || !date || startTime == null || endTime == null || !name || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Convert date to midnight for consistency
    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    // Determine period (day or night)
    const period = startTime >= 7 && endTime <= 18 ? "day" : "night";
    const price = period === "day" ? PRICE_DAY : PRICE_NIGHT;

    // 🔥 Conflict check: same slot, same date, overlapping time
    const conflict = await Booking.findOne({
      slot,
      date: bookingDate,
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } },
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } },
      ],
    });

    if (conflict) {
      return res.status(400).json({ message: "Slot already booked for this time" });
    }

    // Create booking
    const booking = await Booking.create({
      slot,
      date: bookingDate,
      startTime,
      endTime,
      period,
      name,
      phone,
      price,
    });

    // Emit real-time notification via Socket.IO
    getIO().emit("bookingCreated", booking);

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all bookings (admin dashboard)
// @route   GET /api/bookings
// @access  Private (admin/staff)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: 1, startTime: 1 });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get daily earnings
// @route   GET /api/bookings/earnings/:date
// @access  Private
export const getDailyEarnings = async (req, res) => {
  try {
    const dateParam = new Date(req.params.date);
    dateParam.setHours(0, 0, 0, 0);

    const bookings = await Booking.find({ date: dateParam });

    const totalEarnings = bookings.reduce((acc, b) => acc + b.price, 0);

    res.json({ date: dateParam, totalEarnings, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};