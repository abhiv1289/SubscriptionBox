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

  useEffect(() => {
    if (user?.token) API.setToken(user.token);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    API.setToken(null);
    setUser(null);
    // optional: force reload to reset UI completely
    // window.location.reload();
  };

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
