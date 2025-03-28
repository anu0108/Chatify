import { useEffect, useRef, useState } from 'react'
import { IoSearchSharp } from 'react-icons/io5';
import UserLoggedIn from "../assets/Anurag.png"
import { CiMenuKebab } from 'react-icons/ci';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import axios from 'axios';
import Conversation from './Conversation';

const Sidebar = () => {
    const [search, setSearch] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [conversations, setConversations] = useState<User[]>([]);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const { authUser, setAuthUser } = useAuthContext();
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    interface User {
        _id: string;
        name: string;
        email: string;
    }

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get<User[]>(`${backendUrl}/users`, { withCredentials: true });
                setConversations(res.data);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };

        getConversations();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredConversations = conversations.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleLogout = async () => {
        try {
            await axios.post(`${backendUrl}/auth/logout`, {}, { withCredentials: true });
            setAuthUser(null);
            navigate("/login");
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <div className="bg-gray-100 h-full w-1/3 rounded py-2 px-4">
            <div className="flex items-center w-full justify-between">
                <div className="flex gap-4 items-center mt-1">
                    <img src={UserLoggedIn} alt="" className="w-12 h-12 object-cover rounded-full cursor-pointer"
                        onClick={() => setIsDropdownOpen((prev) => !prev)}
                    />
                </div>
                <div className=" flex gap-4 items-center">
                    <CiMenuKebab className="text-black text-xl font-bold cursor-pointer hover:text-gray-300" />
                </div>
            </div>

            {isDropdownOpen && (
                <div ref={dropdownRef} className="absolute left-[70px] top-5 z-10 w-48 bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="p-3 border-b">
                        <p className="text-gray-900 font-semibold text-sm">{authUser?.name || "User"}</p>
                        <p className="text-gray-500 text-xs">{authUser?.email || "email@example.com"}</p>
                    </div>
                    <ul className="text-gray-700">
                        <li>
                            <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                                Settings
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 hover:bg-red-100 text-sm text-red-500"
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            )}

            <div className="relative mt-4">
                <IoSearchSharp className=" absolute top-3 left-3 text-gray-800 text-xl cursor-pointer hover:text-gray-300" />
                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border-gray-200 border bg-white p-2 pl-10 rounded outline-none"
                />
            </div>
            <div className="mt-6 text-white flex-col">
                {filteredConversations.length > 0 ? (
                    filteredConversations.map((user, idx) => (
                        <Conversation key={user._id} user={user} lastIdx={idx==filteredConversations.length - 1}/>
                    ))
                ) : (
                    <p className="text-center text-white mt-5">No conversations found.</p>
                )}
            </div>
        </div>
    )
}

export default Sidebar