import React, { useState, useEffect } from "react";
import { api } from "../config/api";
import { asArray } from "../utils/safeData";

function Help() {
  const [faqs, setFaqs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    // Fetch FAQs from your Flask Backend
    api.get("/api/faqs")
      .then(res => setFaqs(asArray(res.data)))
      .catch(() => {
        // Fallback demo data if backend is offline
        setFaqs([
          { id: 1, question: "How to apply for a scheme?", answer: "Go to the 'Schemes' page, select your desired scheme, and click 'Apply Now'. Fill the multi-step form and submit your documents." },
          { id: 2, question: "How to check eligibility?", answer: "Use our 'Eligibility Checker' tool. Enter your age, income, and occupation to see a list of matched government benefits." },
          { id: 3, question: "How to track application?", answer: "Visit the 'Status' page and enter your registered email address to see live updates on your application." },
          { id: 4, question: "Are there any charges for these forms?", answer: "No. This portal provides all government forms and information 100% free of cost to eliminate agent commissions." }
        ]);
      });
  }, []);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const safeFaqs = asArray(faqs);
  const filteredFaqs = safeFaqs.filter(f => f?.question?.toLowerCase().includes(searchTerm.toLowerCase()));

  const styles = {
    page: {
      fontFamily: "'Poppins', sans-serif",
      background: "#f8fafc",
      minHeight: "100vh",
      padding: "clamp(1.5rem, 5vw, 3.5rem) clamp(1rem, 5vw, 10%)",
      width: "100%",
      maxWidth: "900px",
      margin: "0 auto",
      boxSizing: "border-box",
    },
    header: { textAlign: "center", marginBottom: "50px" },
    searchBar: {
      width: "100%",
      maxWidth: "600px",
      padding: "15px 25px",
      borderRadius: "50px",
      border: "1px solid #cbd5e1",
      marginBottom: "40px",
      outline: "none",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      background: "#ffffff",
      color: "#0f172a",
    },
    accordionItem: {
      background: "white",
      marginBottom: "15px",
      borderRadius: "15px",
      overflow: "hidden",
      boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
      border: "1px solid #e2e8f0"
    },
    question: {
      padding: "20px 25px",
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontWeight: "600",
      color: "#1e3a8a",
      background: "#ffffff"
    },
    answer: (isOpen) => ({
      padding: isOpen ? "20px 25px" : "0 25px",
      maxHeight: isOpen ? "500px" : "0",
      opacity: isOpen ? "1" : "0",
      overflow: "hidden",
      transition: "all 0.3s ease",
      background: "#f8fafc",
      color: "#475569",
      lineHeight: "1.6"
    }),
    contactBox: {
      marginTop: "60px",
      padding: "40px",
      background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
      borderRadius: "20px",
      color: "white",
      textAlign: "center"
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={{color: "#1e3a8a", fontSize: "2.5rem"}}>Help Center</h1>
        <p style={{color: "#64748b"}}>Find answers to common questions about government services.</p>
      </div>

      <div style={{textAlign: "center"}}>
        <input 
          style={styles.searchBar} 
          placeholder="Search for help (e.g. 'apply', 'income')..." 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div>
        {filteredFaqs.length === 0 && (
          <p style={{ textAlign: "center", color: "#64748b" }}>No FAQs match your search.</p>
        )}
        {filteredFaqs.map((faq, index) => (
          <div key={faq.id} style={styles.accordionItem}>
            <div style={styles.question} onClick={() => toggleAccordion(index)}>
              {faq.question}
              <i className={`fa ${activeIndex === index ? "fa-minus" : "fa-plus"}`} style={{fontSize: "12px"}}></i>
            </div>
            <div style={styles.answer(activeIndex === index)}>
              {faq.answer}
            </div>
          </div>
        ))}
      </div>

      {/* SUPPORT CTA */}
      <div style={styles.contactBox}>
        <h3>Still have questions?</h3>
        <p style={{opacity: 0.9, margin: "10px 0 25px"}}>Our support team is available 24/7 to help you with your applications.</p>
        <div style={{display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap"}}>
          <button style={{padding: "12px 25px", borderRadius: "10px", border: "none", background: "#facc15", fontWeight: "bold", cursor: "pointer"}}>Call 1800-GOV-HELP</button>
          <button style={{padding: "12px 25px", borderRadius: "10px", border: "1px solid white", background: "transparent", color: "white", fontWeight: "bold", cursor: "pointer"}}>Email Support</button>
        </div>
      </div>
    </div>
  );
}

export default Help;