import { useState, useEffect } from 'react';
import { fetchChats as getConversations } from '../api/messages';
import { formatTimestamp } from '../utils/formatTimestamp';
import StatusIcon from './StatusIcon';
import { FaSearch, FaPlus } from 'react-icons/fa';

const ChatList = ({ onSelectChat, activeChatId }) => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        getConversations()
            .then(data => {
                setChats(data);
            })
            .catch(err => {
                setError("Failed to load chats.");
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-4 text-gray-400">Loading chats...</div>;
    if (error) return <div className="p-4 text-red-400">{error}</div>;

    return (
        <div className="bg-[#111b21] h-full flex flex-col relative">
            <div className="p-2 border-b border-gray-700 relative">
                <input
                    type="text"
                    placeholder="Search or start new chat"
                    className="w-full bg-[#202c33] rounded-2xl px-4 py-1.5 text-sm text-white placeholder-gray-400 focus:outline-none pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaSearch className="w-4 h-4 text-gray-400" />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {filteredChats.map(chat => (
                    <div
                        key={chat._id}
                        onClick={() => onSelectChat(chat)}
                        className={`flex items-center p-3 cursor-pointer border-b border-gray-700 hover:bg-[#2a3942] ${activeChatId === chat._id ? 'bg-[#2a3942]' : ''}
                        transition-colors duration-150 ease-in-out`}
                    >
                        <img className="w-12 h-12 rounded-full mr-4" src={`https://placehold.co/100x100/7d8a94/FFF?text=${chat.name.charAt(0)}`} alt="User Avatar" />
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                                <p className="text-white font-semibold truncate">{chat.name}</p>
                                <p className="text-xs text-gray-400">{formatTimestamp(chat.lastMessageTime)}</p>
                            </div>
                            <div className="flex items-center text-gray-400 text-sm">
                                {chat.lastMessageDirection === 'outbound' && (
                                    <div className="mr-1">
                                        <StatusIcon status={chat.lastStatus} />
                                    </div>
                                )}
                                <p className="truncate">{chat.lastMessage}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* New Chat Button */}
            <button
                className="absolute bottom-4 right-4 bg-[#25d366] text-white p-4 rounded-full shadow-lg hover:bg-[#1da851] focus:outline-none focus:ring-2 focus:ring-[#25d366] focus:ring-opacity-50"
                aria-label="Start new chat"
            >
                <FaPlus className="w-4 h-4" />
            </button>
        </div>
    );
};

export default ChatList;
