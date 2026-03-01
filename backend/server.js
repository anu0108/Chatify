require("dotenv").config();
const path = require("path")
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/AuthRoutes");
const messageRoutes = require("./routes/MessageRoutes");
const userRoutes = require("./routes/UserRoutes");

const { app, server } = require("./socket/Socket");

app.use(express.json());

app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/message", messageRoutes)
app.use("/users", userRoutes)


app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

mongoose.connect(process.env.MONGO_DB_URI)

server.listen(8080, () => {
    console.log('Server running on PORT 8080');
})