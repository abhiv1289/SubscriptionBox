import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

export default function Home() {
  const [boxes, setBoxes] = useState([]);

  useEffect(() => {
    API.get("/boxes")
      .then((res) => setBoxes(res.data))
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1>Available Boxes</h1>
      <div className="grid">
        {boxes.map((b) => (
          <div key={b._id} className="card">
            <h3>{b.title}</h3>
            <p>{b.description}</p>
            <p>
              <strong>${b.priceMonthlyUSD}/month</strong>
            </p>
            <Link to={`/box/${b._id}`} className="link">
              View
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
