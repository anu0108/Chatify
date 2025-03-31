import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import axios from "axios";

const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();
	const backendUrl = import.meta.env.VITE_BACKEND_URL;

	useEffect(() => {
		const getMessages = async () => {
			setLoading(true);
			try {
				const res = await axios.get(`${backendUrl}/message/${selectedConversation?._id}`, {
					headers: {
						"x-vercel-protection-bypass": import.meta.env.VITE_VERCEL_AUTOMATION_BYPASS_SECRET,
						"Content-Type": "application/json",
					},
					withCredentials: true
				});
				const data = res.data;
				if (data.error) throw new Error(data.error);
				setMessages(data);
			} catch (error) {
				if (error instanceof Error) {
					toast.error(error.message);
				} else {
					toast.error("An unexpected error occurred");
				}
			} finally {
				setLoading(false);
			}
		};

		if (selectedConversation?._id) getMessages();
	}, [selectedConversation?._id, setMessages]);

	return { messages, loading };
};
export default useGetMessages;