import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import FeedPage from "./pages/FeedPage";
import UserAccountPage from "./pages/UserAccountPage";
import SettingsPage from "./pages/SettingsPage";
import MessagesPage from "./pages/MessagesPage";
import Login from "./pages/Login";
import { DataProvider } from "./context/DataContext";

const CommunityApp = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [currentUser] = useState("Hanz");

  return (
    <DataProvider>
      <Router>
        <div
          className={`min-h-screen ${darkMode ? "bg-slate-900" : "bg-slate-50"}`}
        >
          <Navbar currentUser={currentUser} darkMode={darkMode} />
          <div
            className="flex gap-10 pt-6"
            style={{ width: "90vw", margin: "0 auto" }}
          >
            <Sidebar darkMode={darkMode} />
            <main className="flex-1">
              <Routes>
                <Route
                  path="/"
                  element={
                    <FeedPage darkMode={darkMode} />
                  }
                />
                <Route
                  path="/feed"
                  element={
                    <FeedPage darkMode={darkMode} />
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <UserAccountPage
                      currentUser={currentUser}
                      darkMode={darkMode}
                    />
                  }
                />
                <Route
                  path="/messages"
                  element={<MessagesPage darkMode={darkMode} />}
                />
                <Route
                  path="/settings"
                  element={
                    <SettingsPage
                      darkMode={darkMode}
                      onToggleDarkMode={() => setDarkMode(!darkMode)}
                    />
                  }
                />
                <Route path="/login" element={<Login />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </DataProvider>
  );
};

export default CommunityApp;
