// src/components/AdminSidebar.js
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div
      className="bg-dark text-white p-3 vh-100 fw-bold"
      style={{ width: "220px" }}
    >
      <h5 className="mb-4 fw-bold">Admin Panel</h5>
      <hr />
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
        <Nav.Link as={Link} to="/admin/bookings" className="text-white">
          Manage Bookings
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/analytics" className="text-white">
          Analytics
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/check-query" className="text-white">
          Check Query
        </Nav.Link>
        
        <hr className="my-3" />
        <h6 className="text-light mb-2">Advanced Features</h6>
        
        <Nav.Link as={Link} to="/recommendations" className="text-white">
          Smart Recommendations
        </Nav.Link>
        <Nav.Link as={Link} to="/valuation" className="text-white">
          Property Valuation
        </Nav.Link>
        <Nav.Link as={Link} to="/market-trends" className="text-white">
          Market Trends
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default AdminSidebar;
