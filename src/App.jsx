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

import ManageUsers from "./pages/admin/ManageUsers";
import ManageListings from "./pages/admin/ManageListings";

import ContactPage from "./pages/ContactPage";
import EditListtingPage from "./pages/admin/EditListtingPage";
import CheckQueryPage from "./pages/admin/CheckQueryPage";
import DemoPage from "./pages/DemoPage";
import { DemoBanner } from "./components/DemoBanner";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Chatbot />
        <DemoBanner />
        <Header />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/listing/:listingId" element={<PropertyLandingPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/contact-us" element={<ContactPage />} />
          <Route path="/demo" element={<DemoPage />} />

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
                  <ManageListings />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminLayout>
                  <ManageUsers />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/listings/:id/edit"
              element={<EditListtingPage />}
            />
          </Route>
          <Route path="/admin/check-query" element={<CheckQueryPage />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
};

export default App;
