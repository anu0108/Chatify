import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

const playNotificationSound = () => {
    try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 440;
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    } catch {
        // AudioContext not available
    }
};

const useListenMessages = () => {
    const { socket } = useSocketContext();
    const { setMessages, selectedConversation, users, incrementUnread } = useConversation();

    useEffect(() => {
        const handleNewMessage = (newMessage: any) => {
            newMessage.shouldShake = true;

            const isFromActiveConversation = newMessage.senderId === selectedConversation?._id;

            if (isFromActiveConversation) {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            } else {
                playNotificationSound();
                const sender = users.find((u) => u._id === newMessage.senderId);
                toast(`${sender?.name ?? "Someone"}: ${newMessage.message}`, {
                    icon: "💬",
                    duration: 4000,
                });
                incrementUnread(newMessage.senderId);
            }
        };

        socket?.on("newMessage", handleNewMessage);

        return () => {
            socket?.off("newMessage", handleNewMessage);
        };
    }, [socket, setMessages, selectedConversation, users, incrementUnread]);
};

export default useListenMessages;
