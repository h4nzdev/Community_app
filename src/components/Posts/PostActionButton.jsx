import React from "react";
import { MessageCircle, Share2, ThumbsDown, ThumbsUp } from "lucide-react";

const PostActionButton = () => {
  return (
    <div className="flex items-center md:space-x-8 md:justify-start justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
      {/* Like Up */}
      <button className="flex items-center space-x-2 text-slate-600 hover:text-green-600 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900 transition-all group">
        <ThumbsUp
          size={18}
          className="group-hover:scale-110 transition-transform"
        />
        <span className="font-medium">0</span>
      </button>

      {/* Like Down */}
      <button className="flex items-center space-x-2 text-slate-600 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 transition-all group">
        <ThumbsDown
          size={18}
          className="group-hover:scale-110 transition-transform"
        />
        <span className="font-medium">0</span>
      </button>

      {/* Comment */}
      <button className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-all group">
        <MessageCircle
          size={18}
          className="group-hover:scale-110 transition-transform"
        />
        <span className="font-medium">0</span>
      </button>

      {/* Share */}
      <button className="flex items-center space-x-2 text-slate-600 hover:text-purple-600 p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900 transition-all group">
        <Share2
          size={18}
          className="group-hover:scale-110 transition-transform"
        />
        <span className="font-medium">Share</span>
      </button>
    </div>
  );
};

export default PostActionButton;
