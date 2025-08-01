"use client";

import { useContext, useEffect, useState } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  Edit,
  Trash2,
} from "lucide-react";
import Sidebar from "../components/SideBar/Sidebar";
import { AuthContext } from "../context/AuthContext";
import EditPostModal from "../components/Posts/EditPostModal";
import axios from "axios";
import { formatRelativeTime } from "../utils/dateUtils";

/**
 * PostsPage Component
 * 
 * Page for managing user's own posts with edit and delete functionality.
 * Features:
 * - View all user posts
 * - Edit posts with modal
 * - Delete posts
 * - Post statistics
 * - Responsive design
 */
function PostsPage() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  /**
   * Fetch all posts for the current user
   */
  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/api/user-posts/${user.id}`
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Error on fetching posts", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  /**
   * Handle post deletion
   */
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const res = await axios.delete(
          `http://127.0.0.1:5000/api/delete-posts/${id}`
        );
        console.log(res.data.message);
        fetchPosts(); // Refresh posts after deletion
      } catch (error) {
        console.error("Error on delete", error);
        alert("Failed to delete post. Please try again.");
      }
    }
  };

  /**
   * Handle edit button click
   */
  const handleEdit = (post) => {
    setSelectedPost(post);
    setIsEditModalOpen(true);
  };

  /**
   * Handle modal close
   */
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedPost(null);
  };

  /**
   * Handle post update completion
   */
  const handlePostUpdated = () => {
    fetchPosts(); // Refresh posts after update
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex gap-8">
      {/* Sidebar */}
      <div className="w-72 flex-shrink-0">
        <div className="sticky top-0 text-white">
          <Sidebar />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            My Posts
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and view all your posts
          </p>
        </div>

        {/* Posts List */}
        {posts.map((post) => (
          <div key={post.id} className="space-y-4 mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              {/* Post Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {post.author.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-gray-800 dark:text-gray-200">
                      {post.author}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      @{post.nickname}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEdit(post)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {post.content}
                </p>
              </div>

              {/* Post Stats */}
              <div className="flex items-center space-x-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <ThumbsUp size={18} className="text-green-600" />
                  <span className="font-medium">{post.likes}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <ThumbsDown size={18} className="text-red-600" />
                  <span className="font-medium">0</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <MessageCircle size={18} className="text-blue-600" />
                  <span className="font-medium">0</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Share2 size={18} className="text-purple-600" />
                  <span className="font-medium">Share</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Summary */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Posts Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {posts.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Posts
              </div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900 rounded-lg">
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {posts.reduce((total, post) => total + post.likes, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Likes
              </div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900 rounded-lg">
              <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                3
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Comments
              </div>
            </div>
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-900 rounded-lg">
              <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                {posts.length > 0 ? Math.round(posts.reduce((total, post) => total + post.likes, 0) / posts.length) : 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Avg Likes
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Post Modal */}
      <EditPostModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        post={selectedPost}
        onPostUpdated={handlePostUpdated}
      />
    </div>
  );
}

export default PostsPage;
