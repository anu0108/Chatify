import { FaUserCircle } from "react-icons/fa";
import useConversation from "../zustand/useConversation";
import { useSocketContext } from "../context/SocketContext";

interface ConversationProps {
    user: {
        _id: string;
        name: string;
        email: string;
        createdAt: string;
    };
    lastIdx: boolean;
}

const Conversation: React.FC<ConversationProps> = ({ user, lastIdx }) => {
    const { selectedConversation, setSelectedConversation } = useConversation();

    const isSelected = user._id === selectedConversation?._id;

    const { onlineUsers } = useSocketContext();
	const isOnline = onlineUsers.includes(user._id);

    console.log("online users", onlineUsers)

    return (
        <>
            <div
                className={`flex gap-4 items-center text-gray-900 hover:bg-violet-300 cursor-pointer py-2 px-2 rounded 
                ${isSelected ? "bg-violet-600" : ""}`}
                onClick={() => 
                    {
                        setSelectedConversation(user);
                        localStorage.setItem("selectedConversation", JSON.stringify(user));
                    }}
            >
               <div className="relative">
                    <FaUserCircle className={`text-5xl ${isSelected ? "text-white" : "text-gray-600"}`} />
                    {isOnline && (
                        <span className="absolute bottom-0 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                </div>
                <div className="flex justify-between items-center w-full">
                    <div>
                        <p className={`${isSelected ? "text-white" : ""}`}>{user.name}</p>
                    </div>
                   
                </div>
            </div>
            {!lastIdx && <div className="border-t border-gray-300 " />}
        </>
    );
};

export default Conversation;
