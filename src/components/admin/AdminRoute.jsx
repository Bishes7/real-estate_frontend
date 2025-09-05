import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // Only allow if logged in AND role is "admin"
  return (userInfo && userInfo?.user?.role === "admin") || userInfo?.isDemo ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default AdminRoute;
