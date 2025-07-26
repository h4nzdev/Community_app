import React from "react";
import { posts } from "../../data/feed";
import AddPost from "../AddPost";
import PostCard from "./PostCard";

const PostsFeed = () => {
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
          <AddPost />

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                author={post.author}
                nickname={post.nickname}
                content={post.content}
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
