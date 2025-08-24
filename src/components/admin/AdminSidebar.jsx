// src/components/AdminSidebar.js
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="bg-dark text-white p-3 vh-100" style={{ width: "220px" }}>
      <h5 className="mb-4">Admin Panel</h5>
      <Nav className="flex-column">
        <Nav.Link as={Link} to="/admin/dashboard" className="text-white">
          Dashboard
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/listings" className="text-white">
          Manage Listings
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/users" className="text-white">
          Manage Users
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/check-query" className="text-white">
          Check Query
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default AdminSidebar;
