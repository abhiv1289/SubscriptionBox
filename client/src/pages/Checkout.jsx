import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import toast from "react-hot-toast";

export default function Checkout() {
  const { id } = useParams();
  const [box, setBox] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/boxes/${id}`)
      .then((r) => setBox(r.data))
      .catch(() => {});
  }, [id]);

  const subscribe = async () => {
    try {
      await API.post(`/subscriptions/${id}/subscribe`);
      toast.success("Subscribed!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Subscribe failed");
    }
  };

  if (!box) return <div>Loading...</div>;

  return (
    <div>
      <h2>Checkout — {box.title}</h2>
      <p>Price: ${box.priceMonthlyUSD}/month</p>
      <p>
        Payment is simulated in this demo. Click subscribe to create a
        subscription.
      </p>
      <button className="btn" onClick={subscribe}>
        Subscribe
      </button>
    </div>
  );
}
