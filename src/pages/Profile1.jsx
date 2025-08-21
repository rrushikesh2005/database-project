import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiUrl } from "../config/config";
import "../css/profile.css";

const default_addr = "data:image/png;base64,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";

const Profile1 = () => {
  const { username } = useParams(); // Get username from URL
  console.log("enteref profile1.jsx with username :",username);
  const [stats, setStats] = useState({
    followers: 0,
    following: 0,
    itemsRated: 0,
    reviewsGiven: 0,
  });
  const [profilePic, setProfilePic] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/user/${username}/stats`, {
          credentials: "include",
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Stats fetch error:", err);
      }
    };

    const fetchProfilePicture = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/user/${username}/profile-picture`, {
          credentials: "include",
        });
        const data = await res.json();
        setProfilePic(data.profile_picture || default_addr);
      } catch (err) {
        console.error("Profile pic fetch error:", err);
        setProfilePic(default_addr);
      }
    };

    if (username) {
      fetchStats();
      fetchProfilePicture();
    }
  }, [username]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("username", username);

    try {
      const res = await fetch(`${apiUrl}/api/user/upload-profile-picture`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setProfilePic(data.imageUrl);
        alert("Profile picture updated!");
      } else {
        alert("Upload failed.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload error.");
    }
  };

//   const isDefault = profilePic === default_addr;

  return (
    <div className="home-container">
      <div className="topbar">
        <h2 className="logo">Your Profile</h2>
      </div>

      <h1 className="heading">Welcome, {username}</h1>

      <div className="profile-container">
        <div className="profile-pic-container">
          <img src={profilePic} alt="Profile" className="profile-pic" />
          {/* <button
            className={`edit-icon ${isDefault ? "plus" : "pen"}`}
            onClick={() => fileInputRef.current.click()}
          >
            {isDefault ? "+" : "🖉"}
          </button> */}
          {/* <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden-file-input"
          /> */}
        </div>

        <div className="profile-info">
          <div className="profile-stats-container">
            <div className="stat-box" onClick={() => navigate("/followers")}>
              <div className="stat-number">{stats.followers}</div>
              <div className="stat-label">Followers</div>
            </div>
            <div className="stat-box" onClick={() => navigate("/following")}>
              <div className="stat-number">{stats.following}</div>
              <div className="stat-label">Following</div>
            </div>
            <div className="stat-box" onClick={() => navigate("/ratings")}>
              <div className="stat-number">{stats.itemsRated}</div>
              <div className="stat-label">Items Rated</div>
            </div>
            <div className="stat-box" onClick={() => navigate("/reviews")}>
              <div className="stat-number">{stats.reviewsGiven}</div>
              <div className="stat-label">Reviews Given</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile1;
