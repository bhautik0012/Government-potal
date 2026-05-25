import React, { useState } from "react";

function News() {
  const [news, setNews] = useState([
    {
      id: 1,
      title: "New Digital Agriculture Subsidy 2026",
      date: "March 05, 2026",
      category: "Farmers",
      // Using a more reliable stable source
      image: "https://images.pexels.com/photos/235927/pexels-photo-235927.jpeg?auto=compress&cs=tinysrgb&w=600",
      summary: "The Ministry of Agriculture has launched a 25% subsidy on smart farming equipment. Apply before April 30."
    },
    {
      id: 2,
      title: "National Scholarship Portal 3.0 Live",
      date: "March 04, 2026",
      category: "Education",
      image: "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=600",
      summary: "Students can now track their scholarship status via WhatsApp. Over 50 new schemes added for 2026."
    },
    {
      id: 3,
      title: "Urban Housing Subsidy Increased by 15%",
      date: "March 02, 2026",
      category: "Housing",
      image: "https://images.pexels.com/photos/101808/pexels-photo-101808.jpeg?auto=compress&cs=tinysrgb&w=600",
      summary: "PM Awas Yojana (Urban) has increased the credit-linked subsidy for the middle-income group."
    }
  ]);

  // PROFESSIONAL TRICK: If image fails, replace with a colored placeholder
  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/250x200/2563eb/ffffff?text=Gov+Update";
  };

  const styles = {
    page: {
      fontFamily: "'Poppins', sans-serif",
      background: "#f8fafc",
      minHeight: "100vh",
      padding: "40px 8%"
    },
    ticker: {
      background: "#1e3a8a",
      color: "#facc15",
      padding: "12px",
      borderRadius: "12px",
      marginBottom: "30px",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "15px",
      boxShadow: "0 4px 12px rgba(30, 58, 138, 0.2)"
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      gap: "40px",
    },
    card: {
      background: "white",
      borderRadius: "20px",
      overflow: "hidden",
      boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
      marginBottom: "30px",
      display: "flex",
      transition: "0.3s transform ease",
      cursor: "pointer",
      border: "1px solid #f1f5f9"
    },
    cardImage: {
      width: "250px",
      height: "220px",
      objectFit: "cover",
      background: "#e2e8f0" // Gray background while loading
    },
    cardBody: {
      padding: "25px",
      flex: 1
    },
    badge: {
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "bold",
      background: "#dbeafe",
      color: "#2563eb",
      marginBottom: "10px",
      display: "inline-block"
    },
    sidebar: {
      background: "white",
      padding: "25px",
      borderRadius: "20px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
      position: "sticky",
      top: "20px"
    },
    sidebarLink: {
      padding: "12px 0",
      borderBottom: "1px solid #f1f5f9",
      display: "block",
      textDecoration: "none",
      color: "#475569",
      fontWeight: "500",
      fontSize: "14px",
      transition: "0.2s"
    }
  };

  return (
    <div style={styles.page}>
      {/* ANIMATED TICKER */}
      <div style={styles.ticker}>
        <span style={{ background: "#facc15", color: "#1e3a8a", padding: "4px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "900" }}>LIVE</span>
        <marquee scrollamount="6">
            Aadhaar-Pan linking deadline: June 30, 2026 | New Kisan Credit Card limits increased | 50,000 new vacancies announced in Railway Dept.
        </marquee>
      </div>

      <h1 style={{ marginBottom: "30px", color: "#1e3a8a", fontSize: "2.4rem" }}>
        News & Press Releases
      </h1>

      <div style={styles.grid}>
        <div>
          {news.map((item) => (
            <div 
              key={item.id} 
              style={styles.card} 
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1.0)"}
            >
              <img 
                src={item.image} 
                alt="Gov News" 
                style={styles.cardImage} 
                onError={handleImageError} 
              />
              <div style={styles.cardBody}>
                <span style={styles.badge}>{item.category}</span>
                <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "8px" }}>{item.date}</p>
                <h3 style={{ marginBottom: "12px", color: "#0f172a", fontSize: "1.3rem" }}>{item.title}</h3>
                <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6" }}>
                  {item.summary}
                </p>
                <div style={{ marginTop: "15px", color: "#2563eb", fontWeight: "bold", fontSize: "14px" }}>
                  Read More <i className="fa fa-arrow-right"></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SIDEBAR */}
        <div>
          <div style={styles.sidebar}>
            <h3 style={{ marginBottom: "20px", borderLeft: "4px solid #2563eb", paddingLeft: "10px" }}>Quick Resources</h3>
            <a href="#" style={styles.sidebarLink}><i className="fa fa-file-pdf"></i> Annual Budget 2026-27</a>
            <a href="#" style={styles.sidebarLink}><i className="fa fa-bullhorn"></i> Official Announcements</a>
            <a href="#" style={styles.sidebarLink}><i className="fa fa-users"></i> Meeting Minutes</a>
            <a href="#" style={styles.sidebarLink}><i className="fa fa-map-marked-alt"></i> State-wise Nodal Officers</a>
          </div>

          <div style={{ background: "linear-gradient(135deg, #1e3a8a, #2563eb)", padding: "25px", borderRadius: "20px", marginTop: "30px", color: "white" }}>
            <h4>Join Official Newsletter</h4>
            <p style={{ fontSize: "12px", margin: "10px 0 20px" }}>Stay updated with direct government circulars.</p>
            <input 
              type="email" 
              placeholder="Enter Email" 
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", marginBottom: "10px" }} 
            />
            <button style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", background: "#facc15", color: "#1e3a8a", fontWeight: "bold", cursor: "pointer" }}>
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default News;