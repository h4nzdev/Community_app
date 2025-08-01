import React, { useEffect, useState } from "react";
import { posts } from "../../data/feed";
import AddPost from "../AddPost";
import PostCard from "./PostCard";
import axios from "axios";
import { formatRelativeTime } from "../../utils/dateUtils";

/**
 * PostsFeed Component
 * 
 * Main component that displays all posts in a feed format.
 * Features:
 * - Fetches posts from backend API
 * - Displays posts in chronological order
 * - Includes add post functionality
 * - Responsive design with custom scrollbar
 * - Error handling for API calls
 */
const PostsFeed = () => {
  // State for storing posts from backend
  const [userPosts, setUserPosts] = useState([]);

  /**
   * Fetch all posts from the backend API
   */
  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/posts");
      setUserPosts(res.data);
    } catch (error) {
      console.error("Error on fetching posts", error);
    }
  };

  // Fetch posts when component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div
      className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {/* Custom scrollbar styling */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <div className="w-full">
        <div className="w-full max-w-none">
          
          {/* Add Post Section */}
          <AddPost fetchPosts={fetchPosts} />

          {/* Posts Feed */}
          <div className="space-y-4">
            {userPosts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                author={post.author}
                nickname={post.nickname}
                content={post.content}
                likes={post.likes}
                timestamp={formatRelativeTime(post.timestamp)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostsFeed;
