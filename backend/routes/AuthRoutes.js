const { Register, Login, checkAuthStatus, Logout } = require("../controllers/AuthController");
const { protectRoute } = require("../middlewares/protectRoute");

const router = require("express").Router()

router.get("/me", protectRoute, checkAuthStatus)
router.post("/register", Register);
router.post("/login", Login)
router.post("/logout", Logout)

module.exports = router;