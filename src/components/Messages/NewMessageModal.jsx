import React, { useState, useEffect } from "react";
import { X, Search, User } from "lucide-react";
import axios from "axios";

/**
 * NewMessageModal Component
 *
 * Simple modal for starting new conversations.
 * Features:
 * - List all users
 * - Search users
 * - Start conversation
 * - Beginner-friendly design
 */
const NewMessageModal = ({ isOpen, onClose, onConversationStarted }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load users when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  /**
   * Fetch all users from backend
   */
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  /**
   * Start a new conversation
   */
  const handleStartConversation = (user) => {
    onConversationStarted(user);
    onClose();
  };

  /**
   * Filter users based on search term
   */
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-200 mx-4 max-h-[80vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            New Message
          </h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredUsers.length === 0 ? (
            <div className="text-center text-slate-500 dark:text-slate-400 py-8">
              {users.length === 0
                ? "No users found"
                : "No users match your search"}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleStartConversation(user)}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-800 dark:text-slate-200">
                      {user.name}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      @{user.username}
                    </div>
                  </div>
                  <User size={16} className="text-slate-400" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewMessageModal;
