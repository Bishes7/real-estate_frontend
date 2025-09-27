import React from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import ManageBookings from "./ManageBookings";

const AdminLayout = ({ children }) => {
  return (
    <div className="d-flex">
      {/* Sidebar on the left */}
      <AdminSidebar />
      {/* Main content on the right */}
      <div className="flex-grow-1 p-3">{children}</div>
    </div>
  );
};

export default AdminLayout;
