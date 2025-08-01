import React, { useEffect, useState } from "react";
import { posts } from "../../data/feed";
import AddPost from "../AddPost";
import PostCard from "./PostCard";
import axios from "axios";

const PostsFeed = () => {
  const [userPosts, setUserPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/posts");
      setUserPosts(res.data);
    } catch (error) {
      console.error("Error on fetching posts", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  console.log(userPosts);

  return (
    <div
      className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
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
                author={post.author}
                nickname={post.nickname}
                content={post.content}
                likes={post.likes}
                timestamp={post.timestamp}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostsFeed;
