import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
// import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { setMessages } = useConversation();

	useEffect(() => {
		const handleNewMessage = (newMessage: any) => {
			newMessage.shouldShake = true;
			// const sound = new Audio(notificationSound);
			// sound.play();

			// Ensure prevMessages is correctly typed
			setMessages((prevMessages) => [...prevMessages, newMessage]); // ✅ Now this works
		};

		socket?.on("newMessage", handleNewMessage);

		return () => {
			socket?.off("newMessage", handleNewMessage);
		};
	}, [socket, setMessages]);
};

export default useListenMessages;
