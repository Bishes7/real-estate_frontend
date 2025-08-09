import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import FormContainer from "../components/FormContainer";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSignUpMutation } from "../slices/usersApiSlice";
import { toast } from "react-toastify";

const Signup = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [signin, { isLoading }] = useSignUpMutation();

  // functon to submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        toast.error("Password dont match");
      }
      await signin({ userName, email, password }).unwrap();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer>
      <Card className="mt-4 p-3 rounded ">
        <h1 className="text-center fw-bold my-2">Sign Up</h1>
        <Form className="p-3" onSubmit={handleSubmit}>
          <Form.Group controlId="username" className="my-3">
            <Form.Label>User Name</Form.Label>
            <Form.Control
              name="username"
              type="text"
              placeholder="Enter a username"
              autoComplete="new-password"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="email" className="my-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="abc@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="password" className="my-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="confirmPassword" className="my-4">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="******"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          <Button
            type="submit"
            className="w-100"
            variant="primary"
            disabled={isLoading}
          >
            Sign up
          </Button>
        </Form>
        <div className="d-flex gap-1">
          <p>Have an account?</p>
          <Link to="/login">
            <span>Login</span>
          </Link>
        </div>
      </Card>
    </FormContainer>
  );
};

export default Signup;
