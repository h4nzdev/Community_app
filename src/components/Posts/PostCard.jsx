import React from "react";
import PostActionButton from "./PostActionButton";

/**
 * PostCard Component
 * 
 * Displays a single post with all its information and interactive elements.
 * Features:
 * - Post content display
 * - Author information with avatar
 * - Timestamp
 * - Interactive action buttons (like, comment, share)
 * - Responsive design
 * - Dark mode support
 */
const PostCard = ({ id, author, nickname, content, timestamp, likes }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg mb-4 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
      
      {/* Post Header - Author Info and Timestamp */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {/* Author Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {author.charAt(0).toUpperCase()}
          </div>
          
          {/* Author Details */}
          <div className="ml-3">
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              {author}
            </div>
            <div className="text-slate-500 text-sm">@{nickname}</div>
          </div>
        </div>
        
        {/* Post Timestamp */}
        <div className="text-slate-400 text-sm">{timestamp}</div>
      </div>

      {/* Post Content */}
      <div className="mb-6">
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          {content}
        </p>
      </div>

      {/* Interactive Action Buttons */}
      <PostActionButton postId={id} likes={likes} />
    </div>
  );
};

export default PostCard;
