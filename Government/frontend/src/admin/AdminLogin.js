import React, { useState, useEffect } from "react";
import { api, API_BASE, uploadsUrl } from "../config/api";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Clear any existing session when the admin arrives at the login page
  useEffect(() => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.type === "email" ? "email" : "password"]: e.target.value });
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/api/login", {
        email: formData.email,
        password: formData.password
      });

      if (response.data.role === "admin") {
        // Store session data
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("userName", response.data.name);
        
        // Success feedback then redirect
        setTimeout(() => navigate("/admin/dashboard"), 1000);
      } else {
        setError("Access Denied: Non-administrative account detected.");
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Administrative Credentials");
      setLoading(false);
    }
  };

  const styles = {
    page: {
      height: "100vh",
      background: "radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "'Poppins', sans-serif"
    },
    loginBox: {
      background: "rgba(30, 41, 59, 0.7)",
      backdropFilter: "blur(12px)",
      padding: "50px",
      borderRadius: "24px",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      width: "100%",
      maxWidth: "420px",
      textAlign: "center",
      border: "1px solid rgba(255, 255, 255, 0.1)"
    },
    input: {
      width: "100%",
      padding: "15px",
      margin: "12px 0",
      borderRadius: "10px",
      border: "1px solid #334155",
      background: "#0f172a",
      color: "white",
      outline: "none",
      fontSize: "15px",
      transition: "0.3s"
    },
    button: {
      width: "100%",
      padding: "16px",
      background: loading ? "#64748b" : "#38bdf8",
      color: "#0f172a",
      fontWeight: "800",
      border: "none",
      borderRadius: "12px",
      cursor: loading ? "not-allowed" : "pointer",
      marginTop: "20px",
      textTransform: "uppercase",
      letterSpacing: "1px",
      transition: "0.3s"
    },
    errorBox: {
      background: "rgba(239, 68, 68, 0.1)",
      color: "#f87171",
      padding: "10px",
      borderRadius: "8px",
      fontSize: "13px",
      marginBottom: "15px",
      border: "1px solid rgba(239, 68, 68, 0.2)"
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.loginBox}>
        <div style={{ fontSize: "60px", color: "#38bdf8", marginBottom: "15px" }}>
          <i className={`fa ${loading ? "fa-circle-notch fa-spin" : "fa-user-shield"}`}></i>
        </div>
        <h2 style={{ color: "white", fontSize: "24px", marginBottom: "5px" }}>Secure Gateway</h2>
        <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "30px" }}>Government Officer Authentication</p>
        
        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleAdminLogin}>
          <div style={{ textAlign: "left" }}>
            <label style={{ color: "#cbd5e1", fontSize: "12px", marginLeft: "5px" }}>OFFICIAL EMAIL</label>
            <input 
              type="email" 
              placeholder="admin@gov.in" 
              style={styles.input} 
              onChange={handleChange}
              onFocus={(e) => e.target.style.borderColor = "#38bdf8"}
              onBlur={(e) => e.target.style.borderColor = "#334155"}
              required
            />
          </div>

          <div style={{ textAlign: "left", marginTop: "10px" }}>
            <label style={{ color: "#cbd5e1", fontSize: "12px", marginLeft: "5px" }}>SECURITY PASSCODE</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              style={styles.input} 
              onChange={handleChange}
              onFocus={(e) => e.target.style.borderColor = "#38bdf8"}
              onBlur={(e) => e.target.style.borderColor = "#334155"}
              required
            />
          </div>

          <button 
            type="submit" 
            style={styles.button}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Authenticate Access"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;