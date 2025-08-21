import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Navbar1 from "../components/Navbar1";
import { apiUrl } from "../config/config";
import "../css/movies.css";

const dummyBooks = [
  { title: "Harry Potter", localImage: "/images/harry_potter.jpeg", cover_id: null, author: "J.K. Rowling" },
  { title: "Lord of the Rings", localImage: "/images/lordofrings.jpg", cover_id: null, author: "J.R.R. Tolkien" },
  { title: "Percy Jackson", localImage: "/images/percy_jackson.jpg", cover_id: null, author: "Rick Riordan" },
  { title: "Hunger Games", localImage: "/images/hunger_games.jpeg", cover_id: null, author: "Suzanne Collins" },
  { title: "The Alchemist", localImage: "/images/alchemist.jpeg", cover_id: null, author: "Paulo Coelho" },
];  

const Books = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState(dummyBooks);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true); // 🔹 Loading flag
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
        setLoading(false); // 🔹 Set loading false when done
      }
    };

    checkLoginStatus();
  }, []);


  useEffect(() => {
    const controller = new AbortController(); 
    const fetchBooks = async () => {
      // console.log("Running fetchBooks with query:", searchQuery); 
      if (searchQuery.trim() === "") {
        // console.log("Search empty. Setting dummy books.");
        setBooks(dummyBooks); // if you have dummy books
        return;
      }
    
      try {
        const response = await fetch(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}`,
          { signal: controller.signal }
        );
        const data = await response.json();
        const booksData = data.docs.slice(0, 10);
        const booksWithDescriptions = await Promise.all(
          booksData.map(async (book) => {
            let description = "";
            try {
              if (book.key) {
                const workResponse = await fetch(`https://openlibrary.org${book.key}.json`);
                const workData = await workResponse.json();
                description = typeof workData.description === 'string' ? workData.description : workData.description?.value || "";
              }
            } catch (err) {
              console.error("Error fetching book description:", err);
            }

            return {
              title: book.title,
              cover_id: book.cover_i,
              author: book.author_name ? book.author_name.join(", ") : "Unknown Author",
              description: description
            };
          })
        );
    
        setBooks(booksWithDescriptions);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };  

    fetchBooks();
    return () => {
      controller.abort();
    };
  }, [searchQuery]);

  const handleImageClick = async(item) => {
        try {
          const response = await fetch(`${apiUrl}/add-to-db`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ id: item.cover_id, title: item.title, category: 'Book', description: item.description, release_date: item.release_date, director: item.author, poster_path: item.cover_id }),
          });
    
          if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.message || "Failed to add movie");
          }
        } catch (error) {
          console.error("Error adding movie: ", error);
        }
        navigate(`/details/Book/${item.cover_id}`);
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

  // const filterBooks = () =>
  //   dummyBooks.filter((item) =>
  //     item.title.toLowerCase().startsWith(searchQuery.toLowerCase())
  //   );

  // 🔹 Show loading spinner or nothing until login status is known
  if (loading) return null;

  return (
    <div className="home-container">
      {isLoggedIn && (
        <div className="navbar-fixed">
          <Navbar onLogout={handleLogout} />
          <Navbar1 onLogout={handleLogout} />
        </div>
      )}

      <div className="topbar">
        <h2 className="logo">Books</h2>
        {!isLoggedIn && (
          <button className="loginButton" onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </div>

      <h1 className="heading">Explore Books</h1>
      <div className="search-bar-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search books..."
          value={searchQuery}
          onChange={(e) => {/* console.log("Search Query:", e.target.value); */ setSearchQuery(e.target.value);}}
        />
      </div>

      <div className="grid">
        {books.map((item, index) => (
          <div key={index} className="card">
            <img
              src={
                item.cover_id
                  ? `https://covers.openlibrary.org/b/id/${item.cover_id}-L.jpg`
                  : item.localImage || "/images/placeholder.png"
              }
              alt={item.title}
              className="image"
              onClick={() => handleImageClick(item)} 
              style={{ cursor: "pointer" }}
            />
            <p className="title">{item.title}</p>
            <p className="author">{item.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;
