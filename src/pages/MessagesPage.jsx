"use client";

import { useState, useEffect, useContext } from "react";
import { Send, Search, Plus } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import NewMessageModal from "../components/Messages/NewMessageModal";
import axios from "axios";
import { formatRelativeTime, formatTime } from "../utils/dateUtils";

/**
 * MessagesPage Component
 * 
 * Simple messaging page for beginners.
 * Features:
 * - View all conversations
 * - Send and receive messages
 * - Search conversations
 * - Real-time message updates
 * - User authentication
 */
function MessagesPage() {
  const { user } = useContext(AuthContext);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);

  // Fetch conversations when user changes
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  // Fetch messages when selected chat changes
  useEffect(() => {
    if (selectedChat && user) {
      fetchMessages();
    }
  }, [selectedChat, user]);

  // Auto-refresh messages every 2 seconds when a chat is selected
  useEffect(() => {
    if (!selectedChat || !user) return;

    const interval = setInterval(() => {
      fetchMessages();
      fetchConversations(); // Also refresh conversations to update last message
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedChat, user]);

  /**
   * Fetch all conversations for the current user
   */
  const fetchConversations = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/api/messages/${user.id}/conversations`
      );
      setConversations(response.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  /**
   * Fetch messages between current user and selected chat
   */
  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/api/messages/${user.id}/${selectedChat.id}`
      );
      
      // Check if there are new messages
      const previousMessageCount = messages.length;
      const newMessageCount = response.data.length;
      
      // If there are new messages and we're not the sender, show a subtle notification
      if (newMessageCount > previousMessageCount && previousMessageCount > 0) {
        const newMessages = response.data.slice(previousMessageCount);
        const hasNewMessagesFromOthers = newMessages.some(msg => msg.sender === "other");
        
        if (hasNewMessagesFromOthers) {
          // You could add a sound notification here
          // new Audio('/notification.mp3').play();
          
          // Or show a subtle visual indicator
          console.log("New message received!");
        }
      }
      
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  /**
   * Send a new message
   */
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    setIsLoading(true);
    try {
      const messageData = {
        sender_id: user.id,
        receiver_id: selectedChat.id,
        content: newMessage.trim()
      };

      const response = await axios.post(
        "http://127.0.0.1:5000/api/messages",
        messageData
      );

      // Add new message to the list
      setMessages(prev => [...prev, response.data.data]);
      setNewMessage("");

      // Refresh conversations to update last message
      fetchConversations();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Enter key press to send message
   */
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /**
   * Filter conversations based on search term
   */
  const filteredConversations = conversations.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Handle starting a new conversation
   */
  const handleNewConversation = (user) => {
    // Check if conversation already exists
    const existingChat = conversations.find(chat => chat.id === user.id);
    if (existingChat) {
      setSelectedChat(existingChat);
    } else {
      // Create a new conversation object
      const newChat = {
        id: user.id,
        name: user.name,
        username: user.username,
        lastMessage: "No messages yet",
        time: "",
        unread: 0,
        online: false
      };
      setSelectedChat(newChat);
      setConversations(prev => [newChat, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex h-screen">
        {/* Chat List Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                Messages
              </h1>
              <button
                onClick={() => setIsNewMessageModalOpen(true)}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                {conversations.length === 0 ? "No conversations yet" : "No conversations found"}
              </div>
            ) : (
              filteredConversations.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    selectedChat?.id === chat.id
                      ? "bg-blue-50 dark:bg-blue-900 border-r-2 border-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {chat.name.charAt(0).toUpperCase()}
                      </div>
                      {chat.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                          {chat.name}
                        </h3>
                                                 <span className="text-xs text-gray-500 dark:text-gray-400">
                           {formatRelativeTime(chat.time)}
                         </span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {chat.lastMessage}
                        </p>
                        {chat.unread > 0 && (
                          <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedChat.name.charAt(0).toUpperCase()}
                  </div>
                  {selectedChat.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800 dark:text-gray-200">
                    {selectedChat.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedChat.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "me" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          message.sender === "me"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                                                 <p
                           className={`text-xs mt-1 ${
                             message.sender === "me"
                               ? "text-blue-100"
                               : "text-gray-500 dark:text-gray-400"
                           }`}
                         >
                           {formatTime(message.time)}
                         </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !newMessage.trim()}
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* No Chat Selected */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                <p>Choose a chat from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Message Modal */}
      <NewMessageModal
        isOpen={isNewMessageModalOpen}
        onClose={() => setIsNewMessageModalOpen(false)}
        onConversationStarted={handleNewConversation}
      />
    </div>
  );
}

export default MessagesPage;
