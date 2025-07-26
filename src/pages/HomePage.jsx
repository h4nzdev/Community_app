"use client";

import { useState } from "react";
import Navbar from "../components/NavBar";
import Sidebar from "../components/SideBar/Sidebar";
import MobileBottomNav from "../components/MobileResponsiveLayout/MobileBottomNav";
import PostsFeed from "../components/Posts/PostsFeed";
import MobileLayout from "../components/MobileResponsiveLayout/MobileLayout";

function HomePage() {
  // State for dark mode
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100">
        {/* Main Container with 90% width and flex layout */}
        <div className="mx-auto">
          {/* Desktop Layout - Flex with gap-8 */}
          <div className="hidden md:flex gap-8 h-screen">
            {/* Sidebar - Full screen height */}
            <div className="w-72 flex-shrink-0">
              <div className="sticky top-0">
                <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
              </div>
            </div>
            {/* Combined Navbar + Feed Content */}
            <div className="flex-1 flex flex-col min-w-0 px-6 gap-6">
              {/* Navbar - Fixed */}
              <div className="sticky top-0 z-10">
                <Navbar />
              </div>
              {/* Scrollable Content Area - AddPost + Posts Feed */}
              <PostsFeed />
            </div>
          </div>
          {/* Mobile Layout */}
          <MobileLayout />
        </div>
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav setDarkMode={setDarkMode} darkMode={darkMode} />
        {/* Add padding bottom on mobile to account for bottom navigation */}
        <div className="md:hidden h-20"></div>
      </div>
    </div>
  );
}

export default HomePage;
