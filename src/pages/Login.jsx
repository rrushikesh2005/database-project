import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { apiUrl } from "../config/config";
import "../css/login.css";

const Login = () => {
  const navigate = useNavigate(); // Use this to redirect users

  // useEffect checks if the user is already logged in
  // if already loggedIn then it will simply navigate to the dashboard
  // TODO: Implement the checkStatus function.
  useEffect(() => {
    const checkStatus = async () => {
      // Implement your logic here
      try {
        const response = await fetch(`${apiUrl}/isLoggedIn`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();

        if (response.status === 200) {
          // console.log("Already logged in. Redirecting to dashboard..."); // Debugging log
          navigate("/"); // Redirect if already logged in
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };
    checkStatus();
  }, [navigate]);

  // Read about useState to manage form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(""); // Added error state to handle login errors
  const [loading, setLoading] = useState(false); // Added loading state

  // TODO: This function handles input field changes
  const handleChange = (e) => {
    // Implement your logic here
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // TODO: Implement the login operation
  // This function should send form data to the server
  // and handle login success/failure responses.
  // Use the API you made for handling this.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Login response:", data); // Debugging log

      if (response.status === 200) {
        console.log("Login successful, redirecting..."); // Debugging log
        setTimeout(() => navigate("/"), 500); // Ensures session is fully stored
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // TODO: Use JSX to create a login form with input fields for:
  // - Email
  // - Password
  // - A submit button
  return (
    <div className="login-container">
      {/* Implement the form UI here */}
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        
          
          <input
            type="email"
            name="email"
            placeholder = "Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        
        
          
          <input
            type="password"
            name="password"
            placeholder = "Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>
        Don't have an account? <a href="/signup">Sign up here</a>
      </p>
    </div>
  );
};

export default Login;