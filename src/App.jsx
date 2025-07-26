import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UserAccount from "./pages/UserAccount";
import PostsPage from "./pages/PostsPage";
import MessagesPage from "./pages/MessagesPage";
import LoginPage from "./pages/LoginPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user-account" element={<UserAccount />} />
        <Route path="posts" element={<PostsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
