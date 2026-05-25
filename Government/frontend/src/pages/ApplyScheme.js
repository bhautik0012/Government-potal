import React, { useState, useEffect } from "react";
import { api, API_BASE, uploadsUrl } from "../config/api";
import { useNavigate, useLocation } from "react-router-dom";

function ApplyScheme() {
  const [step, setStep] = useState(1);
  const [schemes, setSchemes] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // --- FILE STATE ---
  const [appFiles, setAppFiles] = useState({
    aadhaarFile: null,
    incomeFile: null
  });

  // --- FORM STATE ---
  const [form, setForm] = useState({
    name: localStorage.getItem("userName") || "",
    email: localStorage.getItem("userEmail") || "",
    phone: localStorage.getItem("userMobile") || "",
    scheme: location.state?.preSelectedScheme || "", 
    income: "",
    aadhaar_no: "", // Matches backend column name
    declaration: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const response = await api.get("/api/schemes");
        setSchemes(response.data);
      } catch (err) {
        console.error("Error fetching schemes:", err);
      }
    };
    fetchSchemes();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleFileChange = (e) => {
    setAppFiles({ ...appFiles, [e.target.name]: e.target.files[0] });
  };

  const nextStep = () => {
    if (step === 1 && (!form.name || !form.phone)) {
      alert("Please enter your name and phone.");
      return;
    }
    if (step === 2 && (!form.scheme || !form.income)) {
      alert("Please select a scheme and income.");
      return;
    }
    setStep(step + 1);
  };
  
  const prevStep = () => setStep(step - 1);

 // ... (keep previous imports and state)

  // --- FINAL SUBMISSION LOGIC ---
  const submitForm = async (e) => {
    if (e) e.preventDefault();
    
    if (!form.declaration) {
      alert("Please accept the declaration.");
      return;
    }

    if (!appFiles.aadhaarFile || !appFiles.incomeFile) {
      alert("Please upload both documents.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      // FIX 1: Changed .strip() (Python) to .trim() (JavaScript)
      // Also ensure email exists before calling methods on it
      const cleanEmail = form.email ? form.email.toLowerCase().trim() : "";

      formData.append("email", cleanEmail); 
      formData.append("applicant_name", form.name);
      formData.append("scheme_name", form.scheme);
      formData.append("income", form.income);
      formData.append("phone", form.phone);
      formData.append("aadhaar_no", form.aadhaar_no);
      
      formData.append("aadhaar", appFiles.aadhaarFile);
      formData.append("income_proof", appFiles.incomeFile);

      // FIX 2: Explicitly catch the request to check for server availability
      const response = await api.post("/api/apply", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 10000 // 10 second timeout
      });

      if (response.status === 201 || response.status === 200) {
        alert(`🎉 Success! Your application for ${form.scheme} is now under review.`);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Submission Error Details:", err);

      // FIX 3: Better error messaging to identify the root cause
      if (!err.response) {
        // This happens if the server is down or CORS is blocking the request
        alert("❌ Connection Error: Cannot reach the server. Please ensure your Python backend is running on port 5000 and CORS is enabled.");
      } else {
        // This happens if the server replied with an error (400, 404, 500)
        alert(`❌ Submission Failed: ${err.response.data?.error || "Server Error"}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

// ... (keep the rest of the component as is)
  const styles = {
    page: { background: "#f8fafc", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", fontFamily: "'Poppins', sans-serif" },
    glassCard: { background: "white", padding: "40px", borderRadius: "30px", boxShadow: "0 20px 50px rgba(0,0,0,0.05)", width: "100%", maxWidth: "500px", border: "1px solid #f1f5f9" },
    stepper: { display: "flex", justifyContent: "space-between", marginBottom: "35px", position: "relative" },
    stepItem: (active) => ({ width: "35px", height: "35px", borderRadius: "50%", background: active ? "#1e3a8a" : "#f1f5f9", color: active ? "white" : "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "14px", zIndex: 2, transition: "0.3s" }),
    progressLine: (progress) => ({ position: "absolute", top: "17px", left: "10%", width: "80%", height: "2px", background: `linear-gradient(to right, #1e3a8a ${progress}%, #f1f5f9 ${progress}%)`, zIndex: 1 }),
    inputGroup: { marginBottom: "20px" },
    input: { width: "100%", padding: "14px", marginTop: "6px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "0.2s" },
    label: { fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" },
    btnPrimary: { padding: "14px", background: "#1e3a8a", color: "white", border: "none", borderRadius: "12px", fontWeight: "bold", cursor: "pointer", fontSize: "15px" }
  };

  const progress = step === 1 ? 0 : step === 2 ? 50 : 100;

  return (
    <div style={styles.page}>
      <div style={styles.glassCard}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h2 style={{ color: "#1e3a8a", margin: "0 0 5px" }}>Apply for Benefits</h2>
          <p style={{ color: "#64748b", fontSize: "13px" }}>Step {step} of 3: {step === 1 ? "Personal" : step === 2 ? "Scheme" : "Finalize"}</p>
        </div>

        <div style={styles.stepper}>
          <div style={styles.progressLine(progress)}></div>
          <div style={styles.stepItem(step >= 1)}>1</div>
          <div style={styles.stepItem(step >= 2)}>2</div>
          <div style={styles.stepItem(step >= 3)}>3</div>
        </div>

        <form onSubmit={submitForm}>
          {step === 1 && (
            <div className="animate-fade">
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name</label>
                <input style={styles.input} name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Registered Mobile</label>
                <input style={styles.input} type="tel" name="phone" value={form.phone} onChange={handleChange} required />
              </div>
              <button type="button" onClick={nextStep} style={{ ...styles.btnPrimary, width: "100%", marginTop: "10px" }}>Continue to Selection</button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade">
              <div style={styles.inputGroup}>
                <label style={styles.label}>Benefit Scheme</label>
                <select style={styles.input} name="scheme" value={form.scheme} onChange={handleChange} required>
                  <option value="">-- Select --</option>
                  {schemes.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Annual Family Income (₹)</label>
                <input style={styles.input} type="number" name="income" value={form.income} onChange={handleChange} required />
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button type="button" onClick={prevStep} style={{ flex: 1, padding: "14px", border: "1px solid #e2e8f0", background: "white", borderRadius: "12px", cursor: "pointer", color: "#64748b" }}>Back</button>
                <button type="button" onClick={nextStep} style={{ ...styles.btnPrimary, flex: 1 }}>Next Step</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade">
              <div style={styles.inputGroup}>
                <label style={styles.label}>Aadhaar Card Number</label>
                <input style={styles.input} name="aadhaar_no" maxLength="12" placeholder="12 Digit Number" value={form.aadhaar_no} onChange={handleChange} required />
              </div>
              <div style={{ background: "#f8fafc", padding: "15px", borderRadius: "15px", marginBottom: "15px", border: "1px dashed #cbd5e1" }}>
                <label style={styles.label}>Aadhaar Copy (Image)</label>
                <input type="file" name="aadhaarFile" onChange={handleFileChange} style={{ fontSize: "11px", marginTop: "8px", display: "block" }} required />
              </div>
              <div style={{ background: "#f8fafc", padding: "15px", borderRadius: "15px", marginBottom: "15px", border: "1px dashed #cbd5e1" }}>
                <label style={styles.label}>Income Proof (Image)</label>
                <input type="file" name="incomeFile" onChange={handleFileChange} style={{ fontSize: "11px", marginTop: "8px", display: "block" }} required />
              </div>
              <div style={{ display: "flex", gap: "10px", marginBottom: "20px", alignItems: "center" }}>
                <input type="checkbox" name="declaration" checked={form.declaration} onChange={handleChange} required />
                <label style={{ fontSize: "11px", color: "#64748b", lineHeight: "1.4" }}>I certify that all details provided are correct to my knowledge.</label>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button type="button" onClick={prevStep} style={{ flex: 1, padding: "14px", border: "1px solid #e2e8f0", background: "white", borderRadius: "12px", cursor: "pointer", color: "#64748b" }}>Back</button>
                <button type="submit" disabled={isSubmitting} style={{ ...styles.btnPrimary, flex: 1, background: "#10b981" }}>
                  {isSubmitting ? "Uploading..." : "Finish & Submit"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default ApplyScheme;