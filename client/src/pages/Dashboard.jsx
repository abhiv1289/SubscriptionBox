import React, { useEffect, useState } from "react";
import API from "../api";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [subs, setSubs] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user) return;
    API.get("/subscriptions")
      .then((r) => setSubs(r.data))
      .catch(() => {});
  }, [user]);

  if (!user) return <div>Please login to see your subscriptions</div>;

  const cancel = async (id) => {
    try {
      await API.post(`/subscriptions/${id}/cancel`);
      setSubs((prev) =>
        prev.map((s) => (s._id === id ? { ...s, status: "cancelled" } : s))
      );
      toast.success("Cancelled");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Cancel failed");
    }
  };

  const pause = async (id) => {
    try {
      const res = await API.post(`/subscriptions/${id}/pause`);
      setSubs((prev) => prev.map((s) => (s._id === id ? res.data : s)));
      toast.success("Updated");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  return (
    <div>
      <h1>My Subscriptions</h1>
      <ul>
        {subs.map((s) => (
          <li key={s._id} className="sub-item">
            <strong>{s.box?.title}</strong> — status: {s.status}
            <div style={{ marginTop: 8 }}>
              <button className="btn" onClick={() => pause(s._id)}>
                {s.status === "paused" ? "Resume" : "Pause"}
              </button>
              <button className="btn danger" onClick={() => cancel(s._id)}>
                Cancel
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
