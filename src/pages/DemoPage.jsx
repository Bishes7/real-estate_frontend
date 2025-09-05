import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Placeholder,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const DemoPage = () => {
  const navigate = useNavigate();

  const handleDemoLogin = () => {
    // Optional: replace with your RTK Query login mutation for a guest user
    navigate("/login");
  };

  return (
    <Container className="mt-5">
      {/* Hero */}
      <Row className="text-center mb-4">
        <Col md={{ span: 10, offset: 1 }}>
          <h1 className="fw-bold">Interactive Demo</h1>
          <p className="lead text-muted">
            Explore the core flows of <strong>RealEstate</strong> through live
            templates—no signup needed.
          </p>

          <div className="d-flex gap-2 justify-content-center flex-wrap">
            <Link to="/">
              <Button
                variant="danger"
                size="lg"
                href="/listings"
                className="shadow-sm"
              >
                Explore Listings
              </Button>
            </Link>
            <Button
              variant="outline-danger"
              size="lg"
              onClick={handleDemoLogin}
              className="shadow-sm"
            >
              Login as Demo User
            </Button>
          </div>

          <div className="mt-3">
            <Badge bg="light" text="dark" className="me-2">
              React
            </Badge>
            <Badge bg="light" text="dark" className="me-2">
              React-Bootstrap
            </Badge>
            <Badge bg="light" text="dark" className="me-2">
              Node/Express
            </Badge>
            <Badge bg="light" text="dark" className="me-2">
              MongoDB
            </Badge>
            <Badge bg="light" text="dark">
              JWT/Auth
            </Badge>
          </div>
        </Col>
      </Row>

      <div className="mt-4">
        <Row className="g-3 justify-content-center">
          {/* Demo Credentials */}
          <Col md={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h6 className="fw-bold mb-0">🔑 Demo Credentials</h6>
                  <Badge bg="light" text="dark">
                    No signup
                  </Badge>
                </div>

                <div className="small text-muted mb-2">Demo User</div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <code className="bg-light px-2 py-1 rounded flex-grow-1">
                    demo@realestate.com
                  </code>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() =>
                      navigator.clipboard.writeText("demo@realestate.com")
                    }
                  >
                    Copy
                  </Button>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <code className="bg-light px-2 py-1 rounded flex-grow-1">
                    Demo@12345
                  </code>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => navigator.clipboard.writeText("Demo@123")}
                  >
                    Copy
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Deep Links */}
          <Col md={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <h6 className="fw-bold mb-3"> Jump Right In</h6>
                <div className="d-grid gap-2">
                  <Button
                    as={Link}
                    to="/login"
                    variant="outline-danger"
                    size="sm"
                  >
                    Open Admin Dashboard
                  </Button>
                  <Button
                    as={Link}
                    to="/"
                    variant="outline-secondary"
                    size="sm"
                  >
                    View Listings
                  </Button>
                  <Button
                    as={Link}
                    to="/admin/users"
                    variant="outline-secondary"
                    size="sm"
                  >
                    View Users
                  </Button>
                  <Button
                    as={Link}
                    to="/contact-us"
                    variant="outline-secondary"
                    size="sm"
                  >
                    Send a Test Enquiry
                  </Button>
                </div>
                <div className="mt-3 small text-muted">
                  Tip: Admin shows charts (listings/month, users/week) + CRUD.
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Reviewer Checklist */}
          <Col md={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <h6 className="fw-bold mb-3">Reviewer Checklist (1–2 min)</h6>
                <ul className="mb-3 small">
                  <li>
                    Login as <strong>Demo</strong> → view charts/listings/users
                  </li>
                  <li>
                    Use filters on <strong>Listings</strong> → open a details
                    page
                  </li>
                  <li>
                    <strong>Create</strong> a listing → check validation &
                    toasts (only loogedin user have permission)
                  </li>
                  <li>
                    Send a <strong>Contact</strong> enquiry → confirm success
                    state
                  </li>
                  <li>
                    Edit <strong>Profile</strong> → verify protected routes &
                    JWT
                  </li>
                </ul>
                <div className="d-flex flex-wrap gap-2">
                  <Badge bg="light" text="dark">
                    Role-based auth
                  </Badge>
                  <Badge bg="light" text="dark">
                    RTK Query
                  </Badge>
                  <Badge bg="light" text="dark">
                    Mongo/Mongoose
                  </Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default DemoPage;
