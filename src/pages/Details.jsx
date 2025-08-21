import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiUrl } from "../config/config";
import { useNavigate } from "react-router-dom";
import "../css/details.css";
import "../css/popup.css";
const default_addr = "data:image/png;base64,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";

const API_KEY = "d56001a69719feb96f51a1f8a93df1ac";

const Details = () => {
  const navigate = useNavigate();
  const { category, itemId } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [itemDetails, setItemDetails] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [ratingCount, setRatingCount] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [backdropImage, setBackdropImage] = useState(null);
  const [genres, setgenres] = useState([]);
  const [streamingProviders, setStreamingProviders] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [releaseDate, setReleaseDate] = useState(null)
  const [certification, setCertification] = useState(null);
  const [mark, setMark] = useState(false);
  const [watchlist, setWatchlist] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);

  useEffect(() => {
      const checkLoginStatus = async () => {
        try {
          const response = await fetch(`${apiUrl}/isLoggedIn`, {
            method: "GET",
            credentials: "include",
          });
          const data = await response.json();
          setIsLoggedIn(data.loggedIn);
        } catch (error) {
          console.error("Error checking login status:", error);
        }
      };
      checkLoginStatus();
    }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/items/${category}/${itemId}/reviews`, {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) setReviews(data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const fetchUserRating = async () => {
    if(!isLoggedIn) return;
    try {
      const response = await fetch(`${apiUrl}/api/items/${category}/${itemId}/user-rating`, {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok && data.userRating !== null) {
        setUserRating(data.userRating);
      }
    } catch (error) {
      console.error("Error fetching user rating:", error);
    }
  };

  const fetchAverageRating = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/items/${category}/${itemId}/average-rating`, {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setAverageRating(data.averageRating);
        setRatingCount(data.ratingCount);
      }
    } catch (error) {
      console.error("Error fetching average rating:", error);
      setAverageRating(null);
      setRatingCount(0);
    }
  };

  const fetchRatingDistribution = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/items/${category}/${itemId}/rating-counts`, {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setRatingDistribution({
          5: data.fiveStarCount,
          4: data.fourStarCount,
          3: data.threeStarCount,
          2: data.twoStarCount,
          1: data.oneStarCount,
        });
      }
    } catch (error) {
      console.error("Error fetching rating distribution:", error);
    }
  };

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/items/${category}/${itemId}`, {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {setItemDetails(data);}
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    };

    fetchItemDetails();
    fetchAverageRating();
    fetchRatingDistribution(); // Fetch rating distribution
    fetchReviews();
    fetchUserRating();
  }, [itemId, category]);

  useEffect(() => {
    const fetchDetailsFromTmdb = async () => {
      if (category === "Book") {
        setgenres([]);
        setBackdropImage(`https://covers.openlibrary.org/b/id/${itemId}-L.jpg`);
        return;
      }
  
      try {
        const endpoint = category === "Movie"
          ? `https://api.themoviedb.org/3/movie/${itemId}`
          : `https://api.themoviedb.org/3/tv/${itemId}`;
        const response = await fetch(`${endpoint}?api_key=${API_KEY}`);
        const data = await response.json();
  
        if (response.ok) {
          setgenres(data.genres);
          handleGenres(data, category);
          if (data.backdrop_path)
            setBackdropImage(`https://image.tmdb.org/t/p/original${data.backdrop_path}`);
        }
      } catch (error) {
        console.error("Error fetching TMDB details:", error);
      }
    };
  
    fetchDetailsFromTmdb();
  }, [itemId, category]);  

  useEffect(() => {
    const fetchTrailer = async () => {
      if (category === "Book") return; // No trailer for books
  
      try {
        const endpoint = category === "Movie"
          ? `https://api.themoviedb.org/3/movie/${itemId}/videos`
          : `https://api.themoviedb.org/3/tv/${itemId}/videos`;
        const response = await fetch(`${endpoint}?api_key=${API_KEY}`);
        const data = await response.json();
  
        if (response.ok && data.results && data.results.length > 0) {
          const trailer = data.results.find(
            (video) => video.type === "Trailer" && video.site === "YouTube"
          );
          const teaser = data.results.find(
            (video) => video.type === "Teaser" && video.site === "YouTube"
          );
          const fallbackVideo = data.results.length > 0 ? data.results[0] : null;
          if (trailer) {
            setTrailerKey(trailer.key);
          }
          else if(teaser){
            setTrailerKey(teaser.key);
          }
          else if(fallbackVideo){
            setTrailerKey(fallbackVideo.key);
          }
        }
      } catch (error) {
        console.error("Error fetching trailer:", error);
      }
    };
  
    fetchTrailer();
  }, [itemId, category]);  

  useEffect(() => {
    const fetchTmdbCredits = async () => {
      try {
          let endpoint = '';
          if(category === "Movie"){
            endpoint = `https://api.themoviedb.org/3/movie/${itemId}/credits`;
          }
          else{
            endpoint = `https://api.themoviedb.org/3/tv/${itemId}/credits`;
          }
    
        const response = await fetch(`${endpoint}?api_key=${API_KEY}`);
        const data = await response.json();
    
        if (response.ok) {
          setCast(data.cast || []);
          setCrew(data.crew || []);
        }
        else{
          console.error("Failed to fetch cast and crew: ", response.statusText);
          return;
        }
      } catch (error) {
        console.error("Error fetching cast and crew: ", error);
      }
    };
    
    fetchTmdbCredits();
  }, [itemId, category]);

  useEffect(() => {
    const fetchStreamingProviders = async () => {
      try {
        let endpoint = '';
        if (category === "Movie") {
          endpoint = `https://api.themoviedb.org/3/movie/${itemId}/watch/providers`;
        } else if (category === "TV Show") {
          endpoint = `https://api.themoviedb.org/3/tv/${itemId}/watch/providers`;
        }
    
        if (endpoint) {
          const response = await fetch(`${endpoint}?api_key=${API_KEY}`);
          const data = await response.json();
    
          if (response.ok && data.results && data.results.IN && data.results.IN.flatrate) {
            setStreamingProviders(data.results.IN.flatrate);
          } else {
            setStreamingProviders([]);
          }
        }
      } catch (error) {
        console.error("Error fetching streaming providers:", error);
      }
    };
    
    fetchStreamingProviders();    
  }, [itemId, category]);

  useEffect(() => {
    const fetchCertification = async () => {
      if (category === "Book") return;

      try {
        let endpoint = '';
        if(category === "Movie"){
          endpoint = `https://api.themoviedb.org/3/movie/${itemId}/release_dates`;
        }
        else{
          endpoint = `https://api.themoviedb.org/3/tv/${itemId}/first_air_dates`;
        }
        if(endpoint){
          const response = await fetch(`${endpoint}?api_key=${API_KEY}`);
          const data = await response.json();
          
          if (response.ok && data.results) {
            let cert = null, release_date = null;
            const release = data.results.find(r => r.iso_3166_1 === "IN") || data.results.find(r => r.iso_3166_1 === "US");
            if (release) {
              if (category === "Movie") {
                cert = release.release_dates[0]?.certification;
                release_date = release.release_dates[0]?.release_date;
                release_date = (release_date) ? release_date.split('T')[0] : 'Coming Soon';
              } else {
                cert = release.first_air_dates[0]?.certification;
                release_date = release.first_air_dates[0]?.first_air_date;
                release_date = (release_date) ? release_date.split('T')[0] : 'Coming Soon';
              }
              setCertification(cert);
              setReleaseDate(release_date);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching certification:", error);
      }
    };

    fetchCertification();
  }, [itemId, category]);

  useEffect(() => {
    const fetchUsers = async () => {

      try {
        const response = await fetch(
          `${apiUrl}/api/user/friends`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        // console.log("1",data.friends);
        setSearchResults(data.friends || []);
        // console.log("3", searchResults);
      } catch (error) {
        console.error("Error fetching friends: ", error);
      }
    };

    fetchUsers();
  }, []);

  const filterfriends = searchResults.filter((friend) => {
    return friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  });

  const handleGenres = async(item, category) => {
      try {
        const response = await fetch(`${apiUrl}/add-genres`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ id: item.id, category: category, genres: item.genres }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.message || "Failed to add movie");
        }
      } catch (error) {
        console.error("Error adding movie: ", error);
      }
    };

  const handleReviewSubmit = async () => {
    if(!isLoggedIn) {navigate(`/login`); return;}
    try {
      const response = await fetch(`${apiUrl}/add-review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ itemId, category, reviewText }),
      });

      if (response.ok) {
        alert("Review submitted!");
        setReviewText("");
        fetchReviews();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Error submitting review");
    }
  };

  const handleRatingSubmit = async () => {
    if(!isLoggedIn) {navigate(`/login`); return;}
    if (userRating < 1 || userRating > 5) {
      alert("Please select a rating between 1 and 5.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/rate-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ itemId, category, rating: userRating }),
      });

      if (response.ok) {
        alert("Rating submitted!");
        fetchAverageRating();
        fetchRatingDistribution(); // Update rating distribution after rating
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to submit rating");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Error submitting rating");
    }
  };

  const handleWatchlist = async (itemId, category, watchlist) => {
    if(!isLoggedIn) {navigate(`/login`); return;}
    try {
      const response = await fetch(`${apiUrl}/watchlist?itemId=${itemId}&category=${category}&watchlist=${watchlist}`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setWatchlist(data.watchlist);
        if(!watchlist){
          alert("Added to your watchlist!");
        }
        else{
          alert("Removed from your watchlist!");
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to add to watchlist");
      }
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      alert("Error adding to watchlist");
    }
  }

  const handleSuggestion = async (itemId, category) => {
    if(!isLoggedIn) {navigate(`/login`); return;}
    setShowPopup(true);
  }

  const handleClose = async () => {
    if(!isLoggedIn) return;
    try {
      setShowPopup(false);
    }
    catch(error){
      console.error("Error closing:", error);
      alert("Error closing");
    }
  }

  const handleMark = async (itemId, category, mark) => {
    if(!isLoggedIn) {navigate(`/login`); return;}
    try {
      const response = await fetch(`${apiUrl}/mark?itemId=${itemId}&category=${category}&mark=${mark}`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setMark(data.mark);
        if(!mark){
          alert("Marked successfully!");
        }
        else{
          alert("Unmarked successfully!");
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to mark");
      }
    } catch (error) {
      console.error("Error mark:", error);
      alert("Error marking");
    }
  }

  const sendSuggestionToFriend = async (itemId, category, friend, title) => {
    try {
      const response = await fetch(`${apiUrl}/suggest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ itemId, category, friend, title }),
      });

      if (response.ok) {
        alert("Suggested successfully!");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to suggest");
      }
    } catch (error) {
      console.error("Error suggesting:", error);
      alert("Error suggesting");
    }
  }

  const formattedRating =
    averageRating && !isNaN(averageRating) ? averageRating.toFixed(1) : "N/A";

  if (!itemDetails) return <p>Loading...</p>;

  const renderRatingBar = (star) => {
    const count = ratingDistribution[star];
    const percentage = ratingCount > 0 ? (count / ratingCount) * 100 : 0;
    return (
      <div className="rating-bar" key={star} style={{ margin: "5px 0" }}>
        <span style={{ width: "60px", display: "inline-block" }}>{star} stars</span>
        <div style={{ display: "inline-block", width: "60%", margin: "0 10px", background: "#e4e5e9", borderRadius: "5px" }}>
          <div
            style={{
              width: `${percentage}%`,
              background: "#f7931e",
              height: "10px",
              borderRadius: "5px",
            }}
          />
        </div>
        <span style={{ marginLeft: "5px" }}>{count} ({Math.round(percentage)}%)</span>
      </div>
    );
  };

  return (
    <div className="details-page-wrapper">
      { backdropImage && (
        <img 
          src={backdropImage} 
          alt={`${itemDetails.title} backdrop`} 
          className="backdrop-image"
        />
    )}

    <div className="details-container">
      <div className="details-image">
        <img src={itemDetails.image_url} alt={itemDetails.title} />
        {streamingProviders.length > 0 && (
          <div className="streaming-banner">
            <div className="streaming-logo">
            <img 
              src={`https://image.tmdb.org/t/p/w92${streamingProviders[0].logo_path}`} 
              alt={streamingProviders[0].provider_name}
            />
            </div>
            <div className="streaming-text">
              <span className="streamlabel">Now Streaming</span>
              {/* <span>{streamingProviders[0].provider_name}</span> */}
              <span>Watch Now</span>
            </div>
          </div>
        )}
        <div className="mark-container">
            {mark ? (
              <>
              <button 
                className="mark-button1"
                onClick={() => handleMark(itemId, category, mark)}
              >
                <svg className="mark-icon" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span>Mark as undone</span>
              </button>
              </>)
              : (
              <>
              <button 
                className="mark-button2"
                onClick={() => handleMark(itemId, category, mark)}
              >
                <svg className="mark-icon" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span>Mark as done</span>
              </button>
              </>)}
        </div>
        <div className="suggest-container">
          <button 
            className="suggest-button"
            onClick={() => handleSuggestion(itemId, category)}
          >
            <svg className="suggest-icon" viewBox="0 0 24 24">
            <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
            </svg>
            <span>Suggest to a friend</span>
          </button>
        </div>
        <div className="watchlist-button-container">
          {watchlist ? (
            <>
            <button 
              className="watchlist-button1"
              onClick={() => handleWatchlist(itemId, category, watchlist)}
            >
              <svg className="watchlist-icon" viewBox="0 0 24 24">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
              </svg>
              <span>Remove from your watchlist</span>
            </button>
            </>
          ) : (
            <>
            <button 
              className="watchlist-button2"
              onClick={() => handleWatchlist(itemId, category, watchlist)}
            >
              <svg className="watchlist-icon" viewBox="0 0 24 24">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
              </svg>
              <span>Add to your watchlist</span>
            </button>
            </>
          )}
        </div>
      </div>
      <div className="details-info">
        <h1>{itemDetails.title}</h1>
        {(certification || releaseDate) && (
          <div className="certification-release">
            {certification && (
              <div className="certification-box">
                <p className="certification">{certification}</p>
              </div>
            )}
            {releaseDate && (
              <p className="release-date">{releaseDate}</p>
            )}
          </div>
        )}
        <p>{itemDetails.description}</p>
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-box">
              <button className="close-btn" onClick={handleClose}>×</button>
              <h2>Suggest to a Friend</h2>
              <input
                type="text"
                className="search-barp"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {filterfriends.length === 0 ? (
                <p>No matching friends found.</p>
              ) : (
                <ul>
                  {filterfriends.map((friend, index) => (
                    <li
                      key={index}
                      className={`friend-card ${selectedFriends.some(f => f.username === friend.username) ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedFriends((prevSelected) => {
                          if (prevSelected.some(f => f.username === friend.username)) {
                            return prevSelected.filter(f => f.username !== friend.username);
                          } else {
                            return [...prevSelected, friend];
                          }
                        });
                      }}                      
                    >
                      <img
                        src={friend.profile_picture || default_addr}
                        alt={`${friend.username}'s profile`}
                        className="friend-profile-pic"
                        onError={(e) => (e.target.src = default_addr)}
                      />
                      <span className="friend-username">{friend.username}</span>
                    </li>
                  ))}
                </ul>
              )}
              <button
                className="send-btn"
                onClick={() => {
                  if (selectedFriends.length > 0) {
                    selectedFriends.forEach(friend => {
                      sendSuggestionToFriend(itemId, category, friend, itemDetails.title);
                    });
                    handleClose();
                  } else {
                    alert('Please select at least one friend.');
                  }
                }}
              >
                Send Suggestion
              </button>
            </div>
          </div>
        )}
        {genres.length > 0 && (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5em", marginTop: "1em" }}>
    {genres.map((genre) => (
          <span 
            key={genre.id} 
            onClick={() => navigate(`/genres/${genre.id}`)}  // ✅ navigate on click
            style={{ 
              padding: "0.3em 0.75em", 
              backgroundColor: "red", 
              borderRadius: "20px", 
              fontSize: "1em",
              color: "white",
              cursor: "pointer", // ✅ show pointer on hover
              transition: "background-color 0.2s ease"
            }}
            onMouseOver={e => e.target.style.backgroundColor = "#b30000"}
            onMouseOut={e => e.target.style.backgroundColor = "red"}
          >
            {genre.name}
          </span>
        ))}
      </div>
    )}

        {trailerKey && (
          <div className="trailer-container" style={{ margin: "1em 0" }}>
            <div className="trailer-video" style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title="Trailer"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {averageRating !== null && (
          <>
            <div className="rating-stars">
              <div className="stars-background">
                {"★★★★★"}
                <div
                  className="stars-foreground"
                  style={{ width: `${(averageRating / 5) * 100}%` }}
                >
                  {"★★★★★"}
                </div>
              </div>
              <span className="numeric-rating">
                {formattedRating} ({ratingCount} {ratingCount === 1 ? "rating" : "ratings"})
              </span>
            </div>

            {/* Rating breakdown */}
            <div className="rating-breakdown" style={{ marginTop: "1em" }}>
              { [5, 4, 3, 2, 1].map(renderRatingBar) }
            </div>
          </>
        )}

        {/* User rating section */}
        <div className="user-rating-section" style={{ marginTop: "1em" }}>
          <h3>Your Rating</h3>
          <div style={{ fontSize: "2rem", cursor: "pointer" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => (isLoggedIn)?setUserRating(star):setUserRating(star)}
                style={{
                  color: star <= userRating ? "#ffc107" : "#e4e5e9",
                  transition: "color 200ms",
                }}
              >
                ★
              </span>
            ))}
          </div>
          <button onClick={handleRatingSubmit} style={{ marginTop: "0.5em" }}>
            Submit Rating
          </button>
        </div>

        <div className="cast-crew-section">
          {cast.length > 0 && (
            <>
              <h1>Cast</h1>
              <div className="cast-container">
                {cast.slice(0, 10).map((member) => (
                  <div className="cast-member" key={member.id}>
                    {member.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                        alt={member.name}
                      />
                    ) : (
                      <div className="no-image">No photo</div>
                    )}
                    <div>
                      <p style={{marginBottom: '-0.5em'}} ><strong>{member.name}</strong></p>
                      <p><span>{member.character || member.roles?.[0]?.character || "Unknown"}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {crew.length > 0 && (
            <>
              <h1>Crew</h1>
              <div className="crew-container">
                {crew
                  .filter((person) =>
                    ["Director", "Writer", "Executive Producer", "Producer"].includes(person.job)
                  )
                  .map((person) => (
                    <div className="crew-member" key={person.id}>
                      {person.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                          alt={person.name}
                        />
                      ) : (
                        <div className="no-image">No photo</div>
                      )}
                      <div>
                        <p style={{marginBottom: '-0.5em'}} ><strong>{person.name}</strong></p>
                        <p style={{marginBottom: '-0.75em'}} ><span>{person.job}</span></p>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>

        <div className="review-section">
        <textarea
          placeholder={reviewText === "" && !document.activeElement.matches('textarea') ? "Write your review here..." : ""}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          onFocus={(e) => e.target.placeholder = ""}
          onBlur={(e) => { if (reviewText.trim() === "") e.target.placeholder = "Write your review here..."; }}
          rows={4}
          style={{ width: "100%", marginTop: "1em" }}
        />

          <button onClick={handleReviewSubmit} style={{ marginTop: "0.75em" }}>
            Submit Review
          </button>
        </div>

        {reviews.length > 0 ? (
          <div className="existing-reviews">
            <h3 style={{ marginTop: "1em" }}>User Reviews</h3>
            <ul>
              {(showAllReviews ? reviews : [reviews[0]]).map((review, index) => (
                <li key={index} style={{ marginBottom: "1em" }}>
                  <strong>{review.username}</strong> <br />
                  <span>{review.review_text}</span> <br />
                  <small>{new Date(review.reviewed_at).toLocaleString()}</small>
                </li>
              ))}
            </ul>
            {reviews.length > 1 && (
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                style={{
                  marginTop: "0.5em",
                  background: "none",
                  border: "none",
                  color: "#007BFF",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                {showAllReviews ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        ) : (
          <p style={{ marginTop: "1em" }}>No reviews yet.</p>
        )}
      </div>
    </div>
    </div>
  );
};



export default Details;
