import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { api } from "../config/api";

const translations = {
  en: {
    home: "Home", about: "About", contact: "Contact Us", help: "Help",
    login: "Login", register: "Register", officer: "Officer Portal",
    schemes: "Schemes", apply: "Apply", dashboard: "My Dashboard",
    command: "Command Center", logout: "Logout", welcome: "Hi",
    announcement: "IMPORTANT ANNOUNCEMENT", updates: "Updates", no_updates: "No new updates",
    menu: "Menu", close: "Close"
  },
  hi: {
    home: "होम", about: "हमारे बारे में", contact: "संपर्क करें", help: "सहायता",
    login: "लॉगिन", register: "पंजीकरण", officer: "अधिकारी पोर्टल",
    schemes: "योजनाएं", apply: "आवेदन करें", dashboard: "मेरा डैशबोर्ड",
    command: "कमांड सेंटर", logout: "लॉगआउट", welcome: "नमस्ते",
    announcement: "महत्वपूर्ण सूचना", updates: "अपडेट", no_updates: "कोई नया अपडेट नहीं",
    menu: "मेनू", close: "बंद"
  },
  gu: {
    home: "હોમ", about: "અમારા વિશે", contact: "સંપર્ક કરો", help: "મદદ",
    login: "લોગિન", register: "રજીસ્ટર", officer: "અધિકારી પોર્ટલ",
    schemes: "યોજનાઓ", apply: "અરજી કરો", dashboard: "મારું ડેશબોર્ડ",
    command: "કમાન્ડ સેન્ટર", logout: "લોગ આઉટ", welcome: "નમસ્તે",
    announcement: "મહત્વપૂર્ણ જાહેરાત", updates: "અપડેટ્સ", no_updates: "કોઈ નવા અપડેટ નથી",
    menu: "મેનુ", close: "બંધ"
  }
};

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
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
    setMenuOpen(false);
  }, [location.pathname]);

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
          const lastSeenCount = parseInt(localStorage.getItem("notifCount") || "0", 10);
          if (processed.length > lastSeenCount) setHasUnseen(true);
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
    setMenuOpen(false);
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

  const linkClass = ({ isActive }) => `nav-link${isActive ? " active" : ""}`;

  return (
    <>
      {news && (
        <div className="nav-ticker">
          <span className="nav-ticker-inner">
            📢 {t.announcement}: {news} &nbsp;|&nbsp; 🏛️ GovPortal 2026
          </span>
        </div>
      )}

      <nav className="navbar">
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          GovPortal
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-label={menuOpen ? t.close : t.menu}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <div className={`nav-links${menuOpen ? " open" : ""}`}>
          <NavLink to="/" className={linkClass} onClick={() => setMenuOpen(false)}>{t.home}</NavLink>
          <NavLink to="/about" className={linkClass} onClick={() => setMenuOpen(false)}>{t.about}</NavLink>
          <NavLink to="/contact" className={linkClass} onClick={() => setMenuOpen(false)}>{t.contact}</NavLink>
          <NavLink to="/help" className={linkClass} onClick={() => setMenuOpen(false)}>{t.help}</NavLink>

          {!userEmail && (
            <>
              <NavLink to="/login" className={linkClass} onClick={() => setMenuOpen(false)}>{t.login}</NavLink>
              <NavLink to="/register" className={linkClass} onClick={() => setMenuOpen(false)}>{t.register}</NavLink>
              <NavLink to="/admin-login" className={linkClass} onClick={() => setMenuOpen(false)} style={{ color: "#93c5fd" }}>{t.officer}</NavLink>
            </>
          )}

          {userEmail && userRole === "citizen" && (
            <>
              <NavLink to="/schemes" className={linkClass} onClick={() => setMenuOpen(false)}>{t.schemes}</NavLink>
              <NavLink to="/apply" className={linkClass} onClick={() => setMenuOpen(false)}>{t.apply}</NavLink>
              <NavLink to="/eligibility" className={linkClass} onClick={() => setMenuOpen(false)}>🔍 Eligibility</NavLink>
              <NavLink to="/dashboard" className={linkClass} onClick={() => setMenuOpen(false)}>{t.dashboard}</NavLink>
              <button
                type="button"
                className="nav-link"
                style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                onClick={toggleNotifications}
              >
                🔔 Notifications {hasUnseen && <span style={{ color: "#ef4444" }}>●</span>}
              </button>
            </>
          )}

          {userEmail && userRole === "admin" && (
            <NavLink to="/admin/dashboard" className={linkClass} onClick={() => setMenuOpen(false)} style={{ color: "#fbbf24" }}>{t.command}</NavLink>
          )}

          <div className="nav-actions">
            {userEmail ? (
              <>
                <NavLink to="/profile" className="nav-profile" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none" }}>
                  {navImage ? (
                    <img src={navImage} alt="Profile" className="nav-profile-img" />
                  ) : (
                    <div className="nav-profile-img" style={{ background: "#93c5fd", display: "flex", alignItems: "center", justifyContent: "center", color: "#1e3a8a", fontWeight: "bold" }}>
                      {userName?.charAt(0)}
                    </div>
                  )}
                  <span style={{ color: "#93c5fd", fontSize: "0.9rem" }}>{t.welcome}, {userName}</span>
                </NavLink>
                <button type="button" className="btn-logout" onClick={handleLogout}>{t.logout}</button>
              </>
            ) : (
              <select className="lang-select" value={lang} onChange={handleLangChange} aria-label="Language">
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="gu">ગુજરાતી</option>
              </select>
            )}
          </div>
        </div>

        {showNotif && userEmail && userRole === "citizen" && (
          <div className="notif-dropdown" style={{ position: "fixed", top: "auto", bottom: "80px", right: "1rem" }}>
            <div className="flex-between" style={{ marginBottom: "0.75rem", borderBottom: "1px solid #eee", paddingBottom: "0.5rem" }}>
              <h4 style={{ margin: 0, fontSize: "14px", color: "#1e3a8a" }}>{t.updates}</h4>
              {notifications.length > 0 && (
                <button type="button" onClick={clearNotifications} style={{ background: "none", border: "none", color: "#ef4444", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>Clear All</button>
              )}
            </div>
            <div style={{ maxHeight: "250px", overflowY: "auto" }}>
              {notifications.length > 0 ? (
                notifications.map(n => (
                  <div key={n.id} style={{ padding: "10px", borderBottom: "1px solid #f1f5f9", fontSize: "12px" }}>
                    Application for <b>{n.scheme}</b> was{" "}
                    <span style={{ color: n.status === "Approved" ? "#10b981" : "#ef4444", fontWeight: "bold" }}>{n.status.toLowerCase()}</span>.
                  </div>
                ))
              ) : (
                <p style={{ textAlign: "center", fontSize: "12px", color: "#94a3b8" }}>{t.no_updates}</p>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
