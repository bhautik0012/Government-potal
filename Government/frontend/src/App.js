import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Shared Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Chatbox from "./components/Chatbox";

// Admin Imports
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";

// Citizen Pages
import Home from "./pages/Home";
import Schemes from "./pages/Schemes";
import SchemeDetails from "./pages/SchemeDetails";
import ApplyScheme from "./pages/ApplyScheme";
import Eligibility from "./pages/Eligibility";
import Dashboard from "./pages/Dashboard";
import Status from "./pages/Status";
import Documents from "./pages/Documents";
import News from "./pages/News";
import Help from "./pages/Help";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

// --- SMART FACILITY: SCROLL TO TOP ---
// This ensures that when you click "View Details", the new page starts at the top
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const userEmail = localStorage.getItem("userEmail");

  return (
    <Router>
      <ScrollToTop />
      <Navbar />

      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />
        <Route path="/news" element={<News />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        
        {/* --- PROTECTED ROUTES --- */}
        <Route path="/schemes" element={
          <ProtectedRoute><Schemes /></ProtectedRoute>
        } />

        {/* --- DYNAMIC SCHEME DETAILS --- */}
        <Route path="/schemes/:id" element={
          <ProtectedRoute><SchemeDetails /></ProtectedRoute>
        } />

        <Route path="/apply" element={
          <ProtectedRoute><ApplyScheme /></ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        
        <Route path="/status" element={
          <ProtectedRoute><Status /></ProtectedRoute>
        } />

        <Route path="/eligibility" element={
          <ProtectedRoute><Eligibility /></ProtectedRoute>
        } />

        <Route path="/documents" element={
          <ProtectedRoute><Documents /></ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        
        {/* --- ADMIN ROUTES --- */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* --- SMART FACILITY: 404 CATCH-ALL --- */}
        {/* This prevents the "Blank Page" by showing a friendly error if the URL is wrong */}
        <Route path="*" element={
          <div style={{ textAlign: 'center', padding: '100px', fontFamily: 'Poppins' }}>
            <h1 style={{ fontSize: '100px', margin: 0, color: '#e2e8f0' }}>404</h1>
            <h2>Page Not Found</h2>
            <p>The link you followed might be broken or the page has been moved.</p>
            <a href="/" style={{ color: '#1e3a8a', fontWeight: 'bold' }}>Return Home</a>
          </div>
        } />
      </Routes>

      {/* Show Chatbox only when logged in */}
      {userEmail && <Chatbox />}
    </Router>
  );
}

export default App;