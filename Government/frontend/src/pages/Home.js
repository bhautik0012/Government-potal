import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", color: "#1e293b", overflowX: "hidden" }}>
      <section className="hero">
        <h1 className="hero-title">
          Your Direct Gateway to<br />Government Welfare
        </h1>
        <p className="hero-sub">
          Transparent, agent-free, and multilingual support for every citizen.
        </p>
        <div className="hero-search">
          <input type="text" placeholder="Search documents or schemes..." aria-label="Search" />
          <button type="button" className="btn" style={{ background: "#facc15", color: "#1e3a8a", borderRadius: "50px" }}>
            <i className="fa fa-search" /> Search
          </button>
        </div>
      </section>

      <div className="stats-row">
        {[
          { n: "1200+", l: "Live Schemes", c: "#2563eb" },
          { n: "0", l: "Agent Fees", c: "#059669" },
          { n: "10M+", l: "Trusted Users", c: "#d97706" },
          { n: "24/7", l: "Digital Access", c: "#7c3aed" },
        ].map((s, i) => (
          <div key={i} className="glass-card stat-card">
            <h2 style={{ color: s.c, fontSize: "clamp(1.5rem, 4vw, 2rem)", margin: "0 0 0.5rem" }}>{s.n}</h2>
            <p style={{ fontWeight: 600, margin: 0 }}>{s.l}</p>
          </div>
        ))}
      </div>

      <h2 className="section-title">How can we help you today?</h2>
      <div className="grid grid-3 page" style={{ paddingTop: 0 }}>
        {[
          { icon: "fa-id-card", title: "Aadhaar & IDs", text: "Update, link, or apply for identity documents without middlemen." },
          { icon: "fa-graduation-cap", title: "Scholarships", text: "Find educational grants based on your qualification." },
          { icon: "fa-hand-holding-dollar", title: "Direct Benefits", text: "Cash transfers and subsidies for farmers and businesses." },
        ].map((f) => (
          <div key={f.title} className="card" style={{ textAlign: "center" }}>
            <div className="feature-icon"><i className={`fa ${f.icon}`} /></div>
            <h3>{f.title}</h3>
            <p style={{ color: "#64748b", lineHeight: 1.6 }}>{f.text}</p>
          </div>
        ))}
      </div>

      <section className="popular-schemes-section">
        <h2 className="section-title">Most Popular Schemes</h2>
        <div className="popular-schemes-grid">
          {[
            { tag: "HEALTHCARE", color: "#2563eb", title: "Ayushman Bharat", text: "Up to ₹5 Lakhs free treatment per year." },
            { tag: "FARMERS", color: "#059669", title: "PM Kisan Nidhi", text: "₹6,000 per year for small farmers." },
            { tag: "HOUSING", color: "#d97706", title: "PM Awas Yojana", text: "Build your home with low interest." },
          ].map((s) => (
            <div key={s.title} className="card popular-scheme-card" style={{ borderLeft: `5px solid ${s.color}` }}>
              <span style={{ color: s.color, fontWeight: "bold", fontSize: "0.85rem" }}>{s.tag}</span>
              <h3>{s.title}</h3>
              <p style={{ color: "#64748b" }}>{s.text}</p>
              <Link to="/schemes" style={{ color: s.color, fontWeight: 600, textDecoration: "none" }}>Learn More →</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="page" style={{ background: "#f8fafc", maxWidth: "100%" }}>
        <h2 style={{ fontSize: "clamp(1.25rem, 4vw, 2rem)", marginBottom: "1.5rem" }}>Latest Portal Updates</h2>
        <div className="grid grid-2">
          {[
            { img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=500&q=60", title: "New Income Certificate Process", text: "Apply within 5 minutes using OTP." },
            { img: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=500&q=60", title: "Digital Literacy Campaign", text: "Protect your Aadhaar from scams." },
          ].map((u) => (
            <div key={u.title} className="card">
              <div style={{ width: "100%", height: 140, borderRadius: 10, marginBottom: "1rem", background: "linear-gradient(135deg, #dbeafe, #eff6ff)", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb", fontWeight: 600 }}>📰 Update</div>
              <h4>{u.title}</h4>
              <p style={{ color: "#64748b", margin: 0 }}>{u.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <h2 style={{ margin: "0 0 0.5rem" }}>GovAssist Portal 2026</h2>
        <p>Helping India grow, one citizen at a time.</p>
        <div style={{ fontSize: "1.25rem", margin: "1.25rem 0", display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          <i className="fab fa-facebook" />
          <i className="fab fa-twitter" />
          <i className="fab fa-linkedin" />
        </div>
        <p style={{ opacity: 0.8, fontSize: "0.9rem" }}>© 2026 Ministry of Citizen Empowerment</p>
      </footer>
    </div>
  );
}

export default Home;
