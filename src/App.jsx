import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import UserAccount from "./pages/UserAccount";
import PostsPage from "./pages/PostsPage";
import MessagesPage from "./pages/MessagesPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user-account" element={<UserAccount />} />
          <Route path="posts" element={<PostsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
