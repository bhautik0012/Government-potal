import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { api } from "../config/api";

// --- 1. TRANSLATION DATA ---
const translations = {
  en: {
    home: "Home", about: "About", contact: "Contact Us", help: "Help",
    login: "Login", register: "Register", officer: "Officer Portal",
    schemes: "Schemes", apply: "Apply", dashboard: "My Dashboard",
    command: "Command Center", logout: "Logout", welcome: "Hi",
    announcement: "IMPORTANT ANNOUNCEMENT", updates: "Updates", no_updates: "No new updates"
  },
  hi: {
    home: "होम", about: "हमारे बारे में", contact: "संपर्क करें", help: "सहायता",
    login: "लॉगिन", register: "पंजीकरण", officer: "अधिकारी पोर्टल",
    schemes: "योजनाएं", apply: "आवेदन करें", dashboard: "मेरा डैशबोर्ड",
    command: "कमांड सेंटर", logout: "लॉगआउट", welcome: "नमस्ते",
    announcement: "महत्वपूर्ण सूचना", updates: "अपडेट", no_updates: "कोई नया अपडेट नहीं"
  },
  gu: {
    home: "હોમ", about: "અમારા વિશે", contact: "સંપર્ક કરો", help: "મદદ",
    login: "લોગિન", register: "રજીસ્ટર", officer: "અધિકારી પોર્ટલ",
    schemes: "યોજનાઓ", apply: "અરજી કરો", dashboard: "મારું ડેશબોર્ડ",
    command: "કમાન્ડ સેન્ટર", logout: "લોગ આઉટ", welcome: "નમસ્તે",
    announcement: "મહત્વપૂર્ણ જાહેરાત", updates: "અપડેટ્સ", no_updates: "કોઈ નવા અપડેટ નથી"
  }
};

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [news, setNews] = useState("");
  const [navImage, setNavImage] = useState(localStorage.getItem("userImage") || "");
  const [lang, setLang] = useState(localStorage.getItem("appLang") || "en");
  const t = translations[lang];

  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [hasUnseen, setHasUnseen] = useState(false);

  const userEmail = localStorage.getItem("userEmail");
  const userRole = localStorage.getItem("userRole");
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    api.get("/api/announcements")
      .then(res => {
        if (res.data.length > 0) setNews(res.data[res.data.length - 1].content);
      })
      .catch(err => console.error("News Fetch Error:", err));

    const fetchNotifications = async () => {
      if (userEmail && userRole === "citizen") {
        try {
          const res = await api.get(`/api/user/my-applications/${userEmail}`);
          const processed = res.data.filter(a => a.status !== "Pending");
          setNotifications(processed.reverse());

          const lastSeenCount = parseInt(localStorage.getItem("notifCount") || "0");
          if (processed.length > lastSeenCount) {
            setHasUnseen(true);
          }
        } catch (err) {
          console.error("Notif Error:", err);
        }
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);

    const handleStorageChange = () => {
      setNavImage(localStorage.getItem("userImage") || "");
      setLang(localStorage.getItem("appLang") || "en"); 
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [userEmail, userRole]);

  const toggleNotifications = () => {
    setShowNotif(!showNotif);
    setHasUnseen(false);
    localStorage.setItem("notifCount", notifications.length.toString());
  };

  const handleLangChange = (e) => {
    const newLang = e.target.value;
    setLang(newLang);
    localStorage.setItem("appLang", newLang);
    window.dispatchEvent(new Event("storage")); 
  };

  const handleLogout = () => {
    localStorage.clear();
    setNavImage("");
    navigate("/login");
  };

  const clearNotifications = () => {
    if (window.confirm("Clear all notification history?")) {
      setNotifications([]);
      setHasUnseen(false);
      localStorage.setItem("notifCount", "0"); 
      setShowNotif(false);
    }
  };

  const styles = {
    ticker: { background: "#fbbf24", color: "#1e3a8a", padding: "8px 0", fontSize: "13px", fontWeight: "bold", textAlign: "center", borderBottom: "1px solid rgba(0,0,0,0.1)" },
    nav: { display: "flex", justifyContent: "space-between", padding: "15px 5%", background: "#1e3a8a", color: "white", alignItems: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", position: "relative" },
    links: { display: "flex", gap: "25px", alignItems: "center" },
    navLink: ({ isActive }) => ({
      color: "white", textDecoration: "none", fontWeight: "500", padding: "5px 0", transition: "0.3s",
      borderBottom: isActive ? "3px solid #fbbf24" : "3px solid transparent",
    }),
    notifWrapper: { position: "relative", cursor: "pointer", fontSize: "20px" },
    redDot: { position: "absolute", top: "-2px", right: "-2px", width: "10px", height: "10px", background: "#ef4444", borderRadius: "50%", border: "2px solid #1e3a8a" },
    dropdown: { position: "absolute", top: "60px", right: "15%", width: "280px", background: "white", color: "#334155", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", zIndex: 1000, padding: "15px", border: "1px solid #e2e8f0" },
    notifItem: { padding: "10px", borderBottom: "1px solid #f1f5f9", fontSize: "12px", lineHeight: "1.4" },
    profileImg: { width: "32px", height: "32px", borderRadius: "50%", border: "2px solid #93c5fd" },
    logoutBtn: { background: "#ef4444", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
  };

  return (
    <>
      {news && (
        <div style={styles.ticker}>
          <marquee scrollamount="6">
            📢 {t.announcement}: {news} &nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp; 🏛️ GovPortal 2026
          </marquee>
        </div>
      )}

      <nav style={styles.nav}>
        <Link to="/" style={{ color: "white", textDecoration: "none", fontSize: "22px", fontWeight: "bold" }}>GovPortal</Link>

        <div style={styles.links}>
          <NavLink to="/" style={styles.navLink}>{t.home}</NavLink>
          <NavLink to="/about" style={styles.navLink}>{t.about}</NavLink>
          <NavLink to="/contact" style={styles.navLink}>{t.contact}</NavLink>

          {/* RESTORED OFFICER PORTAL & LOGIN/REGISTER FOR GUESTS */}
          {!userEmail && (
            <>
              <NavLink to="/login" style={styles.navLink}>{t.login}</NavLink>
              <NavLink to="/register" style={styles.navLink}>{t.register}</NavLink>
              <NavLink to="/admin-login" style={({isActive}) => ({
                ...styles.navLink({isActive}), color: "#93c5fd", fontWeight: "bold"
              })}>{t.officer}</NavLink>
            </>
          )}

          {userEmail && userRole === "citizen" && (
            <>
              <NavLink to="/schemes" style={styles.navLink}>{t.schemes}</NavLink>
              <NavLink to="/apply" style={styles.navLink}>{t.apply}</NavLink>
              <NavLink to="/eligibility" style={styles.navLink}>
    🔍 Check Eligibility
  </NavLink>
              <NavLink to="/dashboard" style={styles.navLink}>{t.dashboard}</NavLink>
              
              <div style={styles.notifWrapper} onClick={toggleNotifications}>
                🔔 {hasUnseen && <div style={styles.redDot}></div>}
              </div>
            </>
          )}

          {userEmail && userRole === "admin" && (
            <NavLink to="/admin/dashboard" style={({isActive}) => ({...styles.navLink({isActive}), color: "#fbbf24", fontWeight: "bold"})}>{t.command}</NavLink>
          )}

          {/* NOTIFICATION DROPDOWN */}
          {showNotif && (
            <div style={styles.dropdown}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", borderBottom: "1px solid #eee", paddingBottom: "8px" }}>
                <h4 style={{ margin: 0, fontSize: "14px", color: "#1e3a8a" }}>{t.updates}</h4>
                {notifications.length > 0 && (
                  <button onClick={clearNotifications} style={{ background: "none", border: "none", color: "#ef4444", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>Clear All</button>
                )}
              </div>
              <div style={{ maxHeight: "250px", overflowY: "auto" }}>
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <div key={n.id} style={styles.notifItem}>
                      Your application for <b>{n.scheme}</b> was 
                      <span style={{ color: n.status === "Approved" ? "#10b981" : "#ef4444", fontWeight: "bold" }}> {n.status.toLowerCase()}</span>.
                    </div>
                  ))
                ) : (
                  <p style={{ textAlign: "center", fontSize: "12px", color: "#94a3b8", padding: "10px 0" }}>{t.no_updates}</p>
                )}
              </div>
            </div>
          )}

          {userEmail ? (
            <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
              <NavLink to="/profile" style={{textDecoration: "none"}}>
                <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                  {navImage ? (
                    <img src={navImage} alt="Profile" style={styles.profileImg} />
                  ) : (
                    <div style={{...styles.profileImg, background: "#93c5fd", display: "flex", alignItems: "center", justifyContent: "center", color: "#1e3a8a", fontWeight: "bold"}}>{userName?.charAt(0)}</div>
                  )}
                  <span style={{fontSize: "14px", color: "#93c5fd"}}>{t.welcome}, {userName}</span>
                </div>
              </NavLink>
              <button onClick={handleLogout} style={styles.logoutBtn}>{t.logout}</button>
            </div>
          ) : (
            <select style={{background: "#334155", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", outline: "none", cursor: "pointer", fontWeight: "bold"}} value={lang} onChange={handleLangChange}>
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="gu">ગુજરાતી</option>
            </select>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;