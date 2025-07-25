import React, { useState } from 'react';

const MessagesPage = ({ darkMode }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  
  const chats = [
    { id: 1, name: 'Alex', username: 'alex123', lastMessage: 'Hey! How are you?', time: '2m' },
    { id: 2, name: 'Sarah', username: 'sarah_dev', lastMessage: 'Thanks for the help!', time: '1h' },
    { id: 3, name: 'Mike', username: 'mike_design', lastMessage: 'See you tomorrow', time: '3h' },
  ];

  const messages = selectedChat ? [
    { id: 1, text: 'Hey! How are you?', sender: 'them', time: '2:30 PM' },
    { id: 2, text: 'I\'m good! How about you?', sender: 'me', time: '2:31 PM' },
    { id: 3, text: 'Doing great, thanks for asking!', sender: 'them', time: '2:32 PM' },
  ] : [];

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (newMessage.trim()) {
      setNewMessage('');
    }
  };

  return (
    <div className="flex h-96">
      <div className={`w-1/3 border-r ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
        <div className={`p-4 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Messages</h2>
        </div>
        <div className="overflow-y-auto">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full p-4 text-left border-b transition-colors ${
                selectedChat?.id === chat.id
                  ? darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-100 border-slate-200'
                  : darkMode ? 'hover:bg-slate-800 border-slate-700' : 'hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${darkMode ? 'bg-slate-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {chat.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${darkMode ? 'text-white' : 'text-slate-800'}`}>{chat.name}</p>
                  <p className={`text-sm truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{chat.lastMessage}</p>
                </div>
                <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{chat.time}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className={`p-4 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-slate-800'}`}>{selectedChat.name}</h3>
            </div>
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.sender === 'me'
                      ? darkMode ? 'bg-slate-600 text-white' : 'bg-slate-600 text-white'
                      : darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-800'
                  }`}>
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'me'
                        ? 'text-slate-300'
                        : darkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>{message.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className={`p-4 border-t ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className={`flex-1 px-3 py-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-200 text-slate-800'}`}
                />
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-slate-600 hover:bg-slate-700 text-white'}`}
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage; 