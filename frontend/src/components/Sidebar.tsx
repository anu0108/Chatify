import { useEffect, useRef, useState } from 'react'
import { IoSearchSharp } from 'react-icons/io5';
import UserLoggedIn from "../assets/Anurag.png"
import { CiMenuKebab } from 'react-icons/ci';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import axios from 'axios';
import Conversation from './Conversation';
import { LogOut, Settings, User, Users, Bell } from 'lucide-react';

interface User {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
}

const Sidebar = () => {
    const [search, setSearch] = useState("");
    const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
    const [isKebabDropdownOpen, setIsKebabDropdownOpen] = useState(false);
    const [conversations, setConversations] = useState<User[]>([]);
    const avatarDropdownRef = useRef<HTMLDivElement | null>(null);
    const kebabDropdownRef = useRef<HTMLDivElement | null>(null);
    const { authUser, setAuthUser } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get<User[]>(`/users`, { withCredentials: true });
                setConversations(res.data);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };
        getConversations();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (avatarDropdownRef.current && !avatarDropdownRef.current.contains(event.target as Node)) {
                setIsAvatarDropdownOpen(false);
            }
            if (kebabDropdownRef.current && !kebabDropdownRef.current.contains(event.target as Node)) {
                setIsKebabDropdownOpen(false);
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
            await axios.post(`/auth/logout`, {}, { withCredentials: true });
            setAuthUser(null);
            navigate("/login");
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    const getInitials = (name: string) =>
        name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

    return (
        <div className="bg-gray-100 h-full w-1/3 rounded py-2 px-4">

            {/* Top bar */}
            <div className="flex items-center w-full justify-between mt-1">

                {/* Avatar + dropdown */}
                <div className="relative" ref={avatarDropdownRef}>
                    <img
                        src={UserLoggedIn}
                        alt="avatar"
                        className="w-11 h-11 object-cover rounded-full cursor-pointer ring-2 ring-blue-400 hover:ring-blue-600 transition-all"
                        onClick={() => {
                            setIsAvatarDropdownOpen((prev) => !prev);
                            setIsKebabDropdownOpen(false);
                        }}
                    />

                    {isAvatarDropdownOpen && (
                        <div className="absolute left-0 top-14 z-20 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                    {getInitials(authUser?.name || "")}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-gray-900 font-semibold text-sm truncate">{authUser?.name || "User"}</p>
                                    <p className="text-gray-400 text-xs truncate">{authUser?.email || "email@example.com"}</p>
                                </div>
                            </div>

                            {/* Links */}
                            <div className="py-1">
                                <Link
                                    to="/profile"
                                    onClick={() => setIsAvatarDropdownOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition-colors"
                                >
                                    <User size={15} className="text-gray-400" />
                                    My Profile
                                </Link>
                                <Link
                                    to="/settings"
                                    onClick={() => setIsAvatarDropdownOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition-colors"
                                >
                                    <Settings size={15} className="text-gray-400" />
                                    Settings
                                </Link>
                            </div>

                            <div className="border-t border-gray-100 py-1">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-red-50 text-sm text-red-500 transition-colors"
                                >
                                    <LogOut size={15} />
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Kebab + dropdown */}
                <div className="relative" ref={kebabDropdownRef}>
                    <button
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                        onClick={() => {
                            setIsKebabDropdownOpen((prev) => !prev);
                            setIsAvatarDropdownOpen(false);
                        }}
                    >
                        <CiMenuKebab className="text-gray-600 text-xl" />
                    </button>

                    {isKebabDropdownOpen && (
                        <div className="absolute right-0 top-11 z-20 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="py-1">
                                <Link
                                    to="/new-group"
                                    onClick={() => setIsKebabDropdownOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition-colors"
                                >
                                    <Users size={15} className="text-gray-400" />
                                    New Group
                                </Link>
                                <button
                                    onClick={() => setIsKebabDropdownOpen(false)}
                                    className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition-colors"
                                >
                                    <Bell size={15} className="text-gray-400" />
                                    Notifications
                                </button>
                                
                                <div className="border-t border-gray-100 mt-1 pt-1">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-red-50 text-sm text-red-500 transition-colors"
                                    >
                                        <LogOut size={15} />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Search */}
            <div className="relative mt-4">
                <IoSearchSharp className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400 text-lg" />
                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border border-gray-200 bg-white py-2 pl-10 pr-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 transition-all text-sm"
                />
            </div>

            {/* Conversations */}
            <div className="mt-6 text-white flex-col">
                {filteredConversations.length > 0 ? (
                    filteredConversations.map((user, idx) => (
                        <Conversation key={user._id} user={user} lastIdx={idx === filteredConversations.length - 1} />
                    ))
                ) : (
                    <p className="text-center text-gray-400 mt-5 text-sm">No conversations found.</p>
                )}
            </div>
        </div>
    );
};

export default Sidebar;