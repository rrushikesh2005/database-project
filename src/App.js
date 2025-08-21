import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/Notfound";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";
import Books from "./pages/Books";
import Watchlist from "./pages/Watchlist";
import Details from "./pages/Details";
import Friends from "./pages/Friends";
import Profile from "./pages/Profile"
import Followers from "./pages/Followers"
import Following from "./pages/following"
import Notifications from "./pages/Notifications"
import Friends1 from "./pages/Friends1"
import Profile1 from "./pages/Profile1"
import Recommendations from "./pages/Recommendations"
import Genres from "./pages/Genres"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/tvshows" element={<TVShows />} />
      <Route path="/books" element={<Books />} />
      <Route path="/watchlist" element={<Watchlist />} /> {/* Add Watchlist route */}
      <Route path="/details/:category/:itemId" element={<Details />} />
      <Route path="/Friends" element={<Friends />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/followers" element={<Followers />} />
      <Route path="/following" element={<Following />} />
      <Route path="/profile1/:username" element={<Profile1 />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path = "/recommendations/:username" element = {<Recommendations />} />
      <Route path="/friends1" element={<Friends1 />} />
      <Route path="/genres/:genreId" element={<Genres />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;