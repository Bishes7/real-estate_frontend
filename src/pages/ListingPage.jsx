import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { toast } from "react-toastify";
import { useUploadImageMutation } from "../slices/usersApiSlice";
import { useSelector } from "react-redux";

const ListingPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    sell: false,
    rent: false,
    parking: false,
    furnished: false,
    offer: false,
    beds: 1,
    baths: 1,
    regularPrice: 0,
    discountedPrice: 0,
    images: [],
  });

  const [upload, { isLoading }] = useUploadImageMutation();

  const { userInfo } = useSelector((state) => state.auth);

  // one function for all inputs
  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  // handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  // delete an image
  const handleDeleteImage = (index) => {
    setFormData((prev) => {
      const updated = [...prev.images];
      updated.splice(index, 1);
      return { ...prev, images: updated };
    });
  };

  // submit all data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();

    // append non-image fields
    Object.keys(formData).forEach((key) => {
      if (key !== "images") submitData.append(key, formData[key]);
    });

    // append images
    formData.images.forEach((img) => {
      submitData.append("images", img.file);
    });

    try {
      const { data } = upload(submitData);

      toast.success("Listing created successfully!");
      setFormData({
        name: "",
        description: "",
        address: "",
        sell: false,
        rent: false,
        parking: false,
        furnished: false,
        offer: false,
        beds: 1,
        baths: 1,
        regularPrice: 0,
        discountedPrice: 0,
        images: [],
      });
    } catch (err) {
      toast.error("Error creating listing");
    }
  };

  return (
    <main className="p-3">
      <h3 className="fw-bold text-center my-3">Create a Listing</h3>
      <FormContainer>
        <Form onSubmit={handleSubmit}>
          <Row>
            {/* Left side */}
            <Col md={6}>
              <Form.Group className="my-2">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="my-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  id="description"
                  as="textarea"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="my-2">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Row className="my-3">
                <Col xs={6} md={3}>
                  <Form.Check
                    id="sell"
                    type="checkbox"
                    label="Sell"
                    checked={formData.sell}
                    onChange={handleChange}
                  />
                </Col>
                <Col xs={6} md={3}>
                  <Form.Check
                    id="rent"
                    type="checkbox"
                    label="Rent"
                    checked={formData.rent}
                    onChange={handleChange}
                  />
                </Col>
                <Col xs={6} md={3}>
                  <Form.Check
                    id="parking"
                    type="checkbox"
                    label="Parking"
                    checked={formData.parking}
                    onChange={handleChange}
                  />
                </Col>
                <Col xs={6} md={3}>
                  <Form.Check
                    id="furnished"
                    type="checkbox"
                    label="Furnished"
                    checked={formData.furnished}
                    onChange={handleChange}
                  />
                </Col>
              </Row>

              <Form.Check
                id="offer"
                type="checkbox"
                label="Offer"
                checked={formData.offer}
                onChange={handleChange}
              />

              <Row className="mb-3">
                <Col>
                  <Form.Control
                    id="beds"
                    type="number"
                    min="1"
                    value={formData.beds}
                    onChange={handleChange}
                  />
                  <Form.Text>Beds</Form.Text>
                </Col>
                <Col>
                  <Form.Control
                    id="baths"
                    type="number"
                    min="1"
                    value={formData.baths}
                    onChange={handleChange}
                  />
                  <Form.Text>Baths</Form.Text>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Control
                  id="regularPrice"
                  type="number"
                  min="0"
                  value={formData.regularPrice}
                  onChange={handleChange}
                />
                <Form.Text>Regular price ($ / Month)</Form.Text>
                <Form.Control
                  id="discountedPrice"
                  type="number"
                  min="0"
                  value={formData.discountedPrice}
                  onChange={handleChange}
                />
                <Form.Text>Discounted price ($ / Month)</Form.Text>
              </Form.Group>
            </Col>

            {/* Right side */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Images: <small>The first image will be cover</small>
                </Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Form.Group>

              {/* Preview images */}
              <Row>
                {formData.images.map((img, index) => (
                  <Col key={index} xs={6} className="mb-3">
                    <div className="position-relative">
                      <img
                        src={img.preview}
                        alt="preview"
                        className="img-fluid rounded"
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        className="position-absolute top-0 end-0"
                        onClick={() => handleDeleteImage(index)}
                      >
                        X
                      </Button>
                    </div>
                  </Col>
                ))}
              </Row>

              <Button type="submit" className="btn btn-primary w-100">
                Create Listing
              </Button>
            </Col>
          </Row>
        </Form>
      </FormContainer>
    </main>
  );
};

export default ListingPage;
