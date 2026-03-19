import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    slot: {
      type: String,
      enum: ["A", "B"],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: Number, // e.g., 9 for 9AM, 21 for 9PM
      required: true,
    },
    endTime: {
      type: Number, // e.g., 10 for 10AM, 23 for 11PM
      required: true,
    },
    period: {
      type: String,
      enum: ["day", "night"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// 🔹 Index for fast conflict checking
bookingSchema.index({ slot: 1, date: 1, startTime: 1, endTime: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;