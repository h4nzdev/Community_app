import {
  ArrowLeft,
  FileText,
  MessageCircle,
  Settings,
  Shield,
  ToggleLeft,
  ToggleRight,
  User,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import SideBarButton from "./SideBarButton";

const Sidebar = ({ darkMode, setDarkMode }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 h-screen overflow-y-auto shadow-lg border-r border-slate-200 dark:border-slate-700">
      <div className="flex flex-col gap-6">
        {location.pathname === "/" ? (
          ""
        ) : (
          <Link to="/">
            <div className="flex items-center gap-4 text-white cursor-pointer">
              <ArrowLeft />
              <p className="hover:underline">Home Page</p>
            </div>
          </Link>
        )}
        {/* User Account */}
        <SideBarButton
          link="/user-account"
          icon={User}
          name="User Account"
          bg="bg-blue-100"
          dark="dark:bg-blue-900"
          text="text-blue-400"
        />

        {/* Posts */}
        <SideBarButton
          link="/posts"
          icon={FileText}
          name="Posts"
          bg="bg-green-100"
          dark="dark:bg-green-900"
          text="text-green-400"
        />

        {/* Messages */}
        <SideBarButton
          link="/messages"
          icon={MessageCircle}
          name="Messages"
          bg="bg-purple-100"
          dark="dark:bg-purple-900"
          text="text-purple-400"
        />

        {/* Settings */}
        <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
          <div className="font-semibold mb-4 flex items-center space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Settings
                size={20}
                className="text-orange-600 dark:text-orange-400"
              />
            </div>
            <span>Settings</span>
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between mb-3 p-2 bg-white dark:bg-slate-600 rounded-lg">
            <span className="font-medium">Dark Mode</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center"
            >
              {darkMode ? (
                <ToggleRight size={24} className="text-blue-600" />
              ) : (
                <ToggleLeft size={24} className="text-slate-400" />
              )}
            </button>
          </div>

          {/* Privacy Data Button */}
          <button className="w-full text-left p-3 bg-white dark:bg-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-500 flex items-center space-x-3 transition-colors">
            <Shield size={16} className="text-slate-600 dark:text-slate-400" />
            <span className="font-medium">Privacy Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
