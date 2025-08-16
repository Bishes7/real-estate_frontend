import React, { useState } from "react";
import { Loader } from "../components/ui/Loader";
import FormContainer from "../components/FormContainer";
import { Button, Card, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  useUpdateProfileMutation,
  useUserListingsQuery,
} from "../slices/usersApiSlice";
import { toast } from "react-toastify";
import { setCredentials } from "../slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Profile = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const {
    data: userListings,
    isLoading: loadingListings,
    refetch,
  } = useUserListingsQuery(userInfo.user._id);
  console.log(userListings);

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

  // show listings
  const handleShowListings = async () => {
    if (loadingListings) {
      <Loader />;
    } else if (userListings) {
      console.log(userListings);
    } else {
      console.log("No listings found");
    }
    refetch();
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
              <Button variant="info" className="w-100 my-3 ">
                Create Listing
              </Button>
            </Link>
            {isLoading && <Loader />}
          </Form>
        </Card>
        <div className="d-flex justify-content-around">
          <span className="text-danger fw-bold cursor-pointer ">
            Delete Account
          </span>
          {userListings?.length > 0 && (
            <button
              className="fw-bold text-info  btn btn-sm"
              onClick={handleShowListings}
            >
              Show Listings
            </button>
          )}
        </div>

        {userListings &&
          userListings.length > 0 &&
          userListings.map((listing) => (
            <div className="d-flex flex-column gap-2">
              <div
                key={listing._id}
                className="border rounded p-3 d-flex justify-content-around align-items-center gap-3"
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={`${BASE_URL}${listing.images[0]}`}
                    alt="listingimage"
                    className=" object-contain rounded  "
                    style={{ width: "200px", height: "150px" }}
                  />
                </Link>
                <Link to={`/listing/${listing._id}`} className="fw-bold">
                  {listing.name}
                </Link>
                <div className="d-flex flex-column">
                  <button className="btn btn-sm fw-bold text-danger ">
                    Delete
                  </button>
                  <button className="btn btn-sm fw-bold text-success ">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
      </FormContainer>
    </div>
  );
};

export default Profile;
