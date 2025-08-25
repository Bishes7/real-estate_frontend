import React, { useState, useEffect } from "react";
import { Form, Button, Card, Image, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Loader } from "../../components/ui/Loader";
import { Message } from "../../components/ui/Message";
import {
  useGetListingQuery,
  useUpdateListingMutation,
} from "../../slices/listingsApiSlice";

const EditListingScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: listing, isLoading, error, refetch } = useGetListingQuery(id);
  const [updateListing, { isLoading: updating }] = useUpdateListingMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    beds: "",
    baths: "",
    regularPrice: "",
    discountedPrice: "",
    furnished: false,
    parking: false,
    offer: false,
    type: "rent",
    images: null,
  });

  // Prefill form with existing listing data
  useEffect(() => {
    if (listing) {
      setFormData({
        name: listing.name,
        description: listing.description,
        address: listing.address,
        beds: listing.beds,
        baths: listing.baths,
        regularPrice: listing.regularPrice,
        discountedPrice: listing.discountedPrice,
        furnished: listing.furnished,
        parking: listing.parking,
        offer: listing.offer,
        type: listing.type,
        images: null, // reset images for new upload
      });
    }
  }, [listing]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle file input
  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      images: e.target.files,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // Append text fields
    for (let key in formData) {
      if (key !== "images") {
        data.append(key, formData[key]);
      }
    }

    // Append images if selected
    if (formData.images) {
      for (let file of formData.images) {
        data.append("images", file);
      }
    }

    try {
      await updateListing({ id, data }).unwrap();
      toast.success("Listing updated successfully");
      refetch();
      navigate("/admin/listings");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update listing");
    }
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || "Failed to load listing"}
      </Message>
    );

  return (
    <Card className="p-4 shadow-lg">
      <h3 className="mb-4">Edit Listing</h3>

      <Form onSubmit={handleSubmit}>
        {/* Name */}
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Description */}
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Address */}
        <Form.Group className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Beds</Form.Label>
              <Form.Control
                type="number"
                name="beds"
                value={formData.beds}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Baths</Form.Label>
              <Form.Control
                type="number"
                name="baths"
                value={formData.baths}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Regular Price</Form.Label>
              <Form.Control
                type="number"
                name="regularPrice"
                value={formData.regularPrice}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Discounted Price</Form.Label>
              <Form.Control
                type="number"
                name="discountedPrice"
                value={formData.discountedPrice}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Checkboxes */}
        <Row className="mb-3">
          <Col>
            <Form.Check
              type="checkbox"
              label="Furnished"
              name="furnished"
              checked={formData.furnished}
              onChange={handleChange}
            />
          </Col>
          <Col>
            <Form.Check
              type="checkbox"
              label="Parking"
              name="parking"
              checked={formData.parking}
              onChange={handleChange}
            />
          </Col>
          <Col>
            <Form.Check
              type="checkbox"
              label="Offer"
              name="offer"
              checked={formData.offer}
              onChange={handleChange}
            />
          </Col>
        </Row>

        {/* Type */}
        <Form.Group className="mb-3">
          <Form.Label>Type</Form.Label>
          <Form.Select
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="rent">Rent</option>
            <option value="sell">Sell</option>
          </Form.Select>
        </Form.Group>

        {/* Current Images */}
        <Form.Group className="mb-3">
          <Form.Label>Current Images</Form.Label>
          <Row>
            {listing.images?.map((img, index) => (
              <Col key={index} md={3} className="mb-2">
                <Image
                  src={img}
                  alt="Listing"
                  thumbnail
                  style={{ height: "100px", objectFit: "cover" }}
                />
              </Col>
            ))}
          </Row>
        </Form.Group>

        {/* Upload New Images */}
        <Form.Group className="mb-3">
          <Form.Label>Upload New Images</Form.Label>
          <Form.Control type="file" multiple onChange={handleFileChange} />
        </Form.Group>

        <Button
          type="submit"
          variant="primary"
          disabled={updating}
          className="mt-3"
        >
          {updating ? "Updating..." : "Update Listing"}
        </Button>
      </Form>
    </Card>
  );
};

export default EditListingScreen;
