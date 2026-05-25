import React, { useState, useEffect } from "react";
import { api } from "../config/api";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const checkNotifications = async () => {
      try {
        const res = await api.get(`/api/user/my-applications/${userEmail}`);
        const updates = res.data.filter(app => app.status !== "Pending");
        
        // Check if we have more processed apps than last time
        const lastCount = parseInt(localStorage.getItem("notifCount") || "0");
        if (updates.length > lastCount) {
          setHasNew(true);
        }
        
        setNotifications(updates.reverse()); // Latest updates first
      } catch (err) {
        console.error("Notif Error:", err);
      }
    };

    if (userEmail) {
      checkNotifications();
      // Check every 30 seconds for updates
      const interval = setInterval(checkNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [userEmail]);

  const toggleNotifs = () => {
    setShowDropdown(!showDropdown);
    setHasNew(false);
    localStorage.setItem("notifCount", notifications.length.toString());
  };

  const styles = {
    wrapper: { position: "relative", cursor: "pointer", display: "flex", alignItems: "center" },
    bellIcon: { fontSize: "20px", color: "#64748b" },
    badge: { position: "absolute", top: "-5px", right: "-5px", width: "10px", height: "10px", background: "#ef4444", borderRadius: "50%", border: "2px solid white" },
    dropdown: { position: "absolute", top: "40px", right: "0", width: "300px", background: "white", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.15)", zIndex: 1000, padding: "15px", border: "1px solid #e2e8f0" },
    item: { padding: "10px", borderBottom: "1px solid #f1f5f9", fontSize: "13px" },
    status: (s) => ({ fontWeight: "bold", color: s === "Approved" ? "#10b981" : "#ef4444" })
  };

  return (
    <div style={styles.wrapper}>
      <div onClick={toggleNotifs} style={{fontSize: "22px"}}>
        🔔 {hasNew && <div style={styles.badge}></div>}
      </div>

      {showDropdown && (
        <div style={styles.dropdown}>
          <h4 style={{ margin: "0 0 10px 0", borderBottom: "1px solid #eee", paddingBottom: "5px" }}>Updates</h4>
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div key={n.id} style={styles.item}>
                  Your application for <strong>{n.scheme}</strong> has been 
                  <span style={styles.status(n.status)}> {n.status.toLowerCase()}</span>.
                </div>
              ))
            ) : (
              <p style={{ fontSize: "12px", color: "#94a3b8", textAlign: "center" }}>No updates yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;