import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Navbar1 from "../components/Navbar1";
import { apiUrl } from "../config/config";
import "../css/movies.css";

const API_KEY = "d56001a69719feb96f51a1f8a93df1ac";

const TVShows = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [series, setSeries] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true); // 🔹 Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch(`${apiUrl}/isLoggedIn`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();

        if (data.loggedIn) {
          setIsLoggedIn(true);
          setUsername(data.username);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false); // 🔹 End loading after checking
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
      const fetchSeries = async () => {
        if (searchQuery.trim() === "") {
          setSeries(dummyTVShows);  // Optional: clear movies if search is empty
          return;
        }
    
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}`
          );
          const data = await response.json();
          setSeries(data.results);  // assuming the API sends results like { results: [...] }
        } catch (error) {
          console.error("Error fetching tv show:", error);
        }
      };
    
      fetchSeries();
    }, [searchQuery]);

  const handleImageClick = async(item) => {
      try {
        const response = await fetch(`${apiUrl}/add-to-db`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ id: item.id, title: item.name, category: 'TV Show', description: item.overview, release_date: item.first_air_date, director: 'director', poster_path: item.poster_path }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.message || "Failed to add movie");
        }
      } catch (error) {
        console.error("Error adding movie: ", error);
      }
      navigate(`/details/TV Show/${item.id}`);
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
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const dummyTVShows = [
    { name: "Alice in Borderland", image: "/images/aliceinborderland.jpeg", id: -10 },
    { name: "Stranger Things", image: "/images/strangerthings.jpeg", id: -2 },
    { name: "Game of Thrones", image: "/images/got.jpeg", id: -11 },
    { name: "Money Heist", image: "/images/money_heist.jpg", id: -12 },
    { name: "Boys", image: "/images/boys.jpeg", id: -13 },
  ];

  // const filterTVShows = () =>
  //   dummyTVShows.filter((item) =>
  //     item.title.toLowerCase().startsWith(searchQuery.toLowerCase())
  //   );

  if (loading) return null; // 🔹 Prevent premature render

  return (
    <div className="home-container">
      {isLoggedIn && (
        <div className="navbar-fixed">
          <Navbar onLogout={handleLogout} />
          <Navbar1 onLogout={handleLogout} />
        </div>
      )}

      <div className="topbar">
        <h2 className="logo">TV Shows</h2>
        {!isLoggedIn && (
          <button className="loginButton" onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </div>

      <h1 className="heading">Explore TV Shows</h1>
      <div className="search-bar-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search TV shows..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid">
        {series.map((item, index) => (
          <div key={index} className="card">
            <img
              src={
                item.poster_path
                  ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                  : item.image || "/images/placeholder.png" // fallback if no poster
              }
              alt={item.name}
              className="image"
              onClick={() => handleImageClick(item)} 
              style={{ cursor: "pointer" }}
            />
            <p className="title">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TVShows;
