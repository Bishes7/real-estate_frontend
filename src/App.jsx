import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import About from "./pages/About";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./components/PrivateRoute";
import ListingPage from "./pages/ListingPage";
import PropertyLandingPage from "./pages/PropertyLandingPage";
import Chatbot from "./components/ui/ChatBot";
import SearchPage from "./pages/SearchPage";

import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./pages/admin/AdminLayoutPage";
import AdminDashBoard from "./pages/admin/AdminDashBoard";
import AdminListings from "./pages/admin/AdminListings";
import EditUsers from "./pages/admin/EditUsers";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Chatbot />
        <Header />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/listing/:listingId" element={<PropertyLandingPage />} />
          <Route path="/search" element={<SearchPage />} />

          {/* Private (logged-in) routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-listing" element={<ListingPage />} />
          </Route>

          {/* Admin-only routes */}
          <Route element={<AdminRoute />}>
            <Route
              path="/admin/dashboard"
              element={
                <AdminLayout>
                  <AdminDashBoard />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/listings"
              element={
                <AdminLayout>
                  <AdminListings />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminLayout>
                  <EditUsers />
                </AdminLayout>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
};

export default App;
