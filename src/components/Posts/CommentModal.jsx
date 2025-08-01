import React, { useState, useEffect, useContext } from "react";
import { X, Send } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { formatRelativeTime } from "../../utils/dateUtils";

/**
 * CommentModal Component
 * 
 * A modal popup for viewing and adding comments to posts.
 * Features:
 * - View all comments for a specific post
 * - Add new comments
 * - Real-time comment updates
 * - User authentication checks
 * - Loading states and error handling
 * - Responsive design
 */
const CommentModal = ({ isOpen, onClose, postId, onCommentAdded }) => {
  // Context for user authentication
  const { user } = useContext(AuthContext);
  
  // State management
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load comments when modal opens
  useEffect(() => {
    if (isOpen && postId) {
      fetchComments();
    }
  }, [isOpen, postId]);

  /**
   * Fetch all comments for the current post
   */
  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/api/posts/${postId}/comments`
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  /**
   * Handle comment form submission
   * Validates input and sends comment to backend
   */
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user) {
      alert("Please login to comment");
      return;
    }

    // Validate comment content
    if (!newComment.trim()) {
      alert("Please write a comment");
      return;
    }

    setIsLoading(true);
    try {
      const commentData = {
        user_id: user.id,
        content: newComment.trim()
      };

      // Send comment to backend
      await axios.post(
        `http://127.0.0.1:5000/api/posts/${postId}/comment`,
        commentData
      );

      // Clear input and refresh comments
      setNewComment("");
      fetchComments();
      
      // Update comment count in parent component
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-200 mx-4 max-h-[80vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            Comments ({comments.length})
          </h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {comments.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-center py-8">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3"
              >
                {/* Comment Header */}
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {comment.author.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-2">
                    <div className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                      {comment.author}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-xs">
                      {formatRelativeTime(comment.timestamp)}
                    </div>
                  </div>
                </div>
                
                {/* Comment Content */}
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Add Comment Form */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <form onSubmit={handleSubmitComment} className="flex space-x-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-200"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !newComment.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentModal; 