import { Server } from "socket.io";

let io;

/**
 * Initialize Socket.IO
 * @param {import('http').Server} server - HTTP server instance
 */
export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // allow all origins (change in production)
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    // Example: listen for a custom event
    socket.on("ping", (msg) => {
      console.log("Ping received:", msg);
      socket.emit("pong", "pong response");
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
};

/**
 * Get io instance in other files
 */
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};