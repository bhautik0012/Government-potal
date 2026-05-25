import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (response.status === 201) {
        alert("Account Created! Please Login.");
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    }
  };

  const styles = {
    page: {
      background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "'Poppins', sans-serif",
      padding: "20px"
    },
    glassCard: {
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      padding: "40px",
      borderRadius: "30px",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      width: "100%",
      maxWidth: "450px",
      textAlign: "center"
    },
    input: {
      width: "100%",
      padding: "12px 15px",
      margin: "8px 0 15px 0",
      borderRadius: "10px",
      border: "1px solid #cbd5e1",
      outline: "none",
      fontSize: "15px",
      boxSizing: "border-box"
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
      marginTop: "10px",
      transition: "0.3s"
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.glassCard}>
        <h2 style={{ color: "#1e3a8a", marginBottom: "5px" }}>Create Account</h2>
        <p style={{ color: "#64748b", marginBottom: "25px", fontSize: "14px" }}>
          Join the official portal to access 1200+ schemes.
        </p>

        {error && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "10px" }}>{error}</p>}

        <form onSubmit={handleRegister}>
          <div style={{ textAlign: "left" }}>
            <label style={{ fontSize: "13px", fontWeight: "600" }}>Full Name</label>
            <input
              style={styles.input}
              name="name"
              type="text"
              placeholder="Enter your full name"
              onChange={handleChange}
              required
            />

            <label style={{ fontSize: "13px", fontWeight: "600" }}>Email Address</label>
            <input
              style={styles.input}
              name="email"
              type="email"
              placeholder="name@example.com"
              onChange={handleChange}
              required
            />

            <label style={{ fontSize: "13px", fontWeight: "600" }}>Create Password</label>
            <input
              style={styles.input}
              name="password"
              type="password"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />

            <label style={{ fontSize: "13px", fontWeight: "600" }}>Confirm Password</label>
            <input
              style={styles.input}
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            style={styles.button}
            onMouseOver={(e) => e.target.style.background = "#1d4ed8"}
            onMouseOut={(e) => e.target.style.background = "#2563eb"}
          >
            Create Citizen Account
          </button>
        </form>

        <div style={{ marginTop: "20px", fontSize: "14px", color: "#64748b" }}>
          Already registered? <Link to="/login" style={{ color: "#2563eb", fontWeight: "600", textDecoration: "none" }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;