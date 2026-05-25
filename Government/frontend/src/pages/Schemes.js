import React, { useEffect, useState } from "react";
import { api } from "../config/api";
import { Link } from "react-router-dom";

function Schemes() {
  const [schemes, setSchemes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Define styles first so they are available for the return statement
  const tagStyle = { display: "inline-block", background: "#dbeafe", color: "#2563eb", padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", marginBottom: "10px" };

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
    <div className="page-full" style={{ fontFamily: "'Poppins', sans-serif", background: "#f1f5f9" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", color: "#1e3a8a", margin: "0 0 0.5rem" }}>Government Schemes Portal</h1>
        <p style={{ color: "#64748b" }}>Explore valid 2026 welfare initiatives</p>
      </div>

      <div className="controls-row">
        <input
          className="search-input"
          type="text"
          placeholder="Search by name..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="select-field"
          style={{ width: "auto", minWidth: "160px" }}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-3">
        {filteredSchemes.length > 0 ? (
          filteredSchemes.map((s) => (
            <div key={s.id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <span style={tagStyle}>{s.category}</span>
                <h3 style={{ fontSize: "1.15rem", color: "#0f172a", marginBottom: "0.5rem" }}>{s.name}</h3>
                <p style={{ fontSize: "14px", color: "#475569", fontWeight: "500", marginBottom: "5px" }}>
                  <i className="fa fa-building" style={{ marginRight: "5px" }} /> {s.ministry}
                </p>
                <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6" }}>{s.description}</p>
              </div>
              <Link to={`/schemes/${s.id}`} className="btn btn-primary" style={{ marginTop: "1.25rem", textAlign: "center" }}>
                View Details & Apply
              </Link>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "3rem" }}>
            <h3>No schemes found matching your criteria.</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Schemes;