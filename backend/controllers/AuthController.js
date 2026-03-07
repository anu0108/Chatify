require("dotenv").config();
const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../logger");

const generateTokens = (userId, res) => {
    const accessToken = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

    res.cookie("accessToken", accessToken, { maxAge: 15 * 60 * 1000, httpOnly: true, sameSite: "None", secure: true });
    res.cookie("refreshToken", refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "None", secure: true });
}

module.exports.checkAuthStatus = (req, res) => {
    res.json({ user: req.user });
}

module.exports.Register = async (req, res) => {
    try {
        const { name, email, password, mobile } = req.body;

        if (!name || !email || !password || !mobile) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        const existingUser = await UserModel.findOne({
            $or: [{ email }, { mobile }] // Check both fields
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ success: false, message: "Email is already registered!" });
            } else {
                return res.status(400).json({ success: false, message: "Mobile number is already registered!" });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await UserModel.create({ name, email, password: hashedPassword, mobile });

        generateTokens(newUser._id, res);
        res.status(201).json({ success: true, message: "User Registered Successfully!" });
    } catch (error) {
        logger.error("Error in Register:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const foundUser = await UserModel.findOne({ email });
        if (!foundUser) {
            return res.status(401).json({ success: false, message: "No user exists with this email address" });
        }

        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        generateTokens(foundUser._id, res);
        res.status(200).json({ success: true, message: "Login successful", user: foundUser });
    } catch (error) {
        logger.error("Error in Login:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", });
    }
};

module.exports.Logout = (req, res) => {
      try {
          res.cookie("accessToken", "", { maxAge: 0 });
          res.cookie("refreshToken", "", { maxAge: 0 });
          res.status(200).json({ message: "Logged out successfully" });
      } catch (error) {
          logger.error("Error in logout controller", error.message);
          res.status(500).json({ error: "Internal Server Error" });
      }
  };

  module.exports.refreshAccessToken = (req, res) => {
      try {
          const token = req.cookies.refreshToken;
          if (!token) return res.status(401).json({ error: "No refresh token" });

          const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
          const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });

          res.cookie("accessToken", newAccessToken, { maxAge: 15 * 60 * 1000, httpOnly: true, sameSite: "None", secure: true });
          res.status(200).json({ success: true });
      } catch (error) {
          logger.error("Error in refreshAccessToken:", error.message);
          res.status(403).json({ error: "Invalid or expired refresh token" });
      }
  };

