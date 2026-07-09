import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import useConversation from "../zustand/useConversation";
import { useAuthContext } from "../context/AuthContext";

const useSmartReplies = () => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const { messages, selectedConversation } = useConversation();
    const { authUser } = useAuthContext();

    useEffect(() => {
        setSuggestions([]);

        if (!selectedConversation || messages.length === 0) return;

        const lastMessage = messages[messages.length - 1];
        // Only suggest when the last message is from the other person
        if (lastMessage.senderId === authUser?._id) return;

        let cancelled = false;

        const fetchSuggestions = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get<{ suggestions: string[] }>(
                    `/message/suggest/${selectedConversation._id}`,
                    { withCredentials: true }
                );
                if (!cancelled) setSuggestions(res.data.suggestions ?? []);
            } catch {
                // silently fail — suggestions are non-critical
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchSuggestions();

        return () => {
            cancelled = true;
        };
    }, [messages, selectedConversation, authUser?._id]);

    const clearSuggestions = () => setSuggestions([]);

    return { suggestions, loading, clearSuggestions };
};

export default useSmartReplies;
