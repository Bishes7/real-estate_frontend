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

      {/* Templates / Guided tour (no video) */}
      <Row className="g-4">
        {/* Template 1: Search & Filters */}
        <Col md={6} lg={4}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="fw-bold mb-0">🏠 Browse & Filter</h5>
            </Card.Header>
            <Card.Body>
              {/* Fake search bar + chips as template */}
              <div className="p-3 border rounded mb-3 bg-light">
                <div className="d-flex gap-2 mb-2">
                  <Placeholder as="div" animation="wave" className="w-100">
                    <Placeholder xs={12} style={{ height: 36 }} />
                  </Placeholder>
                  <Button size="sm" variant="outline-secondary">
                    Search
                  </Button>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  <Badge bg="secondary">Price: $300k–$600k</Badge>
                  <Badge bg="secondary">Beds: 3+</Badge>
                  <Badge bg="secondary">Type: House</Badge>
                  <Badge bg="secondary">Location: Sydney</Badge>
                </div>
              </div>

              {/* Skeleton listing grid */}
              <Row className="g-2">
                {[1, 2, 3].map((i) => (
                  <Col xs={12} key={i}>
                    <Card className="border-0">
                      <div className="ratio ratio-16x9 bg-light rounded"></div>
                      <Card.Body className="px-0">
                        <Placeholder as={Card.Title} animation="wave">
                          <Placeholder xs={6} />
                        </Placeholder>
                        <Placeholder as={Card.Text} animation="wave">
                          <Placeholder xs={8} /> <Placeholder xs={4} />
                        </Placeholder>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              <Button
                variant="outline-danger"
                href="/listings"
                size="sm"
                className="mt-3"
              >
                Try Real Filters
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Template 2: Listing detail */}
        <Col md={6} lg={4}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="fw-bold mb-0">📄 Listing Details</h5>
            </Card.Header>
            <Card.Body>
              {/* Gallery placeholder */}
              <div className="ratio ratio-16x9 bg-light rounded mb-3"></div>
              <Placeholder as="h6" animation="wave">
                <Placeholder xs={7} />
              </Placeholder>
              <div className="d-flex gap-2 mb-3">
                <Badge bg="secondary">3 Bed</Badge>
                <Badge bg="secondary">2 Bath</Badge>
                <Badge bg="secondary">1 Garage</Badge>
              </div>
              <Placeholder as="p" animation="wave">
                <Placeholder xs={10} /> <Placeholder xs={9} />{" "}
                <Placeholder xs={6} />
              </Placeholder>

              <div className="d-flex gap-2">
                <Button variant="outline-danger" href="/listings/123" size="sm">
                  Open Sample
                </Button>
                <Button variant="outline-secondary" href="/listings" size="sm">
                  More Listings
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Template 3: Contact / Lead */}
        <Col md={6} lg={4}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="fw-bold mb-0">✉️ Contact & Lead Flow</h5>
            </Card.Header>
            <Card.Body>
              {/* Form mock */}
              <div className="p-3 border rounded bg-light">
                <Placeholder as="div" animation="wave" className="mb-2">
                  <Placeholder xs={12} style={{ height: 36 }} />
                </Placeholder>
                <Placeholder as="div" animation="wave" className="mb-2">
                  <Placeholder xs={12} style={{ height: 36 }} />
                </Placeholder>
                <Placeholder as="div" animation="wave" className="mb-3">
                  <Placeholder xs={12} style={{ height: 80 }} />
                </Placeholder>
                <Button variant="secondary" size="sm" disabled>
                  Send
                </Button>
              </div>

              <p className="text-muted mt-3 mb-2">
                Validated inquiries are securely stored and sent to
                owners/agents.
              </p>
              <Button variant="outline-danger" href="/contact" size="sm">
                Send a Test Enquiry
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Admin */}
        <Col md={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="fw-bold mb-0">🛠 Admin Dashboard</h5>
            </Card.Header>
            <Card.Body>
              {/* Admin cards skeleton */}
              <Row className="g-3">
                {[1, 2, 3, 4].map((i) => (
                  <Col xs={6} key={i}>
                    <Card className="border-0">
                      <div className="ratio ratio-4x3 bg-light rounded"></div>
                      <Card.Body className="px-0">
                        <Placeholder as={Card.Title} animation="wave">
                          <Placeholder xs={6} />
                        </Placeholder>
                        <Placeholder as={Card.Text} animation="wave">
                          <Placeholder xs={8} />
                        </Placeholder>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              <div className="d-flex gap-2 mt-3">
                <Button variant="outline-danger" href="/admin" size="sm">
                  Open Admin
                </Button>
                <Button variant="outline-secondary" href="/login" size="sm">
                  Admin Login
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Auth */}
        <Col md={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="fw-bold mb-0">🔐 Authentication</h5>
            </Card.Header>
            <Card.Body>
              <ul className="text-muted mb-3">
                <li>JWT auth with HttpOnly cookies</li>
                <li>Protected routes and roles (admin/user)</li>
                <li>Form validation and error handling</li>
              </ul>
              <div className="d-flex gap-2">
                <Button variant="outline-danger" href="/signup" size="sm">
                  Create Account
                </Button>
                <Button variant="outline-secondary" href="/login" size="sm">
                  Login
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DemoPage;
