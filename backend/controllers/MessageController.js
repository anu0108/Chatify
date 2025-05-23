const ConversationModel = require("../models/Conversation")
const MessageModel = require("../models/Message");
const { getReceiverSocketId, io } = require("../socket/Socket");

module.exports.sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
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
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

        res.status(201).json(newMessage);
    } catch (err) {
        console.log("Error in sendMessage Controller", err.message);
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
        console.log("Error ib getMessage Controller", err.message);
        res.status(500).json({error: "INTERNAL SERVER ERROR"})
    }
}