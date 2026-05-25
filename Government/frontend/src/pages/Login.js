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

  const styles = {
    page: {
      background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "'Poppins', sans-serif",
    },
    glassCard: {
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      padding: "50px",
      borderRadius: "30px",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      width: "100%",
      maxWidth: "400px",
      textAlign: "center",
    },
    input: {
      width: "100%",
      padding: "15px",
      margin: "10px 0",
      borderRadius: "12px",
      border: "1px solid #cbd5e1",
      outline: "none",
      fontSize: "16px",
      boxSizing: "border-box",
    },
    button: {
      width: "100%",
      padding: "15px",
      background: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: "12px",
      fontWeight: "bold",
      fontSize: "16px",
      cursor: "pointer",
      marginTop: "20px",
      transition: "0.3s",
    },
    link: {
      color: "#2563eb",
      textDecoration: "none",
      fontWeight: "600",
      fontSize: "14px",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.glassCard}>
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
              style={styles.input}
              type="email"
              placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ textAlign: "left", marginTop: "10px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", marginLeft: "5px" }}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => (e.target.style.background = "#1d4ed8")}
            onMouseOut={(e) => (e.target.style.background = "#2563eb")}
          >
            Sign In
          </button>
        </form>

        <div style={{ marginTop: "25px", fontSize: "14px", color: "#64748b" }}>
          Don't have an account? <Link to="/register" style={styles.link}>Create One</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;