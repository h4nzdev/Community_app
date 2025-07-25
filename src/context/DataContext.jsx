import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API base URL
  const API_BASE_URL = 'http://localhost:5000/api';

  // Fetch posts from backend
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/posts`);
      setPosts(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  // Add new post
  const addPost = async (content, username = 'hanz') => {
    try {
      const response = await axios.post(`${API_BASE_URL}/posts`, {
        content,
        username
      });
      
      // Add the new post to the beginning of the posts array
      setPosts(prevPosts => [response.data, ...prevPosts]);
      return response.data;
    } catch (err) {
      console.error('Error adding post:', err);
      setError('Failed to add post');
      throw err;
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchPosts();
    fetchUsers();
  }, []);

  const value = {
    posts,
    users,
    loading,
    error,
    addPost,
    fetchPosts,
    fetchUsers
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}; 