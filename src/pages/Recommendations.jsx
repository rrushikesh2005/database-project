import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiUrl } from "../config/config";
import "../css/recommendations.css"; // Reuse the same CSS if applicable

const Recommendations = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendations = async () => {
    console.log("2",username);
    try {
      const res = await fetch(`${apiUrl}/api/user/list-recommendations/${username}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch recommendations");
      const data = await res.json();
      setItems(data.result || []);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [username]);

  if (loading) return <p>Loading recommendations...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="recommendations-page">
      <h1 className="page-title">{username}'s Recommendations</h1>

      {items.length === 0 ? (
        <p>No recommendations available from this user.</p>
      ) : (
        <div className="trending-container">
          <div className="trending-scroll">
            {items.map((item) => (
              <div
                key={`${item.item_id}-${item.category}`}
                className="card"
                onClick={() => navigate(`/details/${item.category}/${item.item_id}`)}
              >
                <img
                  src={item.image_url || "/images/default.jpg"}
                  alt={item.title}
                  className="image"
                />
                <p className="title">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
