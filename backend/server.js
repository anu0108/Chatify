require("dotenv").config();
const path = require("path")
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/AuthRoutes");
const messageRoutes = require("./routes/MessageRoutes");
const userRoutes = require("./routes/UserRoutes");

const { app, server } = require("./socket/Socket");

// app.use(cors({
//     origin: "https://chatify-talks.vercel.app", credentials: true, allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
// })); // Adjust for frontend origin
// // app.options("*", cors()); 

// app.use((req, res, next) => {
//     if (req.method === "OPTIONS") {
//         res.header("Access-Control-Allow-Origin", "https://chatify-talks.vercel.app");
//         res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//         res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//         res.header("Access-Control-Allow-Credentials", "true");
//         return res.status(204).send(); // No content for OPTIONS requests
//     }
//     next();
// });



app.use(express.json());

app.use(cookieParser());

// app.get("/", (req, res) => {
//     res.status(200).json({ message: "Server is up and running!" });
// });


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