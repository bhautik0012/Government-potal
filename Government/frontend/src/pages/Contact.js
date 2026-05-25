import React, { useState } from "react";
import axios from "axios";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/contact", formData);
      if (response.status === 201) {
        setStatus("Message Sent Successfully! We will contact you soon.");
        setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
      }
    } catch (error) {
      setStatus("Error sending message. Please try again.");
    }
  };

  const styles = {
    page: {
      fontFamily: "'Poppins', sans-serif",
      background: "#f1f5f9",
      minHeight: "100vh",
      padding: "80px 10%"
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 1.5fr",
      gap: "50px",
      alignItems: "start"
    },
    infoCard: {
      background: "white",
      padding: "40px",
      borderRadius: "24px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
    },
    formCard: {
      background: "white",
      padding: "40px",
      borderRadius: "24px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
    },
    iconText: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      marginBottom: "25px",
      fontSize: "16px",
      color: "#475569"
    },
    icon: {
      width: "45px",
      height: "45px",
      background: "#eff6ff",
      color: "#2563eb",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px"
    },
    input: {
      width: "100%",
      padding: "12px 15px",
      marginBottom: "20px",
      borderRadius: "10px",
      border: "1px solid #cbd5e1",
      outline: "none",
      fontSize: "15px"
    },
    button: {
      width: "100%",
      padding: "15px",
      background: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: "12px",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "0.3s"
    },
    map: {
      width: "100%",
      height: "200px",
      borderRadius: "15px",
      marginTop: "20px",
      border: "none"
    }
  };

  return (
    <div style={styles.page}>
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <h1 style={{ color: "#1e3a8a", fontSize: "2.5rem" }}>Get in Touch</h1>
        <p style={{ color: "#64748b" }}>Have questions? Our team is here to help you 24/7.</p>
      </div>

      <div style={styles.grid}>
        {/* LEFT SIDE: CONTACT INFO */}
        <div style={styles.infoCard}>
          <h3 style={{ marginBottom: "30px", color: "#1e3a8a" }}>Contact Information</h3>
          
          <div style={styles.iconText}>
            <div style={styles.icon}><i className="fa fa-envelope"></i></div>
            <div>
              <p style={{ fontWeight: "bold", color: "#0f172a" }}>Email Us</p>
              <p>support@govportal.in</p>
            </div>
          </div>

          <div style={styles.iconText}>
            <div style={styles.icon}><i className="fa fa-phone"></i></div>
            <div>
              <p style={{ fontWeight: "bold", color: "#0f172a" }}>Call Us</p>
              <p>1800-000-2026 (Toll Free)</p>
            </div>
          </div>

          <div style={styles.iconText}>
            <div style={styles.icon}><i className="fa fa-location-dot"></i></div>
            <div>
              <p style={{ fontWeight: "bold", color: "#0f172a" }}>Headquarters</p>
              <p>Digital India Bhawan, New Delhi</p>
            </div>
          </div>

          <iframe 
            style={styles.map}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.8392319277!2d77.06889754725782!3d28.527280344524853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b71532660fa!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1709630000000!5m2!1sen!2sin"
            allowFullScreen="" loading="lazy">
          </iframe>
        </div>

        {/* RIGHT SIDE: CONTACT FORM */}
        <div style={styles.formCard}>
          <h3 style={{ marginBottom: "25px", color: "#1e3a8a" }}>Send us a Message</h3>
          <form onSubmit={handleSubmit}>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#475569" }}>Full Name</label>
            <input style={styles.input} type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />

            <label style={{ fontSize: "14px", fontWeight: "600", color: "#475569" }}>Email Address</label>
            <input style={styles.input} type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required />

            <label style={{ fontSize: "14px", fontWeight: "600", color: "#475569" }}>Inquiry Category</label>
            <select style={styles.input} name="subject" value={formData.subject} onChange={handleChange}>
              <option value="General Inquiry">General Inquiry</option>
              <option value="Scheme Application Help">Scheme Application Help</option>
              <option value="Technical Issue">Technical Issue</option>
              <option value="Report Fraud/Agent">Report Fraud / Agent</option>
            </select>

            <label style={{ fontSize: "14px", fontWeight: "600", color: "#475569" }}>Your Message</label>
            <textarea style={{ ...styles.input, height: "120px", resize: "none" }} name="message" value={formData.message} onChange={handleChange} placeholder="How can we help you?" required></textarea>

            <button style={styles.button} type="submit">Submit Inquiry</button>
          </form>
          {status && <p style={{ marginTop: "20px", color: "#1e40af", fontWeight: "bold", textAlign: "center" }}>{status}</p>}
        </div>
      </div>
    </div>
  );
}

export default Contact;