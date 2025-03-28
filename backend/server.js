require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
// const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/AuthRoutes");
const messageRoutes = require("./routes/MessageRoutes");
const userRoutes = require("./routes/UserRoutes");

const { app, server } = require("./socket/Socket");


app.use(cors({ origin: "https://chatify-talks.vercel.app", credentials: true }));
app.use(express.json());

app.use(cookieParser());

app.get("/", (req, res) => {
    console.log(req.headers)
    res.status(200).json({ message: "Server is up and running!" });
});


app.use("/auth", authRoutes);
app.use("/message", messageRoutes)
app.use("/users", userRoutes)
mongoose.connect(process.env.MONGO_DB_URI)

server.listen(8080, () => {
    console.log('Server running on PORT 8080');
})