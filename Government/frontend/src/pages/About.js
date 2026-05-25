import React from "react";

function About() {
  const styles = {
    page: {
      fontFamily: "'Poppins', sans-serif",
      color: "#1e293b",
      lineHeight: "1.6"
    },
    hero: {
      background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
      color: "white",
      padding: "100px 10%",
      textAlign: "center",
      clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)"
    },
    section: {
      padding: "80px 10%",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "50px",
      alignItems: "center"
    },
    cardGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "20px",
      padding: "40px 10%",
      background: "#f8fafc"
    },
    valueCard: {
      background: "white",
      padding: "30px",
      borderRadius: "20px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
      textAlign: "center",
      transition: "0.3s"
    },
    iconCircle: {
      width: "60px",
      height: "60px",
      background: "#eff6ff",
      color: "#2563eb",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 15px",
      fontSize: "24px"
    }
  };

  return (
    <div style={styles.page}>
      {/* HERO HEADER */}
      <div style={styles.hero}>
        <h1 style={{ fontSize: "3rem", marginBottom: "15px" }}>Empowering Every Citizen</h1>
        <p style={{ fontSize: "1.2rem", maxWidth: "800px", margin: "0 auto", opacity: 0.9 }}>
          Bridging the gap between government initiatives and the people who need them most through digital innovation.
        </p>
      </div>

      {/* OUR MISSION */}
      <div style={styles.section}>
        <div>
          <h2 style={{ color: "#1e3a8a", fontSize: "2rem", marginBottom: "20px" }}>Our Mission</h2>
          <p style={{ fontSize: "17px", color: "#475569" }}>
            The <strong>GovAssist 2026 Portal</strong> was built with a simple goal: to make government welfare accessible to everyone. We believe that no citizen should lose out on their rights because of a lack of information or the interference of unauthorized agents.
          </p>
          <p style={{ fontSize: "17px", color: "#475569", marginTop: "15px" }}>
            By digitizing the application process and providing clear, document-based checklists, we save citizens time, money, and stress.
          </p>
        </div>
        <div>
          <img 
            src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600" 
            alt="Team Working" 
            style={{ width: "100%", borderRadius: "30px", boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }} 
          />
        </div>
      </div>

      {/* CORE VALUES */}
      <h2 style={{ textAlign: "center", marginTop: "40px", fontSize: "2rem" }}>Why We Built This</h2>
      <div style={styles.cardGrid}>
        <div style={styles.valueCard}>
          <div style={styles.iconCircle}><i className="fa fa-shield-halved"></i></div>
          <h4>Zero Fraud</h4>
          <p style={{ fontSize: "14px", color: "#64748b" }}>Direct access to official portals ensures no agent scams.</p>
        </div>
        <div style={styles.valueCard}>
          <div style={styles.iconCircle}><i className="fa fa-language"></i></div>
          <h4>Multilingual</h4>
          <p style={{ fontSize: "14px", color: "#64748b" }}>Information available in your native language for clarity.</p>
        </div>
        <div style={styles.valueCard}>
          <div style={styles.iconCircle}><i className="fa fa-clock"></i></div>
          <h4>Time Saving</h4>
          <p style={{ fontSize: "14px", color: "#64748b" }}>Apply for multiple schemes in under 10 minutes.</p>
        </div>
        <div style={styles.valueCard}>
          <div style={styles.iconCircle}><i className="fa fa-universal-access"></i></div>
          <h4>Accessibility</h4>
          <p style={{ fontSize: "14px", color: "#64748b" }}>Mobile-first design for citizens in remote rural areas.</p>
        </div>
      </div>

      {/* IMPACT STATS */}
      <div style={{ ...styles.section, textAlign: "center", gridTemplateColumns: "1fr" }}>
        <h2 style={{ color: "#1e3a8a" }}>Our Digital Impact</h2>
        <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", marginTop: "30px" }}>
          <div>
            <h1 style={{ color: "#2563eb", fontSize: "3rem" }}>100%</h1>
            <p style={{ fontWeight: "600" }}>Free Service</p>
          </div>
          <div>
            <h1 style={{ color: "#2563eb", fontSize: "3rem" }}>50+</h1>
            <p style={{ fontWeight: "600" }}>Partner Ministries</p>
          </div>
          <div>
            <h1 style={{ color: "#2563eb", fontSize: "3rem" }}>24/7</h1>
            <p style={{ fontWeight: "600" }}>Citizen Support</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;