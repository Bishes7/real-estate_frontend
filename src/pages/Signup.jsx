import React from "react";
import Form from "react-bootstrap/Form";
import FormContainer from "../components/FormContainer";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <FormContainer>
      <h1 className="text-center fw-bold my-3">Sign Up</h1>
      <Form className="p-3">
        <Form.Group controlId="username" className="my-3">
          <Form.Label>User Name</Form.Label>
          <Form.Control type="text" placeholder="Enter a username" />
        </Form.Group>

        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="abc@email.com" />
        </Form.Group>

        <Form.Group controlId="password" className="my-4">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="******" />
        </Form.Group>

        <Button type="submit" className="w-100" variant="primary">
          Sign up
        </Button>
      </Form>
      <div className="d-flex gap-1">
        <p>Have an account?</p>
        <Link to="/login">
          <span>Login</span>
        </Link>
      </div>
    </FormContainer>
  );
};

export default Signup;
