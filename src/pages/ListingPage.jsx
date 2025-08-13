import React, { useState } from "react";
import { Button, Col, Form, Row, Image } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useUploadImageMutation } from "../slices/usersApiSlice";
import { Loader } from "../components/ui/Loader";
import { toast } from "react-toastify";

const ListingPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [images, setImages] = useState([]); // [{file, preview}]

  const [upload, { isLoading }] = useUploadImageMutation();

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (images.length + selectedFiles.length > 6) {
      toast.error("You can only upload 6 images per listing");
      return;
    }

    const newImages = selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleDeleteImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (images.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    const formData = new FormData();
    images.forEach((img) => formData.append("images", img.file));

    try {
      const { data } = await upload(formData);

      toast.success("Image uploaded successfully");
      setImages([]);
    } catch (err) {
      console.log(err?.data?.message || err.error);
      toast.error("Image upload failed");
    }
  };

  return (
    <main className="p-3">
      <h3 className="fw-bold text-center my-3">Create a Listing</h3>
      <FormContainer>
        <Row>
          <Col md={6}>
            <Form>
              <Form.Group controlId="name" className="my-2">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="description" className="my-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="address" className="my-2">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Form.Group>

              <Row className="my-3">
                <Col xs={6} md={3}>
                  <Form.Check type="checkbox" label="Sell" id="sell" />
                </Col>
                <Col xs={6} md={3}>
                  <Form.Check type="checkbox" label="Rent" id="rent" />
                </Col>
                <Col xs={6} md={3}>
                  <Form.Check type="checkbox" label="Parking" id="parking" />
                </Col>
                <Col xs={6} md={3}>
                  <Form.Check
                    type="checkbox"
                    label="Furnished"
                    id="furnished"
                  />
                </Col>
              </Row>

              <Form.Check
                type="checkbox"
                label="Offer"
                className="mb-3"
                id="offer"
              />

              <Row className="mb-3">
                <Col>
                  <Form.Control
                    type="number"
                    min="1"
                    defaultValue="1"
                    id="beds"
                  />
                  <Form.Text>Beds</Form.Text>
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    min="1"
                    defaultValue="1"
                    id="baths"
                  />
                  <Form.Text>Baths</Form.Text>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Control
                  type="number"
                  min="0"
                  defaultValue="0"
                  id="regularprice"
                />
                <Form.Text>Regular price ($ / Month)</Form.Text>
                <Form.Control
                  type="number"
                  min="0"
                  defaultValue="0"
                  id="discountedprice"
                />
                <Form.Text>Discounted price ($ / Month)</Form.Text>
              </Form.Group>
            </Form>
          </Col>

          <Col md={6}>
            <Form.Group controlId="images" className="mb-3">
              <Form.Label>
                Images: <small>The first image will be cover (max 6)</small>
              </Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>

            {/* Preview Section */}
            {images.length > 0 && (
              <div>
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center justify-content-between mb-2"
                  >
                    <Image
                      src={img.preview}
                      thumbnail
                      width={100}
                      height={70}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteImage(index)}
                    >
                      DELETE
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Button
              type="button"
              className="btn btn-secondary w-100 mt-3"
              onClick={handleUpload}
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "UPLOAD"}
            </Button>
            <Button className="w-100 my-3">Create Listing</Button>
            {isLoading && <Loader />}
          </Col>
        </Row>
      </FormContainer>
    </main>
  );
};

export default ListingPage;
