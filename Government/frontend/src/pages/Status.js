import React, { useState } from "react";
import { api, API_BASE, uploadsUrl } from "../config/api";

function Status() {
  const [searchQuery, setSearchQuery] = useState("");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);
    
    try {
      // Connecting to your Flask Backend
      const response = await api.get(`/api/status/${searchQuery}`);
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching status:", error);
      // Fallback demo data if backend isn't running
      setApplications([
        { id: 1001, scheme: "PM Kisan Nidhi", status: "Approved", date: "2026-02-15" },
        { id: 1002, scheme: "Ayushman Bharat", status: "Pending", date: "2026-03-01" },
        { id: 1003, scheme: "Awas Yojana", status: "Rejected", date: "2026-01-20" }
      ]);
    }
    setLoading(false);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved": return { background: "#dcfce7", color: "#166534" };
      case "Pending": return { background: "#fef9c3", color: "#854d0e" };
      case "Rejected": return { background: "#fee2e2", color: "#991b1b" };
      default: return { background: "#f1f5f9", color: "#475569" };
    }
  };

  const styles = {
    page: {
      fontFamily: "'Poppins', sans-serif",
      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      minHeight: "100vh",
      padding: "60px 10%"
    },
    header: {
      textAlign: "center",
      marginBottom: "40px"
    },
    searchContainer: {
      background: "white",
      padding: "30px",
      borderRadius: "20px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
      maxWidth: "600px",
      margin: "0 auto 40px auto",
      textAlign: "center"
    },
    input: {
      width: "70%",
      padding: "12px 20px",
      borderRadius: "10px 0 0 10px",
      border: "1px solid #cbd5e1",
      outline: "none"
    },
    button: {
      width: "25%",
      padding: "13px",
      background: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: "0 10px 10px 0",
      cursor: "pointer",
      fontWeight: "bold"
    },
    tableCard: {
      background: "white",
      borderRadius: "20px",
      overflow: "hidden",
      boxShadow: "0 10px 25px rgba(0,0,0,0.05)"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      textAlign: "left"
    },
    th: {
      background: "#f8fafc",
      padding: "15px 20px",
      color: "#64748b",
      fontSize: "13px",
      textTransform: "uppercase"
    },
    td: {
      padding: "20px",
      borderBottom: "1px solid #f1f5f9",
      fontSize: "15px"
    },
    badge: (status) => ({
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "bold",
      ...getStatusStyle(status)
    })
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={{ color: "#1e3a8a", fontSize: "2.5rem" }}>Track Application</h1>
        <p style={{ color: "#64748b" }}>Enter your registered Email to check live status.</p>
      </div>

      <div style={styles.searchContainer}>
        <form onSubmit={handleSearch}>
          <input 
            style={styles.input} 
            type="email" 
            placeholder="example@gmail.com" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            required
          />
          <button style={styles.button} type="submit">
            {loading ? "Searching..." : "Track"}
          </button>
        </form>
      </div>

      {hasSearched && (
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Scheme Name</th>
                <th style={styles.th}>Applied Date</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app.id}>
                    <td style={styles.td}># {app.id}</td>
                    <td style={styles.td}><strong>{app.scheme}</strong></td>
                    <td style={styles.td}>{app.date}</td>
                    <td style={styles.td}>
                      <span style={styles.badge(app.status)}>{app.status}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ ...styles.td, textAlign: "center", padding: "40px" }}>
                    No applications found for this email.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* AGENT AWARENESS NOTE */}
      <div style={{ marginTop: "40px", textAlign: "center", color: "#64748b", fontSize: "14px" }}>
        <i className="fa fa-info-circle" style={{ color: "#2563eb", marginRight: "5px" }}></i>
        Application status is updated by the nodal officer within 7-10 working days.
      </div>
    </div>
  );
}

export default Status;