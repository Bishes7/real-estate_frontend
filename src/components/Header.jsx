import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import Nav from "react-bootstrap/Nav";

import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import { useSearchListingsQuery } from "../slices/listingsApiSlice";
import { Message } from "./ui/Message";
import { Loader } from "./ui/Loader";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logOutApi] = useLogoutMutation();
  const handleLogOut = async () => {
    try {
      await logOutApi().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: searchResults,
    isLoading,
    error,
  } = useSearchListingsQuery({ searchTerm }, { skip: !searchTerm });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  return (
    <Navbar expand="md" bg="secondary-subtle" className="shadow-lg  p-2">
      <Container>
        <Navbar.Brand className="fw-bold ">
          <span className="text-secondary">Real</span>
          <span>Estate</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar" className="justify-content-between">
          <Form
            className="d-flex mx-auto  "
            style={{ maxWidth: "500px" }}
            onSubmit={handleSubmit}
          >
            <InputGroup style={{ maxWidth: "200px" }}>
              <Form.Control
                type="text"
                placeholder="Search..."
                className="form-control-sm "
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <InputGroup.Text>
                <button>
                  <FaSearch />
                </button>
              </InputGroup.Text>
            </InputGroup>
          </Form>

          {searchTerm && (
            <div
              className="position-absolute bg-white shadow p-2 mt-5 rounded"
              style={{
                top: "50px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "300px",
                zIndex: 1000,
              }}
            >
              {isLoading && <Loader />}
              {error && (
                <Message variant="danger">{error?.data?.message}</Message>
              )}
              {searchResults &&
                searchResults.map((item) => (
                  <div
                    key={item._id}
                    className="p-2 border-bottom"
                    onClick={() => navigate(`/listing/${item._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <strong>{item.name}</strong>
                    <div className="small text-muted">{item.address}</div>
                  </div>
                ))}
              {searchResults?.length === 0 && (
                <div className="p-2">No results found</div>
              )}
            </div>
          )}
          <Nav className="fw-bold gap-2 ms-auto ">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>

            {userInfo ? (
              <>
                <Nav.Link as={Link} to="/login" onClick={handleLogOut}>
                  Logout
                </Nav.Link>

                <Nav.Link as={Link} to="/profile">
                  Profile
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/about">
                  About
                </Nav.Link>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
