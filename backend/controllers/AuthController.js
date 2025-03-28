require("dotenv").config();
const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.checkAuthStatus = (req,res) => {
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

        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "3d" }
        );

        res.cookie("jwt", token, {
            maxAge: 15 * 24 * 60 * 60 * 1000, // MS
            httpOnly: true, // prevent XSS attacks cross-site scripting attacks
            sameSite: "strict", // CSRF attacks cross-site request forgery attacks
            secure: true,
        });

        res.status(201).json({ success: true, message: "User Registered Successfully!" });
    } catch (error) {
        console.error("Error in Register:", error);
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

        const token = jwt.sign(
            { id: foundUser._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "3d" }
        );

        res.cookie("jwt", token, {
            maxAge: 15 * 24 * 60 * 60 * 1000, // MS
            httpOnly: true, // prevent XSS attacks cross-site scripting attacks
            sameSite: "strict", // CSRF attacks cross-site request forgery attacks
            secure: true,
        });

        res.status(200).json({ success: true, message: "Login successful", user:foundUser });
    } catch (error) {
        console.error("Error in Login:", error);
        res.status(500).json({ success: false, message: "Internal Server Error",  });
    }
};

module.exports.Logout = (req, res) => {
    try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
}
