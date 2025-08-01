import { createContext, useEffect, useState } from "react";

/**
 * AuthContext
 * 
 * React Context for managing user authentication state across the application.
 * Features:
 * - User state management
 * - Session storage persistence
 * - Login/logout functionality
 * - Automatic state synchronization
 */
export const AuthContext = createContext();

/**
 * AuthProvider Component
 * 
 * Provider component that wraps the app and provides authentication context.
 * Manages user state and provides authentication functions to all child components.
 */
export const AuthProvider = ({ children }) => {
  // Initialize user state from session storage or null
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Sync user state with session storage whenever it changes
  useEffect(() => {
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  /**
   * Logout function
   * Clears user data from session storage and state
   */
  const logout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
