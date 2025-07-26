import { Image, Smile } from "lucide-react";
import React, { useState } from "react";
import Swal from "sweetalert2";
const AddPost = ({ userPosts, setUserPosts }) => {
  const [post, setPost] = useState("");

  const handlePost = () => {
    const newPost = {
      id: userPosts.length + 1,
      author: "Hanz Christian Angelo",
      nickname: "h_christian",
      content: post,
      timestamp: "just now",
    };

    if (post.trim() == "") return;

    setUserPosts((prev) => [newPost, ...prev]);
    Swal.fire({
      icon: "success",
      title: "Posted!",
      text: "Your post has been shared!",
      background: "#1e293b", // dark slate blue background
      color: "#f8fafc",
    });

    setPost("");
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg mb-6 border border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">
        Create New Post
      </h2>

      {/* Text Area */}
      <textarea
        value={post}
        onChange={(e) => setPost(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full p-4 border border-slate-300 dark:border-slate-600 rounded-xl mb-4 h-32 resize-none dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      ></textarea>

      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button className="flex items-center space-x-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
            <Image size={18} className="text-slate-600 dark:text-slate-400" />
            <span className="text-sm">Photo</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
            <Smile size={18} className="text-slate-600 dark:text-slate-400" />
            <span className="text-sm">Emoji</span>
          </button>
        </div>

        {/* Post Button */}
        <button
          onClick={handlePost}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-all transform hover:scale-105"
        >
          Post
        </button>
      </div>
    </div>
  );
};
export default AddPost;
