import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../config/api";

function SchemeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Use localhost instead of 127.0.0.1 if you face CORS issues
    api.get(`/api/schemes/${id}`)
      .then(res => {
        setScheme(res.data);
        setLoading(false);
        setError(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  // 1. LOADING STATE
  if (loading) return (
    <div style={{ padding: "100px", textAlign: "center", fontFamily: "Poppins" }}>
      <div className="spinner"></div>
      <p style={{ marginTop: "20px", color: "#1e3a8a", fontWeight: "bold" }}>Fetching Scheme Details...</p>
    </div>
  );

  // 2. ERROR STATE
  if (error || !scheme) return (
    <div style={{ padding: "100px", textAlign: "center", fontFamily: "Poppins" }}>
      <h2 style={{ color: "#ef4444" }}>Oops! Scheme Not Found</h2>
      <p style={{ color: "#64748b" }}>The scheme ID <strong>{id}</strong> might have been removed or updated.</p>
      <button 
        onClick={() => navigate("/schemes")} 
        style={{ marginTop: "20px", padding: "10px 20px", background: "#1e3a8a", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
      >
        Back to Schemes List
      </button>
    </div>
  );

  const styles = {
    container: { maxWidth: "1000px", margin: "40px auto", padding: "20px", fontFamily: "'Poppins', sans-serif" },
    headerBox: { background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)", color: "white", padding: "40px", borderRadius: "24px", marginBottom: "30px", boxShadow: "0 15px 30px rgba(30, 58, 138, 0.2)" },
    infoSection: { background: "white", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", marginBottom: "20px", border: "1px solid #f1f5f9" },
    aiCard: { background: "#f0f9ff", border: "1px solid #bae6fd", padding: "25px", borderRadius: "20px", marginBottom: "30px", position: "relative", overflow: "hidden" },
    label: { color: "#1e3a8a", fontWeight: "bold", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px", display: "block" },
    badge: { background: "rgba(255,255,255,0.2)", color: "white", padding: "6px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", backdropFilter: "blur(5px)" },
    applyBtn: { width: "100%", padding: "20px", background: "#10b981", color: "white", border: "none", borderRadius: "15px", fontSize: "18px", fontWeight: "bold", cursor: "pointer", marginTop: "10px", boxShadow: "0 10px 20px rgba(16, 185, 129, 0.3)", transition: "0.3s" },
    aiSparkle: { position: "absolute", top: "15px", right: "20px", fontSize: "20px" }
  };

  return (
    <div style={styles.container}>
      {/* TOP HEADER */}
      <div style={styles.headerBox}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ opacity: 0.9, marginBottom: "8px", fontSize: "14px" }}>{scheme.ministry || "Government of India"}</p>
            <h1 style={{ fontSize: "36px", fontWeight: "800", margin: 0, lineHeight: "1.2" }}>{scheme.name}</h1>
          </div>
          <span style={styles.badge}>{scheme.category}</span>
        </div>
      </div>

      {/* AI SUMMARY FACILITY */}
      <div style={styles.aiCard}>
        <div style={styles.aiSparkle}>✨</div>
        <span style={{ ...styles.label, color: "#0369a1" }}>AI Smart Summary</span>
        <h4 style={{ margin: "0 0 15px 0", color: "#0c4a6e" }}>Key Highlights for you:</h4>
        <ul style={{ color: "#0c4a6e", fontSize: "14px", lineHeight: "1.8", paddingLeft: "20px" }}>
          <li><strong>Benefit:</strong> Targeted support for {scheme.category?.toLowerCase() || "eligible"} individuals.</li>
          <li><strong>Fast Action:</strong> Application process is fully digital via this portal.</li>
          <li><strong>Documents:</strong> Primarily requires {scheme.documents ? scheme.documents.split(',')[0] : "ID Proof"} to begin.</li>
        </ul>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "25px" }}>
        <div>
          <div style={styles.infoSection}>
            <span style={styles.label}>Detailed Description</span>
            <p style={{ color: "#475569", lineHeight: "1.7", margin: 0 }}>{scheme.description}</p>
          </div>

          <div style={styles.infoSection}>
            <span style={styles.label}>Eligibility Criteria</span>
            <p style={{ color: "#475569", lineHeight: "1.7", margin: 0 }}>{scheme.eligibility}</p>
          </div>
        </div>

        <div>
          <div style={{ ...styles.infoSection, textAlign: "center", border: "2px solid #fee2e2" }}>
            <span style={styles.label}>Application Deadline</span>
            <h2 style={{ color: "#ef4444", fontSize: "28px", margin: "10px 0" }}>{scheme.deadline || "Open Always"}</h2>
            <p style={{ fontSize: "12px", color: "#94a3b8" }}>{scheme.deadline ? "Hurry! Limited time remaining." : "Continuous applications accepted."}</p>
          </div>

          <div style={styles.infoSection}>
            <span style={styles.label}>Required Documents</span>
            <ul style={{ color: "#475569", paddingLeft: "18px", margin: 0, fontSize: "14px" }}>
              {scheme.documents ? scheme.documents.split(',').map((doc, i) => (
                <li key={i} style={{ marginBottom: "8px" }}>{doc.trim()}</li>
              )) : <li>Standard ID & Income Proof</li>}
            </ul>
          </div>
        </div>
      </div>

      <div style={styles.infoSection}>
        <span style={styles.label}>How to Apply</span>
        <div style={{ color: "#475569", lineHeight: "1.7", whiteSpace: "pre-line" }}>
          {scheme.how_to_apply || "1. Review eligibility\n2. Gather documents\n3. Click Apply Now below"}
        </div>
      </div>

      <button 
        style={styles.applyBtn} 
        onMouseOver={(e) => e.target.style.transform = "scale(1.02)"}
        onMouseOut={(e) => e.target.style.transform = "scale(1)"}
        onClick={() => navigate("/apply", { state: { preSelectedScheme: scheme.name } })}
      >
        Apply for this Scheme
      </button>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={() => navigate("/schemes")} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", textDecoration: "underline", fontSize: "14px" }}>
          Explore more schemes
        </button>
      </div>
    </div>
  );
}

export default SchemeDetails;