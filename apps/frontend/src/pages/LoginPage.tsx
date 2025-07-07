import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../lib/api";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to home
    if (localStorage.getItem("access_token")) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await login({ username, password });
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      setLoading(false);
      navigate("/");
    } catch (err: any) {
      setLoading(false);
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">
          Login
        </h2>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        <div className="mb-4">
          <label className="block text-slate-700 dark:text-slate-300 mb-1">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-slate-700 dark:text-slate-300 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-md text-white font-medium bg-teal-600 hover:bg-teal-700 focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="mt-4 text-center text-slate-600 dark:text-slate-400">
          Don't have an account?{" "}
          <a href="/register" className="text-teal-600 hover:underline">
            Register
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
