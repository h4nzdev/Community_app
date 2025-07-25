import React from 'react';
import { Moon, Sun } from 'lucide-react';

const SettingsPage = ({ darkMode, onToggleDarkMode }) => (
  <div className="space-y-6">
    <div className={`p-6 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
      <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Appearance</h2>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {darkMode ? <Moon size={20} className="text-slate-400" /> : <Sun size={20} className="text-slate-600" />}
          <span className={`${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Dark Mode</span>
        </div>
        <button
          onClick={onToggleDarkMode}
          className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-slate-600' : 'bg-slate-300'}`}
        >
          <div className={`w-5 h-5 rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
        </button>
      </div>
    </div>
    
    <div className={`p-6 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
      <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Privacy</h2>
      <div className="space-y-3">
        <label className="flex items-center space-x-3">
          <input type="checkbox" className="rounded" />
          <span className={`${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Public Profile</span>
        </label>
        <label className="flex items-center space-x-3">
          <input type="checkbox" className="rounded" />
          <span className={`${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Show Online Status</span>
        </label>
      </div>
    </div>
  </div>
);

export default SettingsPage; 