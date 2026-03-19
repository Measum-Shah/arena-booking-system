import express from "express";
import {
  getDashboardSummary,
  getDetailedBookings,
  getEarningsRange,
  createUser,
  getAllUsers,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// DASHBOARD
router.get("/summary", protect, getDashboardSummary);
router.get("/detailed", protect, getDetailedBookings);
router.get("/earnings-range", protect, getEarningsRange);

// USER MANAGEMENT
router.post("/users", protect, createUser);
router.get("/users", protect, getAllUsers);

export default router;