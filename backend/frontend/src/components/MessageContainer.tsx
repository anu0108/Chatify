import { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import Avatar from "../assets/joseph-gonzalez-iFgRcqHznqg-unsplash.jpg"
import { TiMessages } from "react-icons/ti";
import useConversation from "../zustand/useConversation.ts";
import { useAuthContext } from "../context/AuthContext.tsx";
import useSendMessage from "../hooks/useSendMessage.ts"
import useGetMessages from "../hooks/useGetMessages.ts";
import Message from "./Message.tsx";
import useListenMessages from "../hooks/useListenMessages.ts";
import moment from "moment";

const MessageContainer = () => {
    const [message, setMessage] = useState<string>("");
    const { selectedConversation, setSelectedConversation } = useConversation();

    const { sendMessage } = useSendMessage();

    const { messages } = useGetMessages();
    useListenMessages();

    const messagesEndRef = useRef<HTMLDivElement>(null);

    
    useEffect(() => {
        const storedConversation = localStorage.getItem("selectedConversation");
        if (storedConversation) {
            setSelectedConversation(JSON.parse(storedConversation));
        }
    }, []);
    



    useEffect(() => {
        return () => {
            setSelectedConversation(null)
        }
    }, [])

    useEffect(() => {
        // Scroll to the bottom when messages change
        if(messagesEndRef.current)
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!message) return;

        await sendMessage(message);
        setMessage("")
    }

    const groupMessagesByDate = () => {
        const groupedMessages: { [key: string]: any } = {};

        messages.forEach((msg) => {
            const messageDate = moment(msg.createdAt).startOf("day");
            const today = moment().startOf("day");
            const yesterday = moment().subtract(1, "day").startOf("day");

            let dateLabel;
            if (messageDate.isSame(today)) {
                dateLabel = "Today";
            } else if (messageDate.isSame(yesterday)) {
                dateLabel = "Yesterday";
            } else {
                dateLabel = messageDate.format("dddd, MMM D"); // Example: "Monday, Aug 12"
            }

            if (!groupedMessages[dateLabel]) {
                groupedMessages[dateLabel] = [];
            }
            groupedMessages[dateLabel].push(msg);
        });

        return groupedMessages;
    };

    const groupedMessages = groupMessagesByDate();

    console.log("groupedMe", groupedMessages)


    return (
        <div className="w-2/3 flex flex-col justify-between">
            {!selectedConversation ? <NoChatSelected /> :
                <>
                    <div className="my-2 mx-2 flex gap-2">
                        <img src={Avatar} alt="" className="w-10 h-10 object-cover rounded-full" />
                        <div>
                            <p className="text-gray-900 text-sm">{selectedConversation.name}</p>
                            <p className="text-gray-900 text-xs">Last Seen : Today</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="bg-white border-t border-gray-200 h-full p-4 overflow-y-auto inline-grid flex-col-reverse">
                        <div className="flex flex-col justify-end h-full">
                        {Object.entries(groupedMessages).map(([date, messages]) => (
                            <div key={date}>
                                <div className="text-center text-gray-500 text-xs my-2">{date}</div>
                                {messages.map((msg : any) => (
                                    <Message key={msg._id} message={msg} />
                                ))}
                            </div>
                        ))}
                        </div>
                        <div ref={messagesEndRef} />
                    </div>



                    {/* Chat Input Box */}
                    <form className="h-16 bg-white flex items-center px-2 relative" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="bg-gray-200 text-sm w-full p-3 rounded-lg outline-none"
                            placeholder="Type your message..."
                            
                        />
                        <button
                            className="ml-2 text-blue-500 text-lg" type="submit"
                        >
                            <IoSend />
                        </button>
                    </form>
                </>
            }
        </div>
    )
}

const NoChatSelected = () => {
    const { authUser } = useAuthContext();

    return (
        <div className='flex items-center justify-center w-full h-full'>
            <div className='px-4 text-center sm:text-lg md:text-xl text-black font-semibold flex flex-col items-center gap-2'>
                <p>Welcome 👋 {authUser?.name} ❄</p>
                <p>Select a chat to start messaging</p>
                <TiMessages className='text-3xl md:text-6xl text-center' />
            </div>
        </div>
    );
};
export default MessageContainer