import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import PostCard from '../PostCard';
import { useData } from '../context/DataContext';

const FeedPage = ({ darkMode }) => {
  const [newPost, setNewPost] = useState('');
  const { posts, addPost, loading, error } = useData();

  const handleSubmit = async () => {
    if (newPost.trim()) {
      try {
        await addPost(newPost);
        setNewPost('');
      } catch (err) {
        console.error('Failed to add post:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className={`p-8 text-center ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
        Loading posts...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-8 text-center ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`p-4 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind?"
          className={`w-full p-3 rounded-lg border resize-none ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
          rows="3"
        />
        <button
          onClick={handleSubmit}
          className={`mt-3 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${darkMode ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-slate-600 hover:bg-slate-700 text-white'}`}
        >
          <Plus size={16} />
          <span>Post</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} darkMode={darkMode} />
        ))}
      </div>
    </div>
  );
};

export default FeedPage; 