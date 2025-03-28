import { useAuthContext } from "../context/AuthContext";
import { extractTime } from "../utils/extractTime";
import useConversation from "../zustand/useConversation";
import MyImage from "../assets/Anurag.png"
import { BiUser } from "react-icons/bi";
import { FaRegUserCircle } from "react-icons/fa";
interface MessageType {
    _id: string;
    senderId: string;
    message: string;
    createdAt: string;
    shouldShake?: boolean;
}

interface MessageProps {
    message: MessageType;
}

const Message = ({ message }: MessageProps) => {
    const { authUser } = useAuthContext();
    const { selectedConversation } = useConversation();

    const fromMe = message.senderId === authUser?._id;
    const formattedTime = extractTime(message.createdAt);

    return (
        <div className={`flex ${fromMe ? "justify-end" : "justify-start"} my-2`}>
        <div className="flex flex-col max-w-xs md:max-w-sm lg:max-w-md">
            <div className={`py-2 px-3 rounded-lg ${fromMe ? "bg-violet-600 text-white" : "bg-gray-300 text-black"} shadow-md`}>
                <p>{message.message}</p>
            </div>
            <span className={`text-[10px] ${fromMe ? "text-gray-600 text-right" : "text-gray-600 text-left px-1.5"}  mt-1`}>
                {formattedTime}
            </span>
        </div>
    </div>

    );
};

export default Message;
