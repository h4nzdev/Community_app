import { Lock, Mail } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="absolute inset-0 w-full min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-8 rounded-lg border bg-white border-slate-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center text-2xl font-bold mb-4 bg-slate-600 text-white">
            C
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome to Commu
          </h1>
          <p className="mt-2 text-slate-600">Sign in to your account</p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-3 py-2 rounded-lg border bg-white border-slate-200 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full pl-10 pr-3 py-2 rounded-lg border bg-white border-slate-200 text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Link to={"/"}>
          <button className="w-full mt-6 px-4 py-2 rounded-lg font-medium bg-slate-600 text-white">
            Sign In
          </button>
        </Link>

        {/* Toggle Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Don't have an account?
            <span className="ml-1 font-medium text-slate-700 cursor-pointer">
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
