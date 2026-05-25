import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if the user's email exists in storage (the sign they are logged in)
  const userEmail = localStorage.getItem("userEmail");

  if (!userEmail) {
    // If not logged in, send them to login
    alert("Please login to access this section!");
    return <Navigate to="/login" replace />;
  }

  // If logged in, show the page they asked for
  return children;
};

export default ProtectedRoute;