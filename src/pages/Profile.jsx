import React, { useRef, useState } from "react";
import { Loader } from "../components/ui/Loader";
import FormContainer from "../components/FormContainer";
import { Button, Card, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateProfileMutation } from "../slices/usersApiSlice";
import { toast } from "react-toastify";
import { setCredentials } from "../slices/authSlice";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Password dont match");
    } else {
      try {
        const res = await updateProfile({
          userName,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials(res));
        toast.success("Profile Updated successfully");
        navigate("/");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div>
      <h4 className="fw-bold my-3 text-center">
        Welcome back {userInfo?.user?.userName} !{" "}
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

            <Form.Group controlId="confirmPassword" className="my-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                name="confirmPassword"
                type="password"
                autoComplete="off"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            <Button
              variant="secondary"
              type="submit"
              className="w-100"
              disabled={isLoading}
            >
              Update Details
            </Button>

            <Link to="/create-listing">
              <Button variant="success" className="w-100 my-3 ">
                Create Listing
              </Button>
            </Link>
            {isLoading && <Loader />}
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
