import { LogOut } from "lucide-react";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  console.log(user);

  const handleLogout = () => {
    logout();
  };
  return (
    <nav className="bg-gradient-to-r rounded from-slate-600 to-slate-700 text-white p-4 w-full shadow-lg mt-4">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Commu
        </div>

        {/* Username and Logout grouped together */}
        <div className="flex items-center space-x-4">
          <div className="text-lg font-medium">@{user?.username}</div>
          <Link to="/login">
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
