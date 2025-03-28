require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
// const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/AuthRoutes");
const messageRoutes = require("./routes/MessageRoutes");
const userRoutes = require("./routes/UserRoutes");

const { app, server } = require("./socket/Socket");

const allowCors = (req, res, next) => {

    res.setHeader("Access-Control-Allow-Origin", "https://chatify-talks.vercel.app"); // Default


    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(200); // ✅ Handles preflight requests
    }

    next(); // ✅ Continue to the next middleware
};

// ✅ Apply CORS Middleware
app.use(allowCors);

// app.use(cors({ origin: ['https://chatify-talks.vercel.app','http://localhost:5173'], credentials: true }));
app.use(express.json());

app.use(cookieParser());

app.get("/", (req, res) => {
    console.log(req.headers)
    res.status(200).json({ message: "Server is up and running!" + `${req.headers.host}` });
});


app.use("/auth", authRoutes);
app.use("/message", messageRoutes)
app.use("/users", userRoutes)
mongoose.connect(process.env.MONGO_DB_URI)

server.listen(8080, () => {
    console.log('Server running on PORT 8080');
})