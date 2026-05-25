import React, { useState } from "react";
import { api } from "../config/api";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    
    try {
      const response = await api.post("/api/login", {
        email,
        password
      });

      if (response.status === 200) {
        // 1. Save data to localStorage (This unlocks the ProtectedRoutes)
        localStorage.setItem("userEmail", response.data.email);
        localStorage.setItem("userName", response.data.name);
        localStorage.setItem("userRole", response.data.role);

        // 2. Decide where to go (Only navigate ONCE)
        if (response.data.role === "admin") {
          alert("Welcome, Officer " + response.data.name);
          navigate("/admin/dashboard");
        } else {
          alert("Login Successful!");
          navigate("/dashboard");
        }
      }
    } catch (err) {
      setError("Invalid Credentials. Please try again.");
      alert("Invalid Credentials. Please try again.");
    }
  };

  return (
    <div className="page-center" style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)", fontFamily: "'Poppins', sans-serif" }}>
      <div className="auth-card" style={{ textAlign: "center" }}>
        <div style={{ fontSize: "40px", color: "#2563eb", marginBottom: "10px" }}>
          <i className="fa fa-user-circle"></i>
        </div>
        <h2 style={{ color: "#1e3a8a", marginBottom: "5px" }}>Welcome Back</h2>
        <p style={{ color: "#64748b", marginBottom: "30px", fontSize: "14px" }}>
          Login to access your government dashboard.
        </p>

        {/* Display Error Message if it exists */}
        {error && (
          <p style={{ color: "#ef4444", fontSize: "14px", marginBottom: "15px", background: "#fee2e2", padding: "10px", borderRadius: "8px" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ textAlign: "left" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", marginLeft: "5px" }}>Email Address</label>
            <input
              className="input"
              type="email"
              placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ textAlign: "left", marginTop: "10px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", marginLeft: "5px" }}>Password</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: "1.25rem" }}>
            Sign In
          </button>
        </form>

        <div style={{ marginTop: "25px", fontSize: "14px", color: "#64748b" }}>
          Don't have an account? <Link to="/register" style={{ color: "#2563eb", fontWeight: 600 }}>Create One</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;