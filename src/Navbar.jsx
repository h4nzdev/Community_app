import React from "react";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = ({ currentUser, darkMode }) => (
  <nav
    className={`w-full h-16 px-6 flex items-center justify-between border-b ${
      darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
    }`}
  >
    <div className="flex items-center space-x-2">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
          darkMode ? "bg-slate-600 text-white" : "bg-slate-600 text-white"
        }`}
      >
        C
      </div>
      <h1
        className={`text-xl font-bold ${
          darkMode ? "text-white" : "text-slate-800"
        }`}
      >
        Commu
      </h1>
    </div>
    <div className="flex items-center space-x-4">
      <span
        className={`font-medium ${
          darkMode ? "text-slate-300" : "text-slate-600"
        }`}
      >
        {currentUser}
      </span>
      <Link to={"/login"}>
        <button
          className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
            darkMode
              ? "hover:bg-slate-700 text-slate-300"
              : "hover:bg-slate-100 text-slate-600"
          }`}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </Link>
    </div>
  </nav>
);

export default Navbar;
