import React from "react";
import { posts } from "../../data/feed";
import Navbar from "../NavBar";
import AddPost from "../AddPost";
import PostCard from "../Posts/PostCard";

const MobileLayout = () => {
  return (
    <div className="md:hidden flex flex-col h-screen">
      <Navbar />
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="p-4 w-full">
          <AddPost />
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

export default MobileLayout;
