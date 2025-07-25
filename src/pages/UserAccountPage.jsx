import React from 'react';

const UserAccountPage = ({ currentUser, darkMode }) => (
  <div className="space-y-6">
    <div className={`p-6 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center space-x-4 mb-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${darkMode ? 'bg-slate-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
          {currentUser.charAt(0)}
        </div>
        <div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{currentUser}</h2>
          <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>@{currentUser.toLowerCase()}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>42</p>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Posts</p>
        </div>
        <div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>1.2K</p>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Followers</p>
        </div>
        <div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>845</p>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Following</p>
        </div>
      </div>
    </div>
  </div>
);

export default UserAccountPage; 