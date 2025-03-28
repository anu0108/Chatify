import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import axios from "axios";



const useSendMessage = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const sendMessage = async (message:any) => {
        setLoading(true);
        try {
            const res = await axios.post(`${backendUrl}/message/send/${selectedConversation?._id}`,{message}, {withCredentials:true});
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