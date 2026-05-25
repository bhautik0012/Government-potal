import React, { useEffect, useState } from "react";
import { api } from "../config/api";
import { Link } from "react-router-dom";

function Schemes() {
  const [schemes, setSchemes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Define styles first so they are available for the return statement
  const styles = {
    page: { fontFamily: "'Poppins', sans-serif", background: "#f1f5f9", minHeight: "100vh", padding: "40px 10%" },
    header: { textAlign: "center", marginBottom: "40px" },
    controls: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "15px" },
    searchBar: { padding: "12px 20px", width: "300px", borderRadius: "30px", border: "1px solid #cbd5e1", outline: "none", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" },
    filterSelect: { padding: "12px 20px", borderRadius: "30px", border: "1px solid #cbd5e1", background: "white", cursor: "pointer" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "25px" },
    card: { background: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(10px)", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", transition: "0.3s ease", border: "1px solid rgba(255,255,255,0.5)", display: "flex", flexDirection: "column", justifyContent: "space-between" },
    tag: { display: "inline-block", background: "#dbeafe", color: "#2563eb", padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", marginBottom: "10px" },
    title: { fontSize: "20px", color: "#0f172a", marginBottom: "10px" },
    btn: { marginTop: "20px", padding: "10px 0", background: "#2563eb", color: "white", borderRadius: "10px", border: "none", fontWeight: "600", cursor: "pointer", textDecoration: "none", textAlign: "center", transition: "0.3s" },
    animations: `
      @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      .scheme-card:hover { transform: translateY(-8px); box-shadow: 0 15px 35px rgba(37, 99, 235, 0.1) !important; border-color: #2563eb !important; }
    `
  };

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await api.get("/api/schemes");
        setSchemes(res.data);
      } catch (err) {
        console.error("Backend offline. Using local backup.");
        setSchemes([
          { id: 1, name: "PM Kisan Nidhi", ministry: "Agriculture", category: "Farmers", description: "Direct income support of ₹6000 p.a." },
          { id: 2, name: "Ayushman Bharat", ministry: "Health", category: "Healthcare", description: "Free healthcare coverage up to ₹5 Lakhs." },
          { id: 3, name: "National Scholarship", ministry: "Education", category: "Students", description: "Financial aid for higher education." }
        ]);
      }
    };
    fetchSchemes();
  }, []); // Empty dependency array is fine here as we only want to fetch once on mount

  // Dynamic category list based on what is in the database
  const categories = ["All", ...new Set(schemes.map(s => s.category))];

  const filteredSchemes = schemes.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || s.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={styles.page}>
      <style>{styles.animations}</style>
      
      <div style={styles.header}>
        <h1 style={{fontSize: "2.5rem", color: "#1e3a8a"}}>Government Schemes Portal</h1>
        <p style={{color: "#64748b"}}>Explore valid 2026 welfare initiatives</p>
      </div>

      <div style={styles.controls}>
        <input 
          style={styles.searchBar} 
          type="text" 
          placeholder="Search by name..." 
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select 
          style={styles.filterSelect}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div style={styles.grid}>
        {filteredSchemes.length > 0 ? (
          filteredSchemes.map((s, index) => (
            <div 
              key={s.id} 
              className="scheme-card" 
              style={{...styles.card, animation: `slideIn ${0.3 + index * 0.1}s ease-out forwards`}}
            >
              <div>
                <span style={styles.tag}>{s.category}</span>
                <h3 style={styles.title}>{s.name}</h3>
                <p style={{fontSize: "14px", color: "#475569", fontWeight: "500", marginBottom: "5px"}}>
                  <i className="fa fa-building" style={{marginRight: "5px"}}></i> {s.ministry}
                </p>
                <p style={{fontSize: "14px", color: "#64748b", lineHeight: "1.6"}}>
                  {s.description}
                </p>
              </div>

              <Link to={`/schemes/${s.id}`} style={styles.btn}>
                View Details & Apply
              </Link>
            </div>
          ))
        ) : (
          <div style={{gridColumn: "1/-1", textAlign: "center", padding: "50px"}}>
             <h3>No schemes found matching your criteria.</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Schemes;