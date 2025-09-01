import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const AboutPage = () => {
  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm p-4">
            <Card.Body>
              <h2 className="fw-bold text-center mb-3">About RealEstate</h2>
              <p className="text-muted text-center mb-4">
                Your trusted platform for buying, selling, and renting
                properties.
              </p>

              <p>
                Welcome to <strong>RealEstate</strong> — a platform built to
                connect property buyers, sellers, and renters seamlessly.
                Whether you’re searching for your dream home, listing your
                property for sale, or exploring rental options, we make the
                process simple and reliable.
              </p>

              <h5 className="mt-4 fw-bold">What We Offer</h5>
              <ul>
                <li>Easy property search with powerful filters</li>
                <li>Secure platform for managing your listings</li>
                <li>Verified property details for trust and transparency</li>
                <li>24/7 support to guide you through your journey</li>
              </ul>

              <h5 className="mt-4 fw-bold">Our Mission</h5>
              <p>
                To make real estate transactions more accessible, transparent,
                and convenient for everyone — buyers, sellers, and renters
                alike.
              </p>

              <h5 className="mt-4 fw-bold">Contact Us</h5>
              <p>
                Have questions? Reach out at{" "}
                <a href="mailto:support@realestate.com">
                  support@realestate.com
                </a>{" "}
                or call us at <strong>+61 400 123 456</strong>.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutPage;
