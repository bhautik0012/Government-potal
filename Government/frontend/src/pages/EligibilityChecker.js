import React, { useState } from "react";
import { api, API_BASE, uploadsUrl } from "../config/api";
import { useNavigate } from "react-router-dom";

function EligibilityChecker() {
  const [criteria, setCriteria] = useState({ income: "", category: "General" });
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleCheck = async () => {
    try {
      const res = await api.post("/api/user/check-eligibility", criteria);
      setResults(res.data);
    } catch (err) {
      alert("Error checking eligibility");
    }
  };

  const styles = {
    card: { background: "white", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", maxWidth: "600px", margin: "40px auto" },
    input: { width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "1px solid #ddd" },
    resultBox: { padding: "15px", background: "#f0f9ff", borderRadius: "10px", marginTop: "10px", border: "1px solid #bae6fd" }
  };

  return (
    <div style={{ padding: "50px 5%" }}>
      <div style={styles.card}>
        <h2 style={{ color: "#1e3a8a" }}>Find Schemes for You</h2>
        <p style={{ color: "#64748b", fontSize: "14px" }}>Enter your details to see which government benefits you qualify for.</p>
        
        <label style={{ fontSize: "12px", fontWeight: "bold" }}>Annual Income (₹)</label>
        <input style={styles.input} type="number" onChange={(e) => setCriteria({...criteria, income: e.target.value})} />

        <label style={{ fontSize: "12px", fontWeight: "bold" }}>Occupation / Category</label>
        <select style={styles.input} onChange={(e) => setCriteria({...criteria, category: e.target.value})}>
          <option value="General">General</option>
          <option value="Farmers">Farmer</option>
          <option value="Students">Student</option>
          <option value="Women">Women</option>
        </select>

        <button onClick={handleCheck} style={{ width: "100%", padding: "12px", background: "#1e3a8a", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
          Check Eligibility
        </button>

        <div style={{ marginTop: "30px" }}>
          {results.length > 0 && <h4>Eligible Schemes Found:</h4>}
          {results.map(s => (
            <div key={s.id} style={styles.resultBox}>
              <strong style={{ color: "#0369a1" }}>{s.name}</strong>
              <p style={{ fontSize: "12px", margin: "5px 0" }}>{s.description.substring(0, 100)}...</p>
              <button onClick={() => navigate(`/schemes/${s.id}`)} style={{ background: "#0369a1", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer", fontSize: "12px" }}>View Details</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EligibilityChecker;