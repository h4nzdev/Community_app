import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import axios from "axios";

/**
 * EditPostModal Component
 * 
 * A modal popup for editing existing posts.
 * Features:
 * - Edit post content and nickname
 * - Form validation
 * - Loading states and error handling
 * - Responsive design with max-width 200
 */
const EditPostModal = ({ isOpen, onClose, post, onPostUpdated }) => {
  // State management
  const [content, setContent] = useState("");
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Update form data when post changes
  useEffect(() => {
    if (post) {
      setContent(post.content);
      setNickname(post.nickname);
    }
  }, [post]);

  /**
   * Handle form submission
   * Updates the post with new content and nickname
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form inputs
    if (!content.trim()) {
      alert("Please write some content");
      return;
    }

    if (!nickname.trim()) {
      alert("Please enter a nickname");
      return;
    }

    setIsLoading(true);
    try {
      const updateData = {
        content: content.trim(),
        nickname: nickname.trim()
      };

      // Send update request to backend
      await axios.put(
        `http://127.0.0.1:5000/api/posts/${post.id}`,
        updateData
      );

      // Close modal and refresh posts
      onClose();
      if (onPostUpdated) {
        onPostUpdated();
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-200 mx-4 flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            Edit Post
          </h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Edit Form */}
        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Nickname Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Nickname
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter nickname..."
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-200 text-sm"
                disabled={isLoading}
              />
            </div>

            {/* Content Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content..."
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-200 text-sm resize-none"
                disabled={isLoading}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !content.trim() || !nickname.trim()}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
              >
                <Save size={16} className="mr-1" />
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal; 