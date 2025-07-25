import React, { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const PostCard = ({ post, darkMode }) => {
  const [votes, setVotes] = useState(post.votes);
  const [userVote, setUserVote] = useState(null);

  const handleVote = (type) => {
    if (userVote === type) {
      setVotes(votes - (type === 'up' ? 1 : -1));
      setUserVote(null);
    } else {
      const change = type === 'up' ? 1 : -1;
      const prevChange = userVote === 'up' ? -1 : userVote === 'down' ? 1 : 0;
      setVotes(votes + change + prevChange);
      setUserVote(type);
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
      <div className="flex items-start space-x-3">
        <div className="flex flex-col items-center space-y-1">
          <button
            onClick={() => handleVote('up')}
            className={`p-1 rounded transition-colors ${userVote === 'up' ? 'text-green-500' : darkMode ? 'text-slate-400 hover:text-green-400' : 'text-slate-500 hover:text-green-500'}`}
          >
            <ArrowUp size={20} />
          </button>
          <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{votes}</span>
          <button
            onClick={() => handleVote('down')}
            className={`p-1 rounded transition-colors ${userVote === 'down' ? 'text-red-500' : darkMode ? 'text-slate-400 hover:text-red-400' : 'text-slate-500 hover:text-red-500'}`}
          >
            <ArrowDown size={20} />
          </button>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${darkMode ? 'bg-slate-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {post.name.charAt(0)}
            </div>
            <div>
              <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-slate-800'}`}>{post.name}</p>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>@{post.username}</p>
            </div>
          </div>
          <p className={`${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{post.content}</p>
        </div>
      </div>
    </div>
  );
};

export default PostCard; 