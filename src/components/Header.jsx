import React, { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import {
  Form,
  Container,
  InputGroup,
  Nav,
  Navbar,
  Button,
  NavDropdown,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import { useSearchListingsQuery } from "../slices/listingsApiSlice";
import { Message } from "./ui/Message";
import { Loader } from "./ui/Loader";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debounced, setDebounced] = useState("");
  const inputRef = useRef(null);
  const popupRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logOutApi] = useLogoutMutation();
  const { userInfo } = useSelector((state) => state.auth);
  console.log("userInfo:", userInfo);

  // Debounce search term (300ms)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(searchTerm.trim()), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Only query when we want suggestions and at least 2 chars
  const shouldQuery = showSuggestions && debounced.length >= 2;
  const {
    data: searchResults,
    isLoading,
    error,
  } = useSearchListingsQuery({ searchTerm: debounced }, { skip: !shouldQuery });

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (!q) return;
    setShowSuggestions(false);
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", q);
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleLogout = async () => {
    try {
      await logOutApi().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Navbar expand="md" bg="secondary-subtle" className="shadow-lg p-2">
      <Container>
        <Navbar.Brand className="fw-bold ">
          <span className="text-secondary">Real</span>
          <span>Estate</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar" className="justify-content-between">
          <Form
            className="d-flex mx-auto"
            style={{ maxWidth: 500 }}
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <InputGroup style={{ maxWidth: 320 }}>
              <Form.Control
                ref={inputRef}
                type="text"
                name="search"
                autoComplete="off"
                placeholder="Search..."
                className="form-control-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setShowSuggestions(false);
                }}
              />
              <Button type="submit" variant="light">
                <FaSearch />
              </Button>
            </InputGroup>
          </Form>

          {/* Suggestions popup (only when focused + >=2 chars) */}
          {showSuggestions && debounced.length >= 2 && (
            <div
              ref={popupRef}
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

              {Array.isArray(searchResults) &&
                searchResults.map((item) => (
                  <div
                    key={item._id}
                    className="p-2 border-bottom"
                    onClick={() => {
                      setShowSuggestions(false);
                      navigate(`/listing/${item._id}`);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <strong>{item.name}</strong>
                    <div className="small text-muted">{item.address}</div>
                  </div>
                ))}

              {Array.isArray(searchResults) && searchResults.length === 0 && (
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
                {/* ✅ Admin Dropdown Menu */}
                {userInfo &&
                  userInfo.user &&
                  userInfo.user.role === "admin" && (
                    <NavDropdown title="Admin" id="admin-menu">
                      <NavDropdown.Item as={Link} to="/admin/dashboard">
                        Preview
                      </NavDropdown.Item>
                    </NavDropdown>
                  )}

                <Nav.Link as={Link} to="/profile">
                  Profile
                </Nav.Link>
                <Nav.Link as={Link} to="/login" onClick={handleLogout}>
                  Logout
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
                <Nav.Link as={Link} to="/contact-us">
                  Contact Us
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
