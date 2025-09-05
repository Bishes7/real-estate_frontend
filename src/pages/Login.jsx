import React, { useEffect, useState } from "react";
import { useLoginMutation } from "../slices/usersApiSlice";
import FormContainer from "../components/FormContainer";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Loader } from "../components/ui/Loader";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setCredentials } from "../slices/authSlice";
import { useDispatch } from "react-redux";
import DemoLoginButton from "../components/DemoLoginButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading }] = useLoginMutation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      toast.success("Login Successfully");
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer>
      <Card className="my-4">
        <h2 className="text-center fw-bold my-2">Login</h2>
        <Form className="p-3" onSubmit={handleSubmit}>
          <Form.Group controlId="email" className="my-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
              type="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="password" className="my-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              type="password"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 my-3"
            disabled={isLoading}
          >
            Login
          </Button>
          <DemoLoginButton />
          {isLoading && <Loader />}
        </Form>
        <Row className="py-3">
          <Col className="mx-1">
            New Customer ? <Link to={"/signup"}>Sign Up</Link>
          </Col>
        </Row>
      </Card>
    </FormContainer>
  );
};

export default Login;
