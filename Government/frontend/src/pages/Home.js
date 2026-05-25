import React from "react";

function Home() {
  // --- CSS ANIMATIONS ---
  const animations = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    @keyframes gradientBG {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .hover-card:hover {
      transform: translateY(-10px) scale(1.02);
      box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
    }
  `;

  const styles = {
    container: {
      fontFamily: "'Poppins', sans-serif",
      color: "#1e293b",
      overflowX: "hidden",
    },
    hero: {
      background: "linear-gradient(-45deg, #1e3a8a, #2563eb, #0ea5e9, #3b82f6)",
      backgroundSize: "400% 400%",
      animation: "gradientBG 10s ease infinite",
      padding: "120px 20px",
      textAlign: "center",
      color: "white",
      clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)",
    },
    heroTitle: {
      fontSize: "3rem",
      fontWeight: "700",
      marginBottom: "20px",
      animation: "fadeInUp 1s ease-out",
    },
    searchContainer: {
      background: "rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(10px)",
      padding: "10px",
      borderRadius: "50px",
      display: "inline-flex",
      alignItems: "center",
      marginTop: "30px",
      border: "1px solid rgba(255,255,255,0.3)",
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    },
    input: {
      padding: "15px 25px",
      width: "350px",
      border: "none",
      borderRadius: "50px",
      outline: "none",
      fontSize: "16px",
    },
    searchBtn: {
      background: "#facc15",
      color: "#1e3a8a",
      padding: "15px 30px",
      borderRadius: "50px",
      border: "none",
      fontWeight: "bold",
      marginLeft: "10px",
      cursor: "pointer",
      transition: "0.3s",
    },
    statsWrapper: {
      display: "flex",
      justifyContent: "center",
      gap: "25px",
      marginTop: "-80px",
      flexWrap: "wrap",
      padding: "0 20px",
    },
    glassCard: {
      background: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(15px)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      padding: "30px",
      width: "220px",
      borderRadius: "20px",
      textAlign: "center",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      animation: "float 4s ease-in-out infinite",
    },
    sectionTitle: {
      textAlign: "center",
      fontSize: "2.2rem",
      margin: "80px 0 40px",
      color: "#0f172a",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "30px",
      padding: "0 10% 80px",
    },
    featureCard: {
      background: "white",
      padding: "40px 30px",
      borderRadius: "24px",
      textAlign: "center",
      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      transition: "all 0.4s ease",
      cursor: "pointer",
    },
    iconCircle: {
      width: "80px",
      height: "80px",
      background: "#eff6ff",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 20px",
      fontSize: "30px",
      color: "#2563eb",
    },
    schemeCard: {
      background: "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)",
      padding: "30px",
      borderRadius: "20px",
      borderLeft: "5px solid #2563eb",
      boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
    },
    footer: {
      background: "#0f172a",
      color: "white",
      padding: "60px 20px 20px",
      textAlign: "center",
    }
  };

  return (
    <div style={styles.container}>
      <style>{animations}</style>

      {/* HERO SECTION */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Your Direct Gateway to <br/>Government Welfare</h1>
        <p style={{ fontSize: "20px", opacity: "0.9" }}>
          Transparent, Agent-Free, and Multilingual Support for every Citizen.
        </p>
        
        <div style={styles.searchContainer}>
          <input 
            style={styles.input} 
            type="text" 
            placeholder="Search documents or schemes..." 

          />
          <button style={styles.searchBtn} className="hover-card">
            <i className="fa fa-search"></i> Search
          </button>
        </div>
      </section>

      {/* FLOATING STATS */}
      <div style={styles.statsWrapper}>
        <div style={styles.glassCard}>
          <h2 style={{ color: "#2563eb", fontSize: "32px" }}>1200+</h2>
          <p style={{ fontWeight: "600" }}>Live Schemes</p>
        </div>
        <div style={{ ...styles.glassCard, animationDelay: "0.5s" }}>
          <h2 style={{ color: "#059669", fontSize: "32px" }}>0</h2>
          <p style={{ fontWeight: "600" }}>Agent Fees</p>
        </div>
        <div style={{ ...styles.glassCard, animationDelay: "1s" }}>
          <h2 style={{ color: "#d97706", fontSize: "32px" }}>10M+</h2>
          <p style={{ fontWeight: "600" }}>Trusted Users</p>
        </div>
        <div style={{ ...styles.glassCard, animationDelay: "1.5s" }}>
          <h2 style={{ color: "#7c3aed", fontSize: "32px" }}>24/7</h2>
          <p style={{ fontWeight: "600" }}>Digital Access</p>
        </div>
      </div>

      {/* CORE SERVICES */}
      <h2 style={styles.sectionTitle}>How can we help you today?</h2>
      <div style={styles.grid}>
        <div style={styles.featureCard} className="hover-card">
          <div style={styles.iconCircle}><i className="fa fa-id-card"></i></div>
          <h3>Aadhaar & IDs</h3>
          <p>Update, link, or apply for new identity documents without middlemen.</p>
        </div>
        <div style={styles.featureCard} className="hover-card">
          <div style={styles.iconCircle}><i className="fa fa-graduation-cap"></i></div>
          <h3>Scholarships</h3>
          <p>Find the best educational grants based on your qualification.</p>
        </div>
        <div style={styles.featureCard} className="hover-card">
          <div style={styles.iconCircle}><i className="fa fa-hand-holding-dollar"></i></div>
          <h3>Direct Benefits</h3>
          <p>Cash transfers and subsidies for farmers and small businesses.</p>
        </div>
      </div>

      {/* FEATURED SCHEMES - COLORFUL GRID */}
      <section style={{ background: "#fff", paddingBottom: "50px" }}>
        <h2 style={styles.sectionTitle}>Most Popular Schemes</h2>
        <div style={styles.grid}>
          <div style={styles.schemeCard} className="hover-card">
            <span style={{ color: "#2563eb", fontWeight: "bold" }}>HEALTHCARE</span>
            <h3>Ayushman Bharat</h3>
            <p>Get up to ₹5 Lakhs free treatment per year for your family.</p>
            <button style={{ background: "none", border: "none", color: "#2563eb", fontWeight: "600", cursor: "pointer" }}>
              Learn More →
            </button>
          </div>
          <div style={{ ...styles.schemeCard, borderLeftColor: "#059669" }} className="hover-card">
            <span style={{ color: "#059669", fontWeight: "bold" }}>FARMERS</span>
            <h3>PM Kisan Nidhi</h3>
            <p>Direct income support of ₹6,000 per year for small farmers.</p>
            <button style={{ background: "none", border: "none", color: "#059669", fontWeight: "600", cursor: "pointer" }}>
              Learn More →
            </button>
          </div>
          <div style={{ ...styles.schemeCard, borderLeftColor: "#d97706" }} className="hover-card">
            <span style={{ color: "#d97706", fontWeight: "bold" }}>HOUSING</span>
            <h3>PM Awas Yojana</h3>
            <p>Financial assistance to build your dream home with low interest.</p>
            <button style={{ background: "none", border: "none", color: "#d97706", fontWeight: "600", cursor: "pointer" }}>
              Learn More →
            </button>
          </div>
        </div>
      </section>

      {/* NEWS & UPDATES */}
      <section style={{ padding: "80px 10%", background: "#f8fafc" }}>
        <h2 style={{ textAlign: "left", fontSize: "2rem", marginBottom: "30px" }}>Latest Portal Updates</h2>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ flex: "1", minWidth: "300px", background: "white", padding: "20px", borderRadius: "15px" }}>
            <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=500&q=60" alt="update" style={{ width: "100%", borderRadius: "10px", marginBottom: "15px" }} />
            <h4>New Income Certificate Process</h4>
            <p>Now apply within 5 minutes using OTP authentication.</p>
          </div>
          <div style={{ flex: "1", minWidth: "300px", background: "white", padding: "20px", borderRadius: "15px" }}>
            <img src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=500&q=60" alt="update" style={{ width: "100%", borderRadius: "10px", marginBottom: "15px" }} />
            <h4>Digital Literacy Campaign</h4>
            <p>Learn how to protect your Aadhaar data from scams.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={{ marginBottom: "30px" }}>
          <h2>GovAssist Portal 2026</h2>
          <p>Helping India grow, one citizen at a time.</p>
        </div>
        <div style={{ fontSize: "20px", marginBottom: "20px" }}>
          <i className="fab fa-facebook" style={{ margin: "0 15px" }}></i>
          <i className="fab fa-twitter" style={{ margin: "0 15px" }}></i>
          <i className="fab fa-linkedin" style={{ margin: "0 15px" }}></i>
        </div>
        <hr style={{ borderColor: "#334155", margin: "20px 0" }} />
        <p>© 2026 Ministry of Citizen Empowerment. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Home;