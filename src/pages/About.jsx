import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import {
  HouseFill,
  PeopleFill,
  ShieldLockFill,
  TelephoneFill,
} from "react-bootstrap-icons";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <Container className="mt-5">
      {/* Hero Section */}
      <Row className="justify-content-center text-center mb-5">
        <Col md={10}>
          <h1 className="fw-bold display-5">
            About <span className="text-danger">RealEstate</span>
          </h1>
          <p className="lead text-muted">
            A modern platform that connects buyers, sellers, and renters — built
            with
            <strong> React, Node.js, and MongoDB</strong> to ensure speed,
            security, and scalability.
          </p>
          <Link to="/demo">
            <Button variant="danger" size="lg" className="mt-3 shadow-sm">
              View Demo
            </Button>
          </Link>
        </Col>
      </Row>

      {/* What We Offer Section */}
      <Row className="g-4">
        <Col md={3} sm={6}>
          <Card className="h-100 text-center p-3 border-0 shadow-sm">
            <HouseFill size={40} className="text-danger mb-3" />
            <h5 className="fw-bold">Property Search</h5>
            <p className="text-muted">
              Smart filters to find your dream home with ease.
            </p>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="h-100 text-center p-3 border-0 shadow-sm">
            <PeopleFill size={40} className="text-danger mb-3" />
            <h5 className="fw-bold">Seamless Connections</h5>
            <p className="text-muted">
              Directly connect with buyers, sellers, and renters.
            </p>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="h-100 text-center p-3 border-0 shadow-sm">
            <ShieldLockFill size={40} className="text-danger mb-3" />
            <h5 className="fw-bold">Trusted Platform</h5>
            <p className="text-muted">
              Verified listings ensure transparency and trust.
            </p>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="h-100 text-center p-3 border-0 shadow-sm">
            <TelephoneFill size={40} className="text-danger mb-3" />
            <h5 className="fw-bold">24/7 Support</h5>
            <p className="text-muted">
              Always available to help and guide you.
            </p>
          </Card>
        </Col>
      </Row>

      {/* Mission Section */}
      <Row className="mt-5">
        <Col md={8} className="mx-auto text-center">
          <h3 className="fw-bold">Our Mission</h3>
          <p className="text-muted">
            To make real estate transactions more accessible, transparent, and
            convenient for everyone — buyers, sellers, and renters alike.
          </p>
        </Col>
      </Row>

      {/* Contact Section */}
      <Row className="mt-5">
        <Col md={6} className="mx-auto text-center">
          <Card className="p-4 border-0 shadow-sm">
            <h4 className="fw-bold mb-3">Get in Touch</h4>
            <p>
              Email us at{" "}
              <a
                href="mailto:support@realestate.com"
                className="fw-bold text-danger"
              >
                support@realestate.com
              </a>{" "}
              or call <strong>+61 400 123 456</strong>.
            </p>
            <Link to="/contact-us">
              <Button variant="outline-danger">Contact Us</Button>
            </Link>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutPage;
