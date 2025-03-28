const { getUsersForSidebar } = require("../controllers/UserController");
const { protectRoute } = require("../middlewares/protectRoute");
const router = require("express").Router();

router.get("/", protectRoute, getUsersForSidebar);

module.exports = router;