const ConversationModel = require("../models/Conversation")
const MessageModel = require("../models/Message");
const { getReceiverSocketId, io } = require("../socket/Socket");
const logger = require("../logger");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

module.exports.sendMessage = async (req, res) => {
    try {
        const { message, sentAt } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let conversation = await ConversationModel.findOne({
            participants: { $all: [senderId, receiverId] }
        })

        if (!conversation) {
            conversation = await ConversationModel.create({
                participants: [senderId, receiverId]
            })
        }

        const newMessage = new MessageModel({ senderId, receiverId, message })

        if (newMessage) {
            conversation.messages.push(newMessage._id)
        }


        await Promise.all([conversation.save(), newMessage.save()])

        //SOCKET IO FUNCTIONALITY
        const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			// io.to(<socket_id>).emit() used to send events to specific client
			io.to(receiverSocketId).emit("newMessage", { ...newMessage.toObject(), sentAt });
		}

        res.status(201).json(newMessage);
    } catch (err) {
        logger.error("Error in sendMessage Controller", err.message);
        res.status(500).json({ error: "INTERNAL SERVER ERROR" })
    }
}

module.exports.getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await ConversationModel.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages");

		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

		res.status(200).json(messages);
    } catch (err) {
        logger.error("Error in getMessage Controller", err.message);
        res.status(500).json({error: "INTERNAL SERVER ERROR"})
    }
}

module.exports.getSuggestions = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const conversation = await ConversationModel.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate({ path: "messages", options: { sort: { createdAt: -1 }, limit: 8 } });

        if (!conversation || conversation.messages.length === 0) {
            return res.status(200).json({ suggestions: [] });
        }

        const recentMessages = [...conversation.messages].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        const conversationText = recentMessages
            .map((msg) => {
                const role = msg.senderId.toString() === senderId.toString() ? "Me" : "Them";
                return `${role}: ${msg.message}`;
            })
            .join("\n");

        const prompt = `You are a smart reply assistant for a chat app. Based on this conversation, suggest exactly 3 short, natural reply options the user ("Me") could send next. Each reply must be under 10 words. Return ONLY a valid JSON array of 3 strings, no explanation.\n\nConversation:\n${conversationText}`;

        const result = await geminiModel.generateContent(prompt);
        const raw = result.response.text().trim().replace(/```json|```/g, "");
        const suggestions = JSON.parse(raw);

        res.status(200).json({ suggestions });
    } catch (err) {
        logger.error(`Error in getSuggestions Controller: ${err.message}`);
        res.status(500).json({ error: "INTERNAL SERVER ERROR" });
    }
};