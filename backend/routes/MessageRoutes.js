const { sendMessage, getMessages, getSuggestions } = require("../controllers/MessageController")
const { protectRoute } = require("../middlewares/protectRoute")

const router = require("express").Router()

router.get("/suggest/:id", protectRoute, getSuggestions)
router.get("/:id", protectRoute, getMessages)
router.post("/send/:id", protectRoute, sendMessage)

module.exports = router;