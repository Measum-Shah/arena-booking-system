import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/bookings", bookingRoutes);


app.use("/api/admin", adminRoutes);
// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;