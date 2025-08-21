import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config/config";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
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
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        navigate("/");
      }
    };

    checkLoginStatus();
  }, [navigate]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${apiUrl}/list-notifications`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setNotifications(data.result);
        } else {
          console.error("Failed to fetch notifications:", data.message);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchNotifications();
    }
  }, [isLoggedIn]);

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

  const handleAction = async (senderId, action) => {
    try {
      const response = await fetch(`${apiUrl}/friend-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ senderId, action }),  // Sending action along with senderId
      });

      const data = await response.json();
      if (response.ok) {
        // Remove the handled notification
        setNotifications((prev) =>
          prev.filter((n) => n.sender_id !== senderId || n.type !== "friend_request")
        );
      } else {
        alert(data.message || "Failed to process request");
      }
    } catch (error) {
      console.error(`Error handling ${action}:`, error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
        
      const response = await fetch(`${apiUrl}/delete-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ notificationId }),
      });

      const data = await response.json();
      if (response.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      } else {
        alert(data.message || "Failed to delete notification");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleClearAll = async () => {
    try {
      const response = await fetch(`${apiUrl}/clear-all-notifications`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        setNotifications([]);  // Clear all notifications from the state
      } else {
        alert(data.message || "Failed to clear notifications");
      }
    } catch (error) {
      console.error("Error clearing all notifications:", error);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div>
      <div className="navbar-fixed">
        <Navbar onLogout={handleLogout} />
      </div>

      <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem", fontFamily: "Arial" }}>
        <h2>Notifications</h2>
        {loading ? (
          <p>Loading...</p>
        ) : notifications.length === 0 ? (
          <p>No notifications.</p>
        ) : (
          <div>
            <button
              onClick={handleClearAll}
              style={{
                padding: "10px 20px",
                marginBottom: "20px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Clear All
            </button>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {notifications.map((notification) => (
                <li
                  key={notification.notification_id}
                  style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}
                >
                  <strong>{notification.sender_username || "System"}:</strong> {notification.message}
                  <div style={{ fontSize: "0.85em", color: "#555" }}>
                    {new Date(notification.created_at).toLocaleString()}
                  </div>

                  {notification.type === "friend_request" && (
                    <div style={{ marginTop: "8px" }}>
                      <button
                        onClick={() => handleAction(notification.sender_id, "accept")}
                        style={{ marginRight: "10px", padding: "5px 10px" }}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleAction(notification.sender_id, "reject")}
                        style={{ padding: "5px 10px", backgroundColor: "#f44336", color: "white" }}
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => handleDeleteNotification(notification.id)}
                    style={{
                      marginTop: "8px",
                      padding: "5px 10px",
                      backgroundColor: "#e0e0e0",
                      color: "#555",
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
