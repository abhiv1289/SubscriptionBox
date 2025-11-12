import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Box from "./pages/Box";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Header from "./components/Header";
import API from "./api";

export default function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.token) API.setToken(user.token);

    // simulate initialization delay (e.g., connecting to server)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 1.5 seconds

    return () => clearTimeout(timer);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    API.setToken(null);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white flex-col">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mb-4"></div>
        <p className="text-xl font-semibold text-gray-300">
          Wait a minute... while the render is turning on 🚀
        </p>
      </div>
    );
  }

  return (
    <div>
      <Header user={user} setUser={setUser} onLogout={handleLogout} />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/box/:id" element={<Box user={user} />} />
          <Route path="/checkout/:id" element={<Checkout user={user} />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/admin" element={<Admin user={user} />} />
        </Routes>
      </main>
    </div>
  );
}
