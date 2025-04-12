import { create } from "zustand";

interface Conversation {
    _id: string;
    name: string;
    email: string
}

interface Message {
    _id: string; // Ensure messages have an ID
    senderId: string;
    receiverId: string;
    message: string;
    createdAt: string; // Ensure messages have a timestamp
}

interface ConversationState {
    selectedConversation: Conversation | null;
    setSelectedConversation: (conversation: Conversation | null) => void;
    messages: Message[];
    // setMessages: (messages: Message[]) => void;
    setMessages: (messages: Message[] | ((prevMessages: Message[]) => Message[])) => void; // ✅ Ensure it allows function updates

}

const useConversation = create<ConversationState>((set) => ({
    selectedConversation: null,
    setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
    messages: [],
    setMessages: (messages) =>
        set((state) => ({
          messages: typeof messages === "function" ? messages(state.messages) : messages, // ✅ Correct handling
        })),}));

export default useConversation;