import { create } from "zustand";

interface Conversation {
    _id: string;
    name: string;
    email: string
    createdAt: string
}

interface Message {
    _id: string;
    senderId: string;
    receiverId: string;
    message: string;
    createdAt: string;
}

interface ConversationState {
    selectedConversation: Conversation | null;
    setSelectedConversation: (conversation: Conversation | null) => void;
    messages: Message[];
    setMessages: (messages: Message[] | ((prevMessages: Message[]) => Message[])) => void;
    isTyping: boolean;
    setIsTyping: (val: boolean) => void;
    unreadCounts: Record<string, number>;
    incrementUnread: (userId: string) => void;
    clearUnread: (userId: string) => void;
    users: Conversation[];
    setUsers: (users: Conversation[]) => void;
}

const useConversation = create<ConversationState>((set) => ({
    selectedConversation: null,
    setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
    messages: [],
    setMessages: (messages) =>
        set((state) => ({
            messages: typeof messages === "function" ? messages(state.messages) : messages,
        })),
    isTyping: false,
    setIsTyping: (val) => set({ isTyping: val }),
    unreadCounts: {},
    incrementUnread: (userId) =>
        set((state) => ({
            unreadCounts: {
                ...state.unreadCounts,
                [userId]: (state.unreadCounts[userId] || 0) + 1,
            },
        })),
    clearUnread: (userId) =>
        set((state) => ({
            unreadCounts: { ...state.unreadCounts, [userId]: 0 },
        })),
    users: [],
    setUsers: (users) => set({ users }),
}));

export default useConversation;
