import React from "react";
import { Link } from "react-router-dom";

function SchemeCard({ scheme }) {
  const styles = {
    card: {
      background: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(10px)",
      padding: "25px",
      borderRadius: "20px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
      transition: "0.4s ease",
      border: "1px solid rgba(255,255,255,0.5)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
      cursor: "pointer",
    },
    badge: {
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "11px",
      fontWeight: "700",
      textTransform: "uppercase",
      background: "#dbeafe",
      color: "#2563eb",
      marginBottom: "12px",
      alignSelf: "flex-start"
    },
    title: {
      fontSize: "20px",
      color: "#0f172a",
      fontWeight: "700",
      marginBottom: "8px",
      fontFamily: "'Poppins', sans-serif"
    },
    ministry: {
      fontSize: "13px",
      color: "#64748b",
      fontWeight: "500",
      marginBottom: "12px",
      display: "flex",
      alignItems: "center",
      gap: "5px"
    },
    description: {
      fontSize: "14px",
      color: "#475569",
      lineHeight: "1.6",
      marginBottom: "20px"
    },
    button: {
      width: "100%",
      padding: "12px",
      background: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: "12px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "0.3s",
      textAlign: "center",
      textDecoration: "none",
      display: "block"
    }
  };

  return (
    <div 
      style={styles.card} 
      className="scheme-card-hover"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(37, 99, 235, 0.15)";
        e.currentTarget.style.borderColor = "#2563eb";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.05)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
      }}
    >
      <div>
        <span style={styles.badge}>{scheme.category || "General"}</span>
        <h3 style={styles.title}>{scheme.name}</h3>
        <div style={styles.ministry}>
          <i className="fa fa-building"></i> {scheme.ministry}
        </div>
        <p style={styles.description}>
          {scheme.description && scheme.description.length > 100 
            ? scheme.description.substring(0, 100) + "..." 
            : scheme.description}
        </p>
      </div>

      <Link to={`/scheme/${scheme.id}`} style={{ textDecoration: "none" }}>
        <button style={styles.button}>
          View Details <i className="fa fa-arrow-right" style={{ marginLeft: "8px", fontSize: "12px" }}></i>
        </button>
      </Link>
    </div>
  );
}

export default SchemeCard;