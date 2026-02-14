// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("UserToken"); // get token from localStorage

  // If no token, send user back to login
  if (!token) {
    return <Navigate to="/User/UserLogin" replace />;
  }

  // If token exists, show the page
  return children;
}
