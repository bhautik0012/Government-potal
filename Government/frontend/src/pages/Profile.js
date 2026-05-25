import React, { useState, useEffect, useRef } from "react";
import { api, uploadsUrl } from "../config/api";
import QRCode from "react-qr-code";
import { toJpeg } from 'html-to-image';
import SignatureCanvas from 'react-signature-canvas';
import Tesseract from "tesseract.js";

function Profile() {
  const idCardRef = useRef(null);
  const sigPad = useRef(null);
  
  const [profileImage, setProfileImage] = useState(localStorage.getItem("userImage") || "");
  const [signature, setSignature] = useState(localStorage.getItem("userSignature") || "");
  
  // --- PROFILE UPDATE STATES ---
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(localStorage.getItem("userName") || "Citizen");
  const [editMobile, setEditMobile] = useState(localStorage.getItem("userMobile") || "Not Provided");
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false); 

  const [vaultDocs, setVaultDocs] = useState([]);
  const userEmail = localStorage.getItem("userEmail") || "N/A";

  useEffect(() => {
    fetchVault();
    // Sync mobile from local storage if it exists
    const storedMobile = localStorage.getItem("userMobile");
    if (storedMobile) setEditMobile(storedMobile);
  }, []);

  const fetchVault = async () => {
    try {
      const res = await api.get(`/api/user/my-vault/${userEmail}`);
      setVaultDocs(res.data);
    } catch (err) {
      console.error("Vault Fetch Error:", err);
    }
  };

  // --- SAVE PROFILE LOGIC ---
  const handleProfileUpdate = async () => {
    try {
      // Body must include the email so Flask knows WHICH user to update
      const response = await api.put(`/api/user/update-profile`, {
        email: userEmail, 
        name: editName,
        mobile: editMobile 
      });

      if (response.status === 200) {
        localStorage.setItem("userName", editName);
        localStorage.setItem("userMobile", editMobile);
        
        // This triggers the Navbar and other components to refresh
        window.dispatchEvent(new Event("storage")); 
        
        setIsEditing(false);
        alert("✨ Profile updated successfully!");
      }
    } catch (err) {
      console.error("Update Error:", err.response?.data);
      alert(`❌ Failed: ${err.response?.data?.message || "Check backend connection"}`);
    }
  };

  const handleVaultUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const docType = prompt("Enter Document Name (e.g. Aadhaar):") || "General";
    const formData = new FormData();
    formData.append("file", file); 
    formData.append("email", userEmail);
    formData.append("doc_type", docType);

    setIsUploading(true);
    try {
      await api.post(`/api/user/upload-document`, formData);
      alert("✅ Document secured!");
      fetchVault();
    } catch (err) { alert("❌ Upload failed."); } 
    finally { setIsUploading(false); }
  };

  const handleAiVerify = async (doc) => {
    const imageUrl = uploadsUrl(doc.file);
    setIsScanning(true);
    setScanProgress(0);
    try {
      const { data: { text } } = await Tesseract.recognize(imageUrl, 'eng', {
        logger: m => { if (m.status === 'recognizing text') setScanProgress(Math.floor(m.progress * 100)); }
      });
      if (text.toLowerCase().includes(editName.toLowerCase())) {
        await api.put(`/api/user/verify-document/${doc.id}`);
        alert("✨ AI Verified!");
        fetchVault();
      } else { alert("❌ No name match found."); }
    } catch (err) { alert("AI Error."); } 
    finally { setIsScanning(false); }
  };

  const saveSignature = () => {
    if (!sigPad.current || sigPad.current.isEmpty()) return;
    const dataURL = sigPad.current.getCanvas().toDataURL('image/png');
    setSignature(dataURL);
    localStorage.setItem("userSignature", dataURL);
  };

  const downloadIDCard = () => {
    if (!idCardRef.current) return;
    toJpeg(idCardRef.current, { quality: 0.95, backgroundColor: "#1e3a8a" })
      .then((url) => {
        const link = document.createElement('a');
        link.download = `Gov_ID_${editName}.jpg`;
        link.href = url;
        link.click();
      });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        localStorage.setItem("userImage", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const styles = {
    container: { padding: "40px 5%", background: "#f8fafc", minHeight: "100vh", fontFamily: "'Poppins', sans-serif" },
    mainGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "30px" },
    card: { background: "white", padding: "30px", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" },
    idCard: {
      background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
      color: "white", padding: "25px", borderRadius: "20px", position: "relative", height: "240px",
      display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden"
    },
    input: { width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", marginTop: "8px", marginBottom: "15px", fontSize: "14px" },
    editBtn: { background: "#eff6ff", color: "#2563eb", border: "none", padding: "10px 20px", borderRadius: "12px", fontWeight: "bold", cursor: "pointer" },
    saveBtn: { background: "#10b981", color: "white", border: "none", padding: "10px 20px", borderRadius: "12px", fontWeight: "bold", cursor: "pointer" },
    docItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px", background: "#f1f5f9", borderRadius: "15px", marginBottom: "12px" }
  };

  return (
    <div style={styles.container}>
      <h1 style={{ color: "#1e3a8a", fontWeight: "bold", marginBottom: "30px" }}>Digital Identity & Profile</h1>

      {isScanning && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(15, 23, 42, 0.95)", zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white" }}>
          <div style={{fontSize: "50px", marginBottom: "20px"}}>🧠</div>
          <h3>AI DOCUMENT VERIFICATION</h3>
          <p>{scanProgress}% Analyzed</p>
        </div>
      )}
      
      <div style={styles.mainGrid}>
        
        {/* SECTION 1: ACCOUNT DETAILS */}
        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
             <h3 style={{ margin: 0 }}>My Account</h3>
             {!isEditing ? (
               <button onClick={() => setIsEditing(true)} style={styles.editBtn}>Edit Profile</button>
             ) : (
               <button onClick={handleProfileUpdate} style={styles.saveBtn}>Save Changes</button>
             )}
          </div>

          <div style={{ position: "relative", width: "110px", height: "110px", margin: "0 auto 25px" }}>
            <img src={profileImage || "https://via.placeholder.com/110"} alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "4px solid #f1f5f9" }} />
            <label htmlFor="file-upload" style={{ position: "absolute", bottom: "5px", right: "5px", background: "white", padding: "7px", borderRadius: "50%", cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
              📸<input id="file-upload" type="file" style={{ display: "none" }} onChange={handleImageChange} />
            </label>
          </div>

          {!isEditing ? (
            <div style={{ textAlign: "center" }}>
              <h2 style={{ margin: "0 0 5px" }}>{editName}</h2>
              <p style={{ color: "#64748b", margin: "0 0 15px" }}>{userEmail}</p>
              <div style={{ background: "#f8fafc", padding: "10px", borderRadius: "10px", display: "inline-block" }}>
                <span style={{ color: "#64748b", fontSize: "13px" }}>Verified Mobile: </span>
                <strong style={{ color: "#1e293b" }}>{editMobile}</strong>
              </div>
            </div>
          ) : (
            <div>
              <label style={{ fontSize: "11px", fontWeight: "800", color: "#64748b" }}>FULL NAME</label>
              <input style={styles.input} value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Enter full name" />
              
              <label style={{ fontSize: "11px", fontWeight: "800", color: "#64748b" }}>MOBILE NUMBER</label>
              <input style={styles.input} value={editMobile} onChange={(e) => setEditMobile(e.target.value)} placeholder="e.g. +91 9876543210" />
              
              <label style={{ fontSize: "11px", fontWeight: "800", color: "#64748b" }}>EMAIL (LOCKED)</label>
              <input style={{ ...styles.input, background: "#f1f5f9", color: "#94a3b8" }} value={userEmail} disabled />
            </div>
          )}
        </div>

        {/* SECTION 2: DIGITAL PASS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div ref={idCardRef} style={styles.idCard}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div><p style={{ margin: 0, fontSize: "9px", opacity: 0.8, letterSpacing: "1px" }}>REPUBLIC OF INDIA</p><h4 style={{ margin: 0 }}>Digital Citizen Pass</h4></div>
              <div style={{ width: "35px", height: "22px", background: "#fbbf24", borderRadius: "4px" }}></div>
            </div>
            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
              <img src={profileImage || "https://via.placeholder.com/65"} alt="ID" style={{ width: "65px", height: "65px", borderRadius: "12px", border: "2px solid white", objectFit: "cover", background: "white" }} />
              <div>
                <h3 style={{ margin: 0, fontSize: "19px" }}>{editName.toUpperCase()}</h3>
                <p style={{ margin: 0, fontSize: "11px", opacity: 0.9 }}>{editMobile}</p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div style={{ fontSize: "10px", opacity: 0.8 }}>{userEmail}</div>
              <div style={{ background: "white", padding: "4px", borderRadius: "6px" }}>
                <QRCode value={`VERIFIED_${userEmail}_${editMobile}`} size={40} />
              </div>
            </div>
          </div>
          <button style={{ width: "100%", padding: "15px", background: "#10b981", color: "white", border: "none", borderRadius: "15px", cursor: "pointer", fontWeight: "bold" }} onClick={downloadIDCard}>📥 Download Identity Pass</button>
        </div>

        {/* SECTION 3: VAULT */}
        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ margin: 0 }}>Document Vault</h3>
            <label style={{ color: "#2563eb", cursor: "pointer", fontWeight: "bold", fontSize: "13px", padding: "5px 10px", background: "#eff6ff", borderRadius: "8px" }}>
              {isUploading ? "Uploading..." : "+ Add Document"}
              <input type="file" style={{ display: "none" }} onChange={handleVaultUpload} disabled={isUploading} />
            </label>
          </div>
          <div style={{maxHeight: "250px", overflowY: "auto"}}>
            {vaultDocs.map((doc) => (
              <div key={doc.id} style={styles.docItem}>
                <div>
                  <p style={{ margin: 0, fontWeight: "600", fontSize: "14px" }}>{doc.name} {doc.is_verified && "✅"}</p>
                  <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>{doc.is_verified ? "AI-Verified" : "Stored"}</p>
                </div>
                <div style={{display: "flex", gap: "8px"}}>
                  {!doc.is_verified && <button onClick={() => handleAiVerify(doc)} style={{background: "#3b82f6", color: "white", border: "none", padding: "5px 10px", borderRadius: "8px", fontSize: "11px", cursor: "pointer"}}>Verify</button>}
                  <button onClick={() => window.open(uploadsUrl(doc.file), "_blank")} style={{ background: "#1e3a8a", color: "white", border: "none", padding: "5px 12px", borderRadius: "8px", fontSize: "11px", cursor: "pointer" }}>View</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;