import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, MessageCircle, Settings } from 'lucide-react';

const Sidebar = ({ darkMode }) => {
  const location = useLocation();
  
  const tabs = [
    { id: 'feed', path: '/feed', icon: Home, label: 'Feed' },
    { id: 'profile', path: '/profile', icon: User, label: 'Profile' },
    { id: 'messages', path: '/messages', icon: MessageCircle, label: 'Messages' },
    { id: 'settings', path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className={`w-64 h-full border-r ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
      <div className="p-4 space-y-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path || (location.pathname === '/' && tab.path === '/feed');
          return (
            <Link
              key={tab.id}
              to={tab.path}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? darkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-800'
                  : darkMode ? 'text-slate-400 hover:bg-slate-700 hover:text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar; 