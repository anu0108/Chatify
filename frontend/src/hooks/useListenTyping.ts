import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

const useListenTyping = () => {
    const { socket } = useSocketContext();
    const { selectedConversation, setIsTyping } = useConversation();

    useEffect(() => {
        socket?.on("typing", ({ senderId }: { senderId: string }) => {
            if (senderId === selectedConversation?._id) setIsTyping(true);
        });
        socket?.on("stopTyping", ({ senderId }: { senderId: string }) => {
            if (senderId === selectedConversation?._id) setIsTyping(false);
        });
        return () => {
            socket?.off("typing");
            socket?.off("stopTyping");
        };
    }, [socket, selectedConversation]);
};

export default useListenTyping;
