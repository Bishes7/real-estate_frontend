import React from "react";
import { FaSearch } from "react-icons/fa";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import Nav from "react-bootstrap/Nav";

import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <Navbar expand="md" bg="secondary-subtle" className="shadow-md  p-2">
      <Container>
        <Navbar.Brand className="fw-bold ">
          <span className="text-secondary">Real</span>
          <span>Estate</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar" className="justify-content-between">
          <Form className="d-flex mx-auto  " style={{ maxWidth: "500px" }}>
            <InputGroup style={{ maxWidth: "200px" }}>
              <Form.Control
                type="text"
                placeholder="Search..."
                className="form-control-sm "
              />
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
            </InputGroup>
          </Form>
          <Nav className="fw-bold gap-2 ">
            <Nav.Link as={Link} to="/home">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about">
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
