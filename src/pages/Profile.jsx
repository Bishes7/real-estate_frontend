import React, { useState } from "react";
import { Loader } from "../components/ui/Loader";
import FormContainer from "../components/FormContainer";
import { Button, Card, Form } from "react-bootstrap";
import { useSelector } from "react-redux";

const Profile = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  console.log(userInfo);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <h4 className="fw-bold my-3 text-center">
        Welcome back {userInfo.user.userName} !{" "}
      </h4>
      <FormContainer>
        <Card className="my-4">
          <Form className="p-3" onSubmit={handleSubmit}>
            <Form.Group controlId="userName" className="my-3">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                name="userName"
                type="text"
                autoComplete="off"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </Form.Group>
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
              variant="secondary"
              type="submit"
              className="w-100"
              // disabled={isLoading}
            >
              Update Details
            </Button>
            {/* {isLoading && <Loader />} */}
          </Form>
        </Card>
        <div>
          <span className="text-danger fw-bold cursor-pointer">
            Delete Account
          </span>
        </div>
      </FormContainer>
    </div>
  );
};

export default Profile;
