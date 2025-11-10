import React, { useEffect, useState } from "react";
import API from "../api";
import toast from "react-hot-toast";

export default function Admin() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [boxes, setBoxes] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priceMonthlyUSD: 0,
    items: "",
  });

  useEffect(() => {
    if (!user || !user.isAdmin) return;
    API.get("/boxes")
      .then((r) => setBoxes(r.data))
      .catch(() => {});
  }, [user]);

  const create = async () => {
    try {
      const payload = {
        ...form,
        items: form.items.split(",").map((s) => s.trim()),
      };
      await API.post("/boxes", payload);
      toast.success("Box created");
      setForm({ title: "", description: "", priceMonthlyUSD: 0, items: "" });
      const res = await API.get("/boxes");
      setBoxes(res.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Create failed");
    }
  };

  if (!user || !user.isAdmin) return <div>Admin only</div>;

  return (
    <div>
      <h1>Admin — Boxes</h1>
      <div className="admin-form">
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          placeholder="Price"
          type="number"
          value={form.priceMonthlyUSD}
          onChange={(e) =>
            setForm({ ...form, priceMonthlyUSD: Number(e.target.value) })
          }
        />
        <input
          placeholder="Items (comma separated)"
          value={form.items}
          onChange={(e) => setForm({ ...form, items: e.target.value })}
        />
        <button className="btn" onClick={create}>
          Create Box
        </button>
      </div>

      <ul>
        {boxes.map((b) => (
          <li key={b._id}>
            {b.title} — ${b.priceMonthlyUSD}
          </li>
        ))}
      </ul>
    </div>
  );
}
