import { FileText, MessageCircle, Settings, User } from "lucide-react";
import React from "react";

const MobileBottomNav = ({setDarkMode, darkMode}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700 shadow-lg">
      <div className="flex justify-around py-3">
        <button className="flex flex-col items-center p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
          <User size={20} />
          <span className="text-xs font-medium">Account</span>
        </button>
        <button className="flex flex-col items-center p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
          <FileText size={20} />
          <span className="text-xs font-medium">Posts</span>
        </button>
        <button className="flex flex-col items-center p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
          <MessageCircle size={20} />
          <span className="text-xs font-medium">Messages</span>
        </button>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex flex-col items-center p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <Settings size={20} />
          <span className="text-xs font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default MobileBottomNav;
