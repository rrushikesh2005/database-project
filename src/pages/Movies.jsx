import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Navbar1 from "../components/Navbar1";
import { apiUrl } from "../config/config";
import "../css/movies.css";

const API_KEY = "d56001a69719feb96f51a1f8a93df1ac";

const Movies = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true); // 🔹 Added
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
        setLoading(false); // 🔹 End loading
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      if (searchQuery.trim() === "") {
        setMovies(dummyMovies);  // Optional: clear movies if search is empty
        return;
      }
  
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchQuery}`
        );
        const data = await response.json();
        setMovies(data.results);  // assuming the API sends results like { results: [...] }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
  
    fetchMovies();
  }, [searchQuery]);
  

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

  const handleImageClick = async(item) => {
    try {
      const response = await fetch(`${apiUrl}/add-to-db`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id: item.id, title: item.title, category: 'Movie', description: item.overview, release_date: item.release_date, director: 'director', poster_path: item.poster_path }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Failed to add movie");
      }
    } catch (error) {
      console.error("Error adding movie: ", error);
    }
    navigate(`/details/Movie/${item.id}`);
  };

  const dummyMovies = [
    { title: "Inception", image: "/images/inception.jpeg", id: -4 },
    { title: "Interstellar", image: "/images/interstellar.jpeg", id: -5 },
    { title: "Tenet", image: "/images/tenet.jpeg", id: -6 },
    { title: "Oppenheimer", image: "/images/oppenheimer.jpeg", id: -7 },
    { title: "Rush Hour", image: "/images/rushhour.jpeg", id: -8 },
  ];

  // const filterMovies = () =>
  //   dummyMovies.filter((item) =>
  //     item.title.toLowerCase().startsWith(searchQuery.toLowerCase())
  //   );

  if (loading) return null; // 🔹 Prevent render until ready

  return (
    <div className="home-container">
      {isLoggedIn && (
        <div className="navbar-fixed">
          <Navbar onLogout={handleLogout} />
          <Navbar1 onLogout={handleLogout} />
        </div>
      )}

      <div className="topbar">
        <h2 className="logo">Movies</h2>
        {!isLoggedIn && (
          <button className="loginButton" onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </div>

      <h1 className="heading">Explore Movies</h1>
      <div className="search-bar-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid">
        {movies.map((item, index) => (
          <div key={index} className="card">
            <img
              src={
                item.poster_path
                  ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                  : item.image || "/images/placeholder.png" // fallback if no poster
              }
              alt={item.title}
              className="image"
              onClick={() => handleImageClick(item)} 
              style={{ cursor: "pointer" }}
            />
            <p className="title">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Movies;
