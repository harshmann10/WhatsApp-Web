import { useState, useEffect, useRef } from 'react';
import { sendMessage } from '../api/messages';
import StatusIcon from './StatusIcon';
import { formatTimestamp, formatDateSeparator } from '../utils/formatTimestamp';
import { BsThreeDotsVertical, BsSearch, BsEmojiSmile, BsArrowLeft } from 'react-icons/bs';
import { MdCall } from 'react-icons/md';
import { ImAttachment } from 'react-icons/im';
import { BiSend } from 'react-icons/bi';

const ChatWindow = ({ chat, messages, setMessages, onBack }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const sentMessage = await sendMessage(chat._id, newMessage, chat.name);
            setMessages(prevMessages => [...prevMessages, sentMessage]);
            setNewMessage('');
        } catch (error) {
            console.error("Failed to send message:", error);
            // Optionally, show an error to the user
        }
    };

    let lastDate = null;

    if (!chat) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-[#222e35] text-gray-400 text-center p-4">
                <div className="max-w-md mx-auto">
                    <img src="whatsapp.svg" alt="WhatsApp Web" className="w-64 h-64 mx-auto mb-6" />
                    <h1 className="text-4xl text-gray-100 font-light mb-2">WhatsApp Web Clone</h1>
                    <p className="text-lg text-gray-300 mb-1">Select a chat to start messaging.</p>
                    <p className="text-sm text-gray-400">
                        Your messages are end-to-end encrypted.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#0b141a]">
            <header className="flex items-center justify-between p-3 bg-[#202c33] text-white">
                <div className="flex items-center">
                    <button onClick={onBack} className="md:hidden mr-2 text-white">
                        <BsArrowLeft size={22} />
                    </button>
                    <img className="w-10 h-10 rounded-full mr-4" src={`https://placehold.co/100x100/7d8a94/FFF?text=${chat.name.charAt(0)}`} alt="User Avatar" />
                    <div>
                        <h2 className="font-semibold">{chat.name}</h2>
                        <p className="text-sm text-gray-400">{chat._id}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-6 text-gray-400 pr-2">
                    <MdCall size={24} className="cursor-pointer hover:text-white" />
                    <BsSearch size={20} className="cursor-pointer hover:text-white" />
                    <BsThreeDotsVertical size={20} className="cursor-pointer hover:text-white" />
                </div>
            </header>

            <main className="flex-1 p-6 overflow-y-auto" style={{ backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')` }}>
                {messages.map((msg) => {
                    const currentDate = new Date(msg.timestamp).toDateString();
                    const showDateSeparator = currentDate !== lastDate;
                    if (showDateSeparator) {
                        lastDate = currentDate;
                    }

                    return (
                        <div key={msg._id || msg.message_id}>
                            {showDateSeparator && (
                                <div className="flex justify-center my-4">
                                    <span className="bg-[#182229] text-gray-400 text-xs font-semibold px-3 py-1 rounded-lg shadow">
                                        {formatDateSeparator(msg.timestamp)}
                                    </span>
                                </div>
                            )}
                            <div className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`rounded-lg px-3 py-2 max-w-md mb-2 text-white ${msg.direction === 'outbound' ? 'message-out bg-[#005c4b]' : 'message-in bg-[#202c33]'}`}>
                                    <p className="break-words">{msg.content}</p>
                                    <div className="flex items-center justify-end mt-1">
                                        <p className="text-xs text-gray-300/60 mr-2">{formatTimestamp(msg.timestamp)}</p>
                                        {msg.direction === 'outbound' && <StatusIcon status={msg.status} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </main>

            <footer className="p-3 bg-[#202c33]">
                <form onSubmit={handleSendMessage} className="flex items-center">
                    <BsEmojiSmile size={24} className="text-gray-400 cursor-pointer hover:text-white" />
                    <ImAttachment size={22} className="text-gray-400 mx-4 cursor-pointer hover:text-white" />
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message"
                        className="flex-1 bg-[#2a3942] rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
                    />
                    <button type="submit" className="ml-3 text-gray-400 hover:text-white disabled:text-gray-600" disabled={!newMessage.trim()}>
                        <BiSend size={24} />
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default ChatWindow;
