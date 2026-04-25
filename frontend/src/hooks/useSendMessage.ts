import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";

let msgCount = 0;

const useSendMessage = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();

    const sendMessage = async (message:any) => {
        setLoading(true);
        try {
            const start = performance.now();
            const sentAt = Date.now();
            const res = await axiosInstance.post(`/message/send/${selectedConversation?._id}`,{message, sentAt}, {withCredentials:true});
            const latency = Math.round(performance.now() - start);
            console.log(`[round-trip] message ${++msgCount}: ${latency}ms`);
            const data = res.data;
            if (data.error) throw new Error(data.error);

            setMessages([...messages, data]);
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An unexpected error occurred");
            }
        }
         finally {
            setLoading(false);
        }
    };

    return { sendMessage, loading };
};
export default useSendMessage;