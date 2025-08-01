import React, { useState, useEffect, useContext } from "react";
import { MessageCircle, Share2, ThumbsDown, ThumbsUp } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import CommentModal from "./CommentModal";

/**
 * PostActionButton Component
 * 
 * Handles all interactive actions for a post:
 * - Like/Unlike functionality
 * - Comment system with modal
 * - Share button (placeholder)
 * - Dislike button (placeholder)
 * 
 * Features:
 * - Professional like system (one like per user)
 * - Real-time like count updates
 * - Comment count display
 * - User authentication checks
 * - Loading states for better UX
 */
const PostActionButton = ({ postId, likes: initialLikes }) => {
  // Context for user authentication
  const { user } = useContext(AuthContext);
  
  // State management
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  // Initialize component data when user or postId changes
  useEffect(() => {
    if (user && postId) {
      checkUserLike();
      fetchCommentCount();
    }
  }, [user, postId]);

  /**
   * Check if the current user has already liked this post
   */
  const checkUserLike = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/api/posts/${postId}/check-like/${user.id}`
      );
      setIsLiked(response.data.liked);
    } catch (error) {
      console.error("Error checking like status:", error);
    }
  };

  /**
   * Fetch the current comment count for this post
   */
  const fetchCommentCount = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/api/posts/${postId}/comments`
      );
      setCommentCount(response.data.length);
    } catch (error) {
      console.error("Error fetching comment count:", error);
    }
  };

  /**
   * Handle like/unlike button click
   * Implements professional like system with toggle functionality
   */
  const handleLike = async () => {
    // Check if user is logged in
    if (!user) {
      alert("Please login to like posts");
      return;
    }

    // Prevent multiple clicks while processing
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://127.0.0.1:5000/api/posts/${postId}/like`,
        { user_id: user.id }
      );
      
      // Update UI with new like count and status
      setLikes(response.data.likes_count);
      setIsLiked(response.data.liked);
    } catch (error) {
      console.error("Error liking post:", error);
      alert("Failed to like post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle comment button click
   * Opens comment modal for viewing and adding comments
   */
  const handleCommentClick = () => {
    if (!user) {
      alert("Please login to view comments");
      return;
    }
    setIsCommentModalOpen(true);
  };

  return (
    <>
      {/* Action Buttons Container */}
      <div className="flex items-center md:space-x-8 md:justify-start justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
        
        {/* Like Button */}
        <button 
          onClick={handleLike}
          disabled={isLoading}
          className={`flex items-center space-x-2 p-2 rounded-lg transition-all group ${
            isLiked 
              ? "text-green-600 bg-green-50 dark:bg-green-900" 
              : "text-slate-600 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900"
          }`}
        >
          <ThumbsUp
            size={18}
            className={`group-hover:scale-110 transition-transform ${
              isLiked ? "fill-current" : ""
            }`}
          />
          <span className="font-medium">{likes}</span>
        </button>

        {/* Dislike Button (Placeholder) */}
        <button className="flex items-center space-x-2 text-slate-600 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 transition-all group">
          <ThumbsDown
            size={18}
            className="group-hover:scale-110 transition-transform"
          />
          <span className="font-medium">0</span>
        </button>

        {/* Comment Button */}
        <button 
          onClick={handleCommentClick}
          className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-all group"
        >
          <MessageCircle
            size={18}
            className="group-hover:scale-110 transition-transform"
          />
          <span className="font-medium">{commentCount}</span>
        </button>

        {/* Share Button (Placeholder) */}
        <button className="flex items-center space-x-2 text-slate-600 hover:text-purple-600 p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900 transition-all group">
          <Share2
            size={18}
            className="group-hover:scale-110 transition-transform"
          />
          <span className="font-medium">Share</span>
        </button>
      </div>

      {/* Comment Modal */}
      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        postId={postId}
        onCommentAdded={fetchCommentCount}
      />
    </>
  );
};

export default PostActionButton;
