import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";

export default function Box({ user }) {
  const { id } = useParams();
  const [box, setBox] = useState(null);

  useEffect(() => {
    API.get(`/boxes/${id}`)
      .then((r) => setBox(r.data))
      .catch(() => {});
  }, [id]);

  if (!box) return <div>Loading...</div>;

  return (
    <div>
      <h2>{box.title}</h2>
      <p>{box.description}</p>
      <ul>
        {(box.items || []).map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
      <p>
        <strong>${box.priceMonthlyUSD}/month</strong>
      </p>
      {!user ? (
        <Link to="/">Login to subscribe</Link>
      ) : (
        <Link to={`/checkout/${box._id}`}>Subscribe</Link>
      )}
    </div>
  );
}
