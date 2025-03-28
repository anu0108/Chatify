require("dotenv").config();
const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);
const allowedOrigins = ["https://chatify-talks.vercel.app", "http://localhost:5173"];

const io = new Server(server, {
	cors: {
	  origin: (origin, callback) => {
		if (!origin || allowedOrigins.includes(origin)) {
		  callback(null, origin);
		} else {
		  callback(new Error("CORS not allowed"));
		}
	  },
	  credentials: true,
	},
	allowEIO3: true, // Enables cross-origin WebSockets
  });

const userSocketMap = {}; // { userId: socketId }

const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId] || null;
};

io.on("connection", (socket) => {
	console.log("✅ A user connected:", socket.id);

	const userId = socket.handshake.query.userId;
	if (userId) {
		userSocketMap[userId] = socket.id;
	}

	// Send the updated list of online users
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	// Handle user disconnect
	socket.on("disconnect", () => {
		console.log("❌ User disconnected:", socket.id);
		if (userId && userSocketMap[userId]) {
			delete userSocketMap[userId];
		}
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

// Export using CommonJS
module.exports = { app, io, server, getReceiverSocketId };
