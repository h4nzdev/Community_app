"use client"

import { useState } from "react"
import { ThumbsUp, ThumbsDown, MessageCircle, Share2, Edit, Trash2 } from "lucide-react"

function PostsPage() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      content: "Just finished reading an amazing book about web development! Highly recommend it to anyone starting their coding journey. 📚✨",
      timestamp: "2 hours ago",
      likes: 12,
      dislikes: 2,
      comments: 5
    },
    {
      id: 2,
      content: "Working on a new React project today. The component structure is coming together nicely. Love how modular everything is! 🚀",
      timestamp: "4 hours ago",
      likes: 8,
      dislikes: 1,
      comments: 3
    },
    {
      id: 3,
      content: "Beautiful sunset today! Sometimes it's good to step away from the computer and enjoy nature. Hope everyone is having a great day! 🌅",
      timestamp: "1 day ago",
      likes: 25,
      dislikes: 0,
      comments: 12
    },
    {
      id: 4,
      content: "Learning TailwindCSS has been a game changer for my development workflow. The utility classes make styling so much faster! 💨",
      timestamp: "2 days ago",
      likes: 15,
      dislikes: 3,
      comments: 7
    }
  ])

  const [editingPost, setEditingPost] = useState(null)
  const [editContent, setEditContent] = useState("")

  const handleEdit = (post) => {
    setEditingPost(post.id)
    setEditContent(post.content)
  }

  const handleSaveEdit = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, content: editContent }
        : post
    ))
    setEditingPost(null)
    setEditContent("")
  }

  const handleDelete = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setPosts(posts.filter(post => post.id !== postId))
    }
  }

  const handleCancelEdit = () => {
    setEditingPost(null)
    setEditContent("")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">My Posts</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and view all your posts</p>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No posts yet</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Start sharing your thoughts!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                {/* Post Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      H
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-gray-800 dark:text-gray-200">Hanz Christian Angelo</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{post.timestamp}</div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
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
                  {editingPost === post.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 resize-none"
                        rows={3}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSaveEdit(post.id)}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{post.content}</p>
                  )}
                </div>

                {/* Post Stats */}
                <div className="flex items-center space-x-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <ThumbsUp size={18} className="text-green-600" />
                    <span className="font-medium">{post.likes}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <ThumbsDown size={18} className="text-red-600" />
                    <span className="font-medium">{post.dislikes}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <MessageCircle size={18} className="text-blue-600" />
                    <span className="font-medium">{post.comments}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Share2 size={18} className="text-purple-600" />
                    <span className="font-medium">Share</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Stats */}
        {posts.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Posts Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{posts.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Posts</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                  {posts.reduce((sum, post) => sum + post.likes, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Likes</div>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900 rounded-lg">
                <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {posts.reduce((sum, post) => sum + post.comments, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Comments</div>
              </div>
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-900 rounded-lg">
                <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                  {Math.round(posts.reduce((sum, post) => sum + post.likes, 0) / posts.length)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Likes</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostsPage