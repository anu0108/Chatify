require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/AuthRoutes");
const messageRoutes = require("./routes/MessageRoutes");
const userRoutes = require("./routes/UserRoutes");

const { app, server } = require("./socket/Socket");

app.use(express.json());

const allowedOrigins = ["https://chatify-talks.vercel.app", "http://localhost:5173"];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(204);
});

app.get("/debug", (req, res) => {
    res.status(200).json({ status: "✅ API is running on Vercel!" });
});



app.use("/auth", authRoutes);
app.use("/message", messageRoutes)
app.use("/users", userRoutes)
mongoose.connect(process.env.MONGO_DB_URI)

server.listen(8080, () => {
    console.log('Server running on PORT 8080');
})