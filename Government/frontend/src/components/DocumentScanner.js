import React, { useState } from "react";
import Tesseract from "tesseract.js";

function DocumentScanner() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ocrText, setOcrText] = useState("");
  const [verification, setVerification] = useState(null);

  const userName = localStorage.getItem("userName") || "";

  const handleScan = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImage(URL.createObjectURL(file));
    setLoading(true);

    // OCR Processing
    Tesseract.recognize(file, 'eng', { logger: m => console.log(m) })
      .then(({ data: { text } }) => {
        setOcrText(text);
        verifyUser(text);
        setLoading(false);
      });
  };

  const verifyUser = (extractedText) => {
    // Check if the extracted text contains the user's name
    const nameMatch = extractedText.toLowerCase().includes(userName.toLowerCase());
    setVerification(nameMatch ? "Success" : "Failed");
  };

  const styles = {
    card: { background: "white", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", maxWidth: "500px", margin: "0 auto", textAlign: "center" },
    uploadArea: { border: "2px dashed #cbd5e1", padding: "30px", borderRadius: "15px", cursor: "pointer", marginBottom: "20px" },
    status: (type) => ({ padding: "10px", borderRadius: "8px", fontWeight: "bold", background: type === "Success" ? "#dcfce7" : "#fee2e2", color: type === "Success" ? "#166534" : "#991b1b", marginTop: "15px" })
  };

  return (
    <div style={{ padding: "40px" }}>
      <div style={styles.card}>
        <h2 style={{ color: "#1e3a8a" }}>AI Document Verifier ✨</h2>
        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>Upload your ID to automatically verify your identity.</p>

        <div style={styles.uploadArea}>
          <input type="file" onChange={handleScan} accept="image/*" />
          <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "10px" }}>Supported: JPG, PNG (Max 5MB)</p>
        </div>

        {loading && <p style={{ color: "#3b82f6", fontWeight: "bold" }}>AI is reading your document... ⏳</p>}

        {verification && (
          <div style={styles.status(verification)}>
            {verification === "Success" 
              ? `✅ Identity Verified: Name "${userName}" found on document.` 
              : `❌ Verification Failed: Name does not match document.`}
          </div>
        )}

        {ocrText && (
          <div style={{ marginTop: "20px", textAlign: "left", padding: "10px", background: "#f8fafc", borderRadius: "8px" }}>
            <span style={{ fontSize: "10px", fontWeight: "bold", color: "#94a3b8" }}>RAW TEXT EXTRACTED:</span>
            <p style={{ fontSize: "11px", color: "#475569" }}>{ocrText.substring(0, 100)}...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DocumentScanner;