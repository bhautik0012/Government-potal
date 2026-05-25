import React, { useState, useEffect } from "react";
import { api } from "../config/api";

function Documents() {
  const [docs, setDocs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Connects to your Flask API
    api.get("/api/document-requirements")
      .then(res => setDocs(res.data))
      .catch(() => {
        // Fallback demo data if backend is not running
        setDocs([
          { id: 1, name: "Passport (Fresh/Reissue)", items: ["Aadhaar Card", "PAN Card", "Birth Certificate", "Address Proof"], link: "/forms/passport.pdf" },
          { id: 2, name: "Income Certificate", items: ["Salary Slip", "Ration Card", "Identity Proof", "Self Declaration"], link: "/forms/income.pdf" },
          { id: 3, name: "Caste Certificate", items: ["Father's Caste Proof", "Residence Certificate", "Affidavit", "Photo"], link: "/forms/caste.pdf" },
          { id: 4, name: "Aadhaar Update", items: ["Old Aadhaar Copy", "Mobile Number", "Identity Proof"], link: "/forms/aadhaar.pdf" }
        ]);
      });
  }, []);

  const filteredDocs = docs.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  const styles = {
    page: {
      fontFamily: "'Poppins', sans-serif",
      background: "#f1f5f9",
      minHeight: "100vh",
      padding: "60px 10%"
    },
    header: {
      textAlign: "center",
      marginBottom: "50px"
    },
    searchBox: {
      padding: "15px 25px",
      width: "100%",
      maxWidth: "500px",
      borderRadius: "50px",
      border: "1px solid #cbd5e1",
      marginBottom: "40px",
      outline: "none",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "30px"
    },
    card: {
      background: "white",
      padding: "30px",
      borderRadius: "20px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
      transition: "0.3s",
      border: "1px solid transparent"
    },
    list: {
      margin: "20px 0",
      paddingLeft: "20px",
      color: "#475569",
      lineHeight: "2"
    },
    downloadBtn: {
      display: "block",
      textAlign: "center",
      background: "#2563eb",
      color: "white",
      padding: "12px",
      borderRadius: "12px",
      textDecoration: "none",
      fontWeight: "bold",
      marginTop: "20px",
      transition: "0.3s"
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={{color: "#1e3a8a", fontSize: "2.5rem"}}>Required Documents</h1>
        <p style={{color: "#64748b"}}>Find all necessary documents and official forms free of cost.</p>
      </div>

      <div style={{textAlign: "center"}}>
        <input 
          style={styles.searchBox}
          placeholder="Search e.g. 'Income' or 'Passport'..." 
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div style={styles.grid}>
        {filteredDocs.map(doc => (
          <div key={doc.id} style={styles.card} onMouseEnter={(e)=>e.currentTarget.style.borderColor="#2563eb"}>
            <h3 style={{color: "#0f172a"}}><i className="fa fa-file-invoice" style={{marginRight: "10px", color: "#2563eb"}}></i> {doc.name}</h3>
            
            <ul style={styles.list}>
              {doc.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <a href={doc.link} download style={styles.downloadBtn}>
              <i className="fa fa-download"></i> Download Official Form
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Documents;