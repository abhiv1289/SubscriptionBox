import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import toast from "react-hot-toast";

export default function Header({ user, setUser, onLogout }) {
  const [showAuth, setShowAuth] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false); // 🔹 new loader state

  const login = async (e) => {
    e.preventDefault();
    setLoading(true); // 🔹 start loading
    try {
      const res = await API.post("/auth/login", {
        email: form.email,
        password: form.password,
      });
      const payload = { token: res.data.token, ...res.data.user };
      localStorage.setItem("user", JSON.stringify(payload));
      API.setToken(res.data.token);
      setUser(payload);
      toast.success("Logged in");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false); // 🔹 stop loading
    }
  };

  const register = async (e) => {
    e.preventDefault();
    setLoading(true); // 🔹 start loading
    try {
      const res = await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      const payload = { token: res.data.token, ...res.data.user };
      localStorage.setItem("user", JSON.stringify(payload));
      API.setToken(res.data.token);
      setUser(payload);
      toast.success("Registered");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Register failed");
    } finally {
      setLoading(false); // 🔹 stop loading
    }
  };

  return (
    <header className="header">
      <div className="brand">
        <Link to="/">SubBox</Link>
      </div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/dashboard">My Subscriptions</Link>
        {user?.isAdmin && <Link to="/admin">Admin</Link>}
      </nav>

      <div className="auth-area">
        {user ? (
          <>
            <span className="user-name">Hi, {user.name}</span>
            <button className="btn" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="btn" onClick={() => setShowAuth((s) => !s)}>
              {showAuth ? "Close" : "Login / Register"}
            </button>
            {showAuth && (
              <form className="auth-form" onSubmit={login}>
                <input
                  placeholder="Name (for register)"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                  placeholder="Password"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />

                {loading ? (
                  <div className="loader">
                    <div className="spinner"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn" type="submit">
                      Login
                    </button>
                    <button className="btn" type="button" onClick={register}>
                      Register
                    </button>
                  </div>
                )}
              </form>
            )}
          </>
        )}
      </div>
    </header>
  );
}
