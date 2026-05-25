import React, { useState, useEffect } from "react";
import { api } from "../config/api";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

// --- STEPPER COMPONENT ---
const Stepper = ({ currentStatus }) => {
  const steps = ["Submitted", "Verified", "In Review", "Final Decision"];
  
  const getActiveStep = (status) => {
    if (status === "Pending") return 0;
    if (status === "Verified") return 1;
    if (status === "Under Review") return 2;
    if (status === "Approved" || status === "Rejected") return 3;
    return 0;
  };

  const activeStep = getActiveStep(currentStatus);

  return (
    <div style={{ margin: "15px 0", padding: "10px", background: "#f8fafc", borderRadius: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2 }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                background: index <= activeStep ? (currentStatus === "Rejected" && index === 3 ? "#ef4444" : "#10b981") : "#e2e8f0",
                color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", fontWeight: "bold", transition: "0.4s"
              }}>
                {index < activeStep ? "✓" : index + 1}
              </div>
              <p style={{ 
                marginTop: "6px", fontSize: "10px", fontWeight: "600",
                color: index <= activeStep ? "#1e293b" : "#94a3b8" 
              }}>{step}</p>
            </div>
            {index < steps.length - 1 && (
              <div style={{
                position: "absolute", top: "14px", left: `${(index * 33.3) + 16.5}%`,
                width: "16.5%", height: "2px",
                background: index < activeStep ? "#10b981" : "#e2e8f0",
                zIndex: 1
              }}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

function Dashboard() {
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null); // To toggle stepper view

  const userEmail = localStorage.getItem("userEmail");
  const userName = localStorage.getItem("userName") || "Citizen";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get(`/api/user/my-applications/${userEmail}`);
        const allApps = res.data;

        setStats({
          total: allApps.length,
          approved: allApps.filter(a => a.status === "Approved").length,
          pending: allApps.filter(a => a.status === "Pending").length,
          rejected: allApps.filter(a => a.status === "Rejected").length,
        });

        setRecentApps(allApps.slice(-5).reverse());
        setLoading(false);
      } catch (err) {
        console.error("Dashboard Error:", err);
        setLoading(false);
      }
    };
    if (userEmail) fetchDashboardData();
  }, [userEmail]);

  const downloadCertificate = async (app) => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const qrData = `Verify: govportal.in/verify/${app.id}\nUser: ${userName}`;
    const qrCodeDataUri = await QRCode.toDataURL(qrData);

    doc.setLineWidth(1.5);
    doc.setDrawColor(30, 58, 138); 
    doc.rect(10, 10, 277, 190); 
    doc.addImage(qrCodeDataUri, 'PNG', 240, 20, 30, 30);
    doc.setFontSize(22);
    doc.text("GOVERNMENT PORTAL 2026", 148, 40, { align: "center" });
    doc.setFontSize(28);
    doc.text("CERTIFICATE OF APPROVAL", 148, 80, { align: "center" });
    doc.setFontSize(16);
    doc.text(`This is to certify that ${userName.toUpperCase()}`, 148, 110, { align: "center" });
    doc.text(`is approved for: ${app.scheme}`, 148, 125, { align: "center" });
    doc.save(`Certificate_${app.id}.pdf`);
  };

  const styles = {
    page: { fontFamily: "'Poppins', sans-serif", background: "#f1f5f9", minHeight: "100vh", display: "flex" },
    sidebar: { width: "260px", background: "#1e3a8a", color: "white", padding: "30px 20px", display: "flex", flexDirection: "column", gap: "20px", position: "sticky", top: 0, height: "100vh" },
    main: { flex: 1, padding: "40px" },
    card: (bg) => ({ background: "white", padding: "25px", borderRadius: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", borderLeft: `6px solid ${bg}` }),
    statusBadge: (status) => ({
      padding: "5px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold", cursor: "pointer",
      background: status === "Approved" ? "#dcfce7" : status === "Rejected" ? "#fee2e2" : "#fef9c3",
      color: status === "Approved" ? "#166534" : status === "Rejected" ? "#991b1b" : "#854d0e"
    })
  };

  if (loading) return <div style={{padding: "50px", textAlign: "center"}}>Loading...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <h2>GovAssist</h2>
        <Link to="/dashboard" style={{padding: "12px", background: "rgba(255,255,255,0.1)", borderRadius: "10px", color: "white", textDecoration: "none"}}>Overview</Link>
        <Link to="/schemes" style={{color: "white", textDecoration: "none"}}>Find Schemes</Link>
        <Link to="/profile" style={{color: "white", textDecoration: "none"}}>My Profile</Link>
      </div>

      <div style={styles.main}>
        <h1>Welcome, {userName}!</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", margin: "30px 0" }}>
          <div style={styles.card("#3b82f6")}><h4>Total</h4><h2>{stats.total}</h2></div>
          <div style={styles.card("#10b981")}><h4>Approved</h4><h2 style={{color: "#10b981"}}>{stats.approved}</h2></div>
          <div style={styles.card("#f59e0b")}><h4>Pending</h4><h2 style={{color: "#f59e0b"}}>{stats.pending}</h2></div>
          <div style={styles.card("#ef4444")}><h4>Rejected</h4><h2 style={{color: "#ef4444"}}>{stats.rejected}</h2></div>
        </div>

        <div style={{ background: "white", padding: "30px", borderRadius: "20px" }}>
          <h3>Recent Activity</h3>
          <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#94a3b8", fontSize: "13px" }}>
                <th style={{ padding: "10px" }}>SCHEME</th>
                <th style={{ padding: "10px" }}>DATE</th>
                <th style={{ padding: "10px" }}>STATUS</th>
                <th style={{ padding: "10px" }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {recentApps.map((app) => (
                <React.Fragment key={app.id}>
                  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "15px", fontWeight: "600" }}>{app.scheme}</td>
                    <td style={{ padding: "15px" }}>{app.date}</td>
                    <td style={{ padding: "15px" }}>
                      <span 
                        style={styles.statusBadge(app.status)}
                        onClick={() => setExpandedRow(expandedRow === app.id ? null : app.id)}
                      >
                        {app.status} {expandedRow === app.id ? "▲" : "▼"}
                      </span>
                    </td>
                    <td style={{ padding: "15px" }}>
                      {app.status === "Approved" && (
                        <button onClick={() => downloadCertificate(app)} style={{ background: "#1e3a8a", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}>Download</button>
                      )}
                    </td>
                  </tr>
                  {expandedRow === app.id && (
                    <tr>
                      <td colSpan="4" style={{ padding: "0 15px 15px" }}>
                        <Stepper currentStatus={app.status} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;