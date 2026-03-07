const UserModel = require("../models/User")
const jwt = require("jsonwebtoken");
const logger = require("../logger");

require("dotenv").config()

module.exports.protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.accessToken;

		if (!token) {
			return res.status(401).json({ error: "Unauthorized - No Token Provided" });
		}

		const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		}

		const user = await UserModel.findById(decoded.id).select("-password");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		req.user = user;

		next();
	} catch (error) {
      if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
          return res.status(401).json({ error: "Unauthorized - Token expired or invalid" });
      }
      logger.error("Error in protectRoute middleware: ", error.message);
      res.status(500).json({ error: "Internal server error" });
  }
};