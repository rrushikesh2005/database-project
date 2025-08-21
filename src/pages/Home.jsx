import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config/config";
import Navbar from "../components/Navbar";
import Navbar1 from "../components/Navbar1";
import "../css/home.css";

const API_KEY = "d56001a69719feb96f51a1f8a93df1ac";

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  // const [searchQuery, setSearchQuery] = useState("");

  const [movies, setMovies] = useState([]);
  const [tvShows, setTVShows] = useState([]);
  const [books, setBooks] = useState([]);
  const [averageRatings, setAverageRatings] = useState({});
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTVShows, setTrendingTVShows] = useState([]);
  const [countryMovies, setCountryMovies] = useState([]);
  const [countryTVShows, setCountryTVShows] = useState([]);
  const [recommendations, setRecommendations] = useState({});

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch(`${apiUrl}/isLoggedIn`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setIsLoggedIn(data.loggedIn);
        if (data.loggedIn) setUsername(data.username);
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchAll = async () => {
      try {
        const [moviesRes, tvShowsRes, booksRes] = await Promise.all([
          fetch(`${apiUrl}/list-movies`, { credentials: "include" }),
          fetch(`${apiUrl}/list-tvshows`, { credentials: "include" }),
          fetch(`${apiUrl}/list-books`, { credentials: "include" }),
        ]);
        const [moviesData, tvShowsData, booksData] = await Promise.all([
          moviesRes.json(),
          tvShowsRes.json(),
          booksRes.json(),
        ]);
        if (moviesRes.ok) setMovies(moviesData.result);
        if (tvShowsRes.ok) setTVShows(tvShowsData.result);
        if (booksRes.ok) setBooks(booksData.result);
      } catch (err) {
        console.error("Error fetching content:", err);
      }
    };

    fetchAll();
  }, [isLoggedIn]);

  useEffect(() => {
  
    const fetchTrending = async () => {
      try {
        const [moviesRes, tvRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`),
          fetch(`https://api.themoviedb.org/3/trending/tv/day?api_key=${API_KEY}`)
        ]);
  
        const [moviesData, tvData] = await Promise.all([
          moviesRes.json(),
          tvRes.json()
        ]);
  
        setTrendingMovies(moviesData.results || []);
        setTrendingTVShows(tvData.results || []);
      } catch (error) {
        console.error("Error fetching trending content:", error);
      }
    };
  
    fetchTrending();
  }, [isLoggedIn]);  

  useEffect(() => {

    const fetchCountryTrending = async () => {
      try {
        const [moviesRes, tvRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&region=IN&sort_by=popularity.desc`),
          fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&region=IN&sort_by=popularity.desc`)
        ]);

        const [moviesData, tvData] = await Promise.all([
          moviesRes.json(),
          tvRes.json()
        ]);

        setCountryMovies(moviesData.results || []);
        setCountryTVShows(tvData.results || []);
      } catch (err) {
        console.error("Failed to fetch Indian trending:", err);
      }
    };

    fetchCountryTrending();
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchAverageRatings = async () => {
      if (!isLoggedIn) return;

      const allItems = [...movies, ...tvShows, ...books];
      const ratings = {};

      for (const item of allItems) {
        try {
          // console.log("rithik",item.category,item);
          const response = await fetch(`${apiUrl}/api/items/${item.category}/${item.item_id}/average-rating`, {
            credentials: "include",
          });
          const data = await response.json();
          if (response.ok) {
            ratings[item.item_id] = {
              average: data.averageRating,
              count: data.ratingCount
            };
          }
          // console.log("rithik",data.averageRating,data.ratingCount);
          
          
        } catch (err) {
          console.error(`Error fetching average rating for item ${item.item_id}:`, err);
        }
      }

      setAverageRatings(ratings);
    };

    fetchAverageRatings();
  }, [movies, tvShows, books, isLoggedIn]);

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

  useEffect(() => {
    if (!isLoggedIn) return;
  
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(`${apiUrl}/list-recommendations`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch recommendations");
  
        const data = await response.json();
        setRecommendations(data.recommendations || {});
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      }
    };
  
    fetchRecommendations();
  }, [isLoggedIn]);
  
  const handleImageClick = async(item, category) => {
      try {
        const response = await fetch(`${apiUrl}/add-to-db`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: (category === "Movies")?JSON.stringify({ id: item.id, title: item.title, category: category, description: item.overview, release_date: item.release_date, director: 'director', poster_path: item.poster_path })
          :JSON.stringify({ id: item.id, title: item.name, category: category, description: item.overview, release_date: item.first_air_date, director: 'director', poster_path: item.poster_path }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.message || "Failed to add movie");
        }
      } catch (error) {
        console.error("Error adding movie: ", error);
      }
      navigate(`/details/${category}/${item.id}`);
  };

  const renderStars = (itemId) => {
    const ratingData = averageRatings[itemId];
    if (!ratingData) return null;
  
    const { average, count } = ratingData;
  
    const fullStars = Math.floor(average);
    const partialStar = average - fullStars;
    const partialWidth = partialStar * 100;
  
    return (
      <div className="stars-container" title={`${average.toFixed(1)} from ${count} ratings`}>
        <div className="stars-outer">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="star">
              <div className="star-back">★</div>
              <div
                className="star-front"
                style={{
                  width:
                    i < fullStars
                      ? "100%"
                      : i === fullStars
                      ? `${partialWidth}%`
                      : "0%",
                }}
              >
                ★
              </div>
            </div>
          ))}
        </div>
        <span className="rating-text">
          {average.toFixed(1)} ({count})
        </span>
      </div>
    );
  };

  const renderTrendingSection = (title, items, type) => (
    <>
      <h1 className="headinghome">{title}</h1>
      <div className="trending-container">
        <div className="trending-scroll">
          {items.map((item) => (
            <div
              key={item.id}
              className="card"
              onClick={() => handleImageClick(item, type)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                alt={item.title || item.name}
                className="image"
              />
              <p className="title">{item.title || item.name}</p>
              {isLoggedIn && renderStars(item.id)}
            </div>
          ))}
        </div>
      </div>
    </>
  );
   

  return (
    <div className="home-container">
      {isLoggedIn && (
        <div className="navbar-fixed">
          <Navbar onLogout={handleLogout} />
          <Navbar1 onLogout={handleLogout} />
        </div>
      )}

      <div className="topbar">
        <h2 className="logo">Movie Rating App</h2>
        {isLoggedIn ? (
          <span className="welcome">Welcome, {username}</span>
        ) : (
          <button className="loginButton" onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </div>

      {isLoggedIn && 
           <span className="welcomet">Welcome, {username}</span>
        }

      {renderTrendingSection("### Trending Movies Worldwide", trendingMovies, "Movie")}
      { renderTrendingSection("##### Trending TV Shows Worldwide", trendingTVShows, "TV Show")}
      { renderTrendingSection("# Trending Movies in India", countryMovies, "Movie")}
      { renderTrendingSection("### Trending TV Shows in India", countryTVShows, "TV Show")}
      {isLoggedIn && Object.keys(recommendations).length > 0 && (
        <>
        <h1 className="headingfriend">Recommendations</h1>
      <div className="recommendation-container">
        {Object.entries(recommendations).map(([friendId, { username, profile_picture, items }]) => (
          <div
            key={friendId}
            className="recommendation-summary"
            onClick={() => navigate(`/recommendations/${friendId}`)}
          >
            <div className="friend-header">
              <img
                src={profile_picture || "/default-avatar.png"}
                alt={`${username}'s profile`}
                className="friend-avatar"
              />
              <div>
                <h2 >
                  {username} - {items.length} Recommendation{items.length !== 1 ? 's' : ''}
                </h2>
              </div>
            </div>
          </div>
        ))}
      </div>
        </>
      )}
    </div>


  );
};

export default Home;