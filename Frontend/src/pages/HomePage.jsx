import { useState, useEffect, useRef } from 'react';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import { fetchMessages as getMessagesForChat } from '../api/messages';

const HomePage = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!activeChat) return;

    setLoadingMessages(true);
    getMessagesForChat(activeChat._id)
      .then(data => {
        setMessages(data);
      })
      .catch(error => {
        console.error("Error fetching messages:", error);
      })
      .finally(() => {
        setLoadingMessages(false);
      });
  }, [activeChat]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-screen font-sans bg-[#0c1317] text-sm overflow-hidden">
      {/* Sidebar */}
      <div className={`w-full md:w-1/3 lg:w-1/3 border-r border-gray-700 flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <header className="flex items-center justify-between p-3 bg-[#202c33]">
          <div className="flex items-center">
            <img src="/whatsapp.svg" alt="" className='w-10 h-10' />
            <h1 className="text-white font-bold text-xl ml-2">WhatsApp</h1>
          </div>
          <div className="relative" ref={dropdownRef}>
            <img
              className="w-10 h-10 rounded-full cursor-pointer"
              src="https://placehold.co/100x100/3b4a54/FFF?text=H"
              alt="My Avatar"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            />
            <div className={`absolute right-0 mt-2 w-48 bg-[#233138] rounded-md shadow-lg py-1 z-50 text-white
              transition-all duration-200 ease-out transform
              ${isDropdownOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'}`}
            >
              <a href="#" className="block px-4 py-2 text-sm hover:bg-[#111b21]">Profile</a>
              <a href="#" className="block px-4 py-2 text-sm hover:bg-[#111b21]">Settings</a>
              <a href="#" className="block px-4 py-2 text-sm hover:bg-[#111b21]">Log out</a>
            </div>
          </div>
        </header>
        <div className="flex-1">
          <ChatList onSelectChat={setActiveChat} activeChatId={activeChat?._id} />
        </div>
      </div>

      {/* Main Chat Window */}
      <div className={`flex-1 flex-col ${activeChat ? 'flex' : 'hidden md:flex'}`}>
        {loadingMessages ? (
          <div className="flex items-center justify-center h-full text-white">Loading messages...</div>
        ) : (
          <ChatWindow
            chat={activeChat}
            messages={messages}
            setMessages={setMessages}
            onBack={() => setActiveChat(null)}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
