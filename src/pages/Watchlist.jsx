import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config/config";
import Navbar from "../components/Navbar";
import Navbar1 from "../components/Navbar1";
import "../css/watchlist.css"; // optional CSS file for styling

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
   const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const response = await fetch(`${apiUrl}/list-watchlist`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setWatchlist(data);
      } else {
        console.error("Failed to fetch watchlist.");
      }
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    } finally {
      setLoading(false);
    }
  };
   const handleLogout = async () => {
      try {
        const response = await fetch(`${apiUrl}/logout`, {
          method: "POST",
          credentials: "include",
        });
  
        if (response.ok) {
          setIsLoggedIn(false);
          setUsername("");
          navigate("/");
        }
      } catch (error) {
        console.error("Error logging out:", error);
      }
    };

  return (
    <div className="watchlist-page">
      <Navbar />
      <Navbar1 onLogout={handleLogout} />
      <h2>Your Watchlist</h2>

      {loading ? (
        <p>Loading...</p>
      ) : watchlist.length === 0 ? (
        <p>No items in your watchlist yet.</p>
      ) : (
        <div className="watchlist-grid">
          {watchlist.map((item) => (
            <div className="watchlist-card" key={item.item_id + item.category}>
              <img
                src={item.image_url}
                alt={item.title}
                className="watchlist-image"
              />
              <div className="watchlist-info">
                <h3>{item.title}</h3>
                <p className="category">{item.category}</p>
                <p className="date">
                  {new Date(item.release_date).toLocaleDateString()}
                </p>
                <p className="description">{item.description}</p>
                <p className="creator">
                  <strong>By:</strong> {item.author_creator}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;