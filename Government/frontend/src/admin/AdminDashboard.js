import React, { useState, useEffect } from "react";
import { api, API_BASE, uploadsUrl } from "../config/api";
import { useNavigate } from "react-router-dom";
import ManageSchemes from "./ManageSchemes"; 

function AdminDashboard() {
  const [apps, setApps] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, health: 100 });
  const [activeTab, setActiveTab] = useState("applications");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showResolved, setShowResolved] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role === "admin") {
      setIsAuthorized(true);
      fetchData(); 
    } else {
      alert("Unauthorized Access!");
      navigate("/admin-login");
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      const appsRes = await api.get("/api/admin/all-applications");
      const inqRes = await api.get("/api/admin/inquiries");
      
      setApps(appsRes.data);
      setInquiries(inqRes.data);
      
      setStats({
        total: appsRes.data.length,
        pending: appsRes.data.filter(a => a.status === "Pending").length,
        health: 100 
      });
    } catch (err) {
      console.error("Error fetching admin data", err);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    let remark = "";
    if (newStatus === "Rejected") {
      remark = prompt("Please enter the reason for rejection:");
      if (!remark) return; // Cancel if no reason given
    }

    try {
      await api.put("/api/admin/update-status", { 
        id, 
        status: newStatus,
        remarks: remark 
      });
      alert(`Application #${id} is now ${newStatus}`);
      fetchData(); 
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const viewDocument = (filename) => {
    if (!filename) {
      alert("No document uploaded for this application.");
      return;
    }
    window.open(uploadsUrl(filename), "_blank");
  };

  const styles = {
    adminPage: { display: "flex", minHeight: "100vh", background: "#0f172a", fontFamily: "'Poppins', sans-serif", color: "white" },
    sidebar: { width: "280px", background: "#1e293b", padding: "40px 20px", borderRight: "1px solid #334155", position: "sticky", top: 0, height: "100vh" },
    content: { flex: 1, padding: "40px", background: "#0f172a" },
    navBtn: (active) => ({
      width: "100%", padding: "14px", marginBottom: "12px", borderRadius: "10px", 
      border: active ? "none" : "1px solid #334155",
      background: active ? "#38bdf8" : "transparent", 
      color: active ? "#0f172a" : "white", 
      fontWeight: "bold", cursor: "pointer", textAlign: "left", transition: "0.3s"
    }),
    statCard: { background: "#1e293b", padding: "30px", borderRadius: "15px", border: "1px solid #334155", textAlign: "center" },
    table: { width: "100%", marginTop: "30px", borderCollapse: "collapse", background: "#1e293b", borderRadius: "15px", overflow: "hidden" },
    th: { background: "#334155", color: "#94a3b8", padding: "15px", textAlign: "left" },
    td: { padding: "15px", borderBottom: "1px solid #334155", color: "#cbd5e1" },
    docBtn: { background: "#475569", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", fontSize: "11px", cursor: "pointer", marginRight: "5px" },
    statusBadge: (status) => ({
      padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold",
      background: status === "Approved" ? "#22c55e" : status === "Rejected" ? "#ef4444" : "#facc15",
      color: "#0f172a"
    })
  };

  if (!isAuthorized) {
    return <div style={{background: "#0f172a", height: "100vh", color: "white", padding: "50px"}}>Authenticating Admin Access...</div>;
  }

  return (
    <div style={styles.adminPage}>
      <div style={styles.sidebar}>
        <h2 style={{color: "#38bdf8", marginBottom: "40px"}}>OFFICER PANEL</h2>
        <button onClick={() => setActiveTab("applications")} style={styles.navBtn(activeTab === "applications")}>📂 Applications</button>
        <button onClick={() => setActiveTab("schemes")} style={styles.navBtn(activeTab === "schemes")}>📜 Manage Schemes</button>
        <button onClick={() => setActiveTab("inquiries")} style={styles.navBtn(activeTab === "inquiries")}>💬 User Inquiries</button>
      </div>

      <div style={styles.content}>
        <header style={{display: "flex", justifyContent: "space-between", marginBottom: "40px"}}>
          <h1>Command Center</h1>
          <div style={{background: "#334155", padding: "10px 20px", borderRadius: "30px", fontSize: "14px"}}>Admin: {localStorage.getItem("userName")}</div>
        </header>

        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px"}}>
          <div style={styles.statCard}><p>Total Requests</p><h1>{stats.total}</h1></div>
          <div style={styles.statCard}><p>Pending</p><h1 style={{color: "#facc15"}}>{stats.pending}</h1></div>
          <div style={styles.statCard}><p>System Health</p><h1 style={{color: "#4ade80"}}>100%</h1></div>
        </div>

        <div style={{marginTop: "20px"}}>
            {activeTab === "applications" && (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Applicant Details</th>
                    <th style={styles.th}>Scheme</th>
                    <th style={styles.th}>Documents</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Decision</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.length > 0 ? apps.map(app => (
                    <tr key={app.id}>
                      <td style={styles.td}>
                        <strong>{app.applicant_name}</strong><br/>
                        <small>{app.email}</small>
                      </td>
                      <td style={styles.td}>{app.name}</td>
                      <td style={styles.td}>
                        <button style={styles.docBtn} onClick={() => viewDocument(app.aadhaar)}>Aadhaar</button>
                        <button style={styles.docBtn} onClick={() => viewDocument(app.income_proof)}>Income</button>
                      </td>
                      <td style={styles.td}><span style={styles.statusBadge(app.status)}>{app.status}</span></td>
                      <td style={styles.td}>
                        {app.status === "Pending" ? (
                          <div style={{display: "flex", gap: "5px"}}>
                            <button onClick={() => handleStatusUpdate(app.id, "Approved")} style={{background: "#22c55e", border: "none", color: "white", padding: "8px 12px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold"}}>✓</button>
                            <button onClick={() => handleStatusUpdate(app.id, "Rejected")} style={{background: "#ef4444", border: "none", color: "white", padding: "8px 12px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold"}}>✕</button>
                          </div>
                        ) : (
                           <small style={{color: "#94a3b8 italic"}}>{app.remarks || "No remarks"}</small>
                        )}
                      </td>
                    </tr>
                  )) : <tr><td colSpan="5" style={{...styles.td, textAlign: "center"}}>No applications found.</td></tr>}
                </tbody>
              </table>
            )}

            {activeTab === "inquiries" && (
              <div>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "30px"}}>
                   <h3>Citizen Inquiries</h3>
                   <label style={{fontSize: "14px", color: "#94a3b8", cursor: "pointer"}}>
                      <input type="checkbox" checked={showResolved} onChange={() => setShowResolved(!showResolved)} style={{marginRight: "8px"}}/>
                      Show Resolved
                   </label>
                </div>

                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Sender</th>
                      <th style={styles.th}>Subject</th>
                      <th style={styles.th}>Message</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries
                      .filter(inq => inq.is_resolved === showResolved)
                      .map((inq) => (
                      <tr key={inq.id}>
                        <td style={styles.td}><strong>{inq.name}</strong><br/><small>{inq.email}</small></td>
                        <td style={styles.td}>{inq.subject}</td>
                        <td style={styles.td}>{inq.message}</td>
                        <td style={styles.td}>
                          {!inq.is_resolved ? (
                            <div style={{ display: "flex", gap: "10px" }}>
                                <button onClick={() => window.location.href=`mailto:${inq.email}`} style={{background: "#38bdf8", color: "#0f172a", border: "none", padding: "8px 15px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer"}}>Reply</button>
                                <button onClick={() => api.put(`/api/admin/resolve-inquiry/${inq.id}`).then(fetchData)} style={{background: "#4ade80", color: "#0f172a", border: "none", padding: "8px 15px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer"}}>Resolve</button>
                            </div>
                          ) : <span style={{color: "#4ade80"}}>Resolved</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "schemes" && <ManageSchemes />}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;