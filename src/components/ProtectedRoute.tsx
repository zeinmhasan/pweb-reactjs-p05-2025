import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");

  if (!token) {
    // kalau belum login, arahkan ke halaman login
    return <Navigate to="/login" replace />;
  }

  // kalau sudah login, tampilkan konten yang diminta
  return <>{children}</>;
}

export default ProtectedRoute;
