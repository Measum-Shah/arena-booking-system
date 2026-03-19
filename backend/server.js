import http from "http";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import app from "./src/app.js";
import { initSocket } from "./src/sockets/socketHandler.js";

dotenv.config();

// Connect DB
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});