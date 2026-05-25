import React, { useState, useEffect } from "react";
import { api, API_BASE, uploadsUrl } from "../config/api";
import { useNavigate } from "react-router-dom";

function Eligibility() {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [formData, setFormData] = useState({
    age: "",
    income: "",
    occupation: "Student",
    category: "General"
  });
  const [eligibleSchemes, setEligibleSchemes] = useState([]);
  const [hasChecked, setHasChecked] = useState(false);

  // --- 1. FETCH LIVE SCHEMES FROM DATABASE ---
  useEffect(() => {
    api.get("/api/schemes")
      .then(res => setSchemes(res.data))
      .catch(err => console.error("Could not fetch schemes for checker"));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 2. DYNAMIC CHECKING LOGIC ---
  const checkEligibility = () => {
    const { income, occupation, category } = formData;
    
    // Filter schemes that match the selected Category OR are 'General'
    // and match keywords in the description based on occupation
    const results = schemes.filter(s => {
      const matchesCategory = s.category === category || s.category === "General" || category === "EWS";
      const matchesOccupation = s.description.toLowerCase().includes(occupation.toLowerCase()) || 
                                s.name.toLowerCase().includes(occupation.toLowerCase()) ||
                                s.category === occupation;
      
      // If income is provided, we can add a basic check (simulated since income isn't in Scheme model)
      const matchesIncome = income ? parseFloat(income) < 800000 : true;

      return matchesCategory && (matchesOccupation || s.category === "General") && matchesIncome;
    });

    setEligibleSchemes(results);
    setHasChecked(true);
  };

  const styles = {
    page: { background: "linear-gradient(135deg, #0f172a 0%, #2563eb 100%)", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", fontFamily: "'Poppins', sans-serif" },
    card: { background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(10px)", padding: "40px", borderRadius: "30px", width: "100%", maxWidth: "650px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" },
    input: { width: "100%", padding: "12px", margin: "10px 0 20px 0", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "15px", boxSizing: "border-box" },
    button: { width: "100%", padding: "15px", background: "#2563eb", color: "white", border: "none", borderRadius: "12px", fontWeight: "bold", fontSize: "16px", cursor: "pointer", transition: "0.3s" },
    resultBox: { marginTop: "30px", padding: "20px", background: "#f0fdf4", borderRadius: "15px", border: "1px solid #bbf7d0" },
    schemeItem: { background: "white", padding: "15px", margin: "10px 0", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", borderLeft: "5px solid #22c55e" }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={{ textAlign: "center", color: "#1e3a8a", marginBottom: "10px" }}>
           Smart Eligibility Checker
        </h2>
        <p style={{ textAlign: "center", color: "#64748b", marginBottom: "30px" }}>
          We will analyze our database to find the best schemes for your profile.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div>
            <label style={{ fontWeight: "600", fontSize: "14px" }}>Your Age</label>
            <input style={styles.input} type="number" name="age" placeholder="e.g. 24" onChange={handleChange} />
          </div>
          <div>
            <label style={{ fontWeight: "600", fontSize: "14px" }}>Annual Income (₹)</label>
            <input style={styles.input} type="number" name="income" placeholder="e.g. 300000" onChange={handleChange} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div>
            <label style={{ fontWeight: "600", fontSize: "14px" }}>Occupation</label>
            <select style={styles.input} name="occupation" onChange={handleChange}>
              <option value="Student">Student</option>
              <option value="Farmers">Farmer</option>
              <option value="Self-Employed">Business</option>
              <option value="Private Job">Private Job</option>
              <option value="Unemployed">Unemployed</option>
            </select>
          </div>
          <div>
            <label style={{ fontWeight: "600", fontSize: "14px" }}>Category</label>
            <select style={styles.input} name="category" onChange={handleChange}>
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC/ST">SC / ST</option>
              <option value="EWS">EWS</option>
            </select>
          </div>
        </div>

        <button 
          style={styles.button} 
          onClick={checkEligibility}
          onMouseOver={(e) => e.target.style.background = "#1e40af"}
          onMouseOut={(e) => e.target.style.background = "#2563eb"}
        >
          🔍 Search Eligible Schemes
        </button>

        {hasChecked && (
          <div style={styles.resultBox}>
            <h4 style={{ color: "#166534", marginBottom: "15px" }}>
              {eligibleSchemes.length > 0 ? `🎉 We found ${eligibleSchemes.length} matches!` : "⌛ No direct matches found."}
            </h4>
            {eligibleSchemes.map((s, index) => (
              <div key={index} style={styles.schemeItem}>
                <div>
                    <strong style={{ color: "#1e3a8a" }}>{s.name}</strong>
                    <div style={{fontSize: '11px', color: '#64748b'}}>{s.ministry}</div>
                </div>
                <button 
                    onClick={() => navigate(`/schemes/${s.id}`)}
                    style={{padding: '5px 10px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px'}}
                >
                    Apply
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Eligibility;