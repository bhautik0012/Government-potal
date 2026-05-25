import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("Pending");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/admin/all-applications");
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching applications");
    }
  };

  // --- UPDATED STATUS UPDATE LOGIC ---
  const handleStatusUpdate = async (id, newStatus) => {
    let reason = "";

    // Ask for a reason if the status is "Rejected"
    if (newStatus === "Rejected") {
      reason = prompt("Please provide a reason for rejection (e.g., Documents incomplete, Income limit exceeded):");
      
      // If the admin clicks cancel or leaves it blank, stop the process
      if (reason === null) return; 
      if (reason.trim() === "") {
        alert("A reason is required to reject an application.");
        return;
      }
    }

    try {
      await axios.put("http://127.0.0.1:5000/api/admin/update-status", { 
        id, 
        status: newStatus,
        remarks: reason // Send the reason to the backend
      });
      alert(`Application ${newStatus} successfully!`);
      fetchApplications(); // Refresh list to show updated status
    } catch (err) {
      alert("Status update failed. Check if backend is running.");
    }
  };

  const styles = {
    container: { padding: "40px", fontFamily: "'Poppins', sans-serif", background: "#f8fafc", minHeight: "100vh" },
    tableCard: { background: "white", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" },
    statusHeader: { display: "flex", gap: "10px", marginBottom: "20px" },
    tab: (active) => ({
      padding: "10px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: "bold",
      background: active ? "#1e3a8a" : "#e2e8f0", color: active ? "white" : "#64748b", border: "none",
      transition: "0.3s"
    }),
    table: { width: "100%", borderCollapse: "collapse", marginTop: "20px" },
    th: { textAlign: "left", padding: "15px", borderBottom: "2px solid #f1f5f9", color: "#64748b", fontSize: "13px" },
    td: { padding: "15px", borderBottom: "1px solid #f1f5f9", fontSize: "14px" },
    approveBtn: { background: "#10b981", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", marginRight: "5px", fontWeight: "600" },
    rejectBtn: { background: "#ef4444", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }
  };

  const filteredApps = applications.filter(app => app.status === filter || filter === "All");

  return (
    <div style={styles.container}>
      <h1 style={{ color: "#1e3a8a", marginBottom: "30px" }}>Application Review Board</h1>

      <div style={styles.tableCard}>
        <div style={styles.statusHeader}>
          <button style={styles.tab(filter === "Pending")} onClick={() => setFilter("Pending")}>Pending</button>
          <button style={styles.tab(filter === "Approved")} onClick={() => setFilter("Approved")}>Approved</button>
          <button style={styles.tab(filter === "Rejected")} onClick={() => setFilter("Rejected")}>Rejected</button>
          <button style={styles.tab(filter === "All")} onClick={() => setFilter("All")}>All</button>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>APPLICANT</th>
              <th style={styles.th}>SCHEME</th>
              <th style={styles.th}>INCOME</th>
              <th style={styles.th}>DATE</th>
              <th style={styles.th}>STATUS</th>
              <th style={styles.th}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.map((app) => (
              <tr key={app.id}>
                <td style={styles.td}>
                  <div style={{ fontWeight: "bold" }}>{app.applicant_name}</div>
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>{app.email}</div>
                </td>
                <td style={styles.td}>{app.name}</td>
                <td style={styles.td}>₹{app.income?.toLocaleString()}</td>
                <td style={styles.td}>{app.date}</td>
                <td style={styles.td}>
                   <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ 
                        color: app.status === "Approved" ? "#10b981" : app.status === "Rejected" ? "#ef4444" : "#f59e0b",
                        fontWeight: "bold"
                      }}>{app.status}</span>
                      {app.status === "Rejected" && app.remarks && (
                        <span style={{ fontSize: "11px", color: "#ef4444", fontStyle: "italic" }}>
                          Reason: {app.remarks}
                        </span>
                      )}
                   </div>
                </td>
                <td style={styles.td}>
                  {app.status === "Pending" ? (
                    <>
                      <button style={styles.approveBtn} onClick={() => handleStatusUpdate(app.id, "Approved")}>Approve</button>
                      <button style={styles.rejectBtn} onClick={() => handleStatusUpdate(app.id, "Rejected")}>Reject</button>
                    </>
                  ) : (
                    <span style={{ color: "#94a3b8", fontSize: "12px", fontWeight: "500" }}>
                      Processed on {app.date}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredApps.length === 0 && <p style={{textAlign: "center", padding: "40px", color: "#94a3b8"}}>No applications found in this category.</p>}
      </div>
    </div>
  );
}

export default AdminApplications;