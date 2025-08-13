import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import FormContainer from "../components/FormContainer";

const ListingPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  return (
    <main className="p-3">
      <h3 className="fw-bold text-center my-3">Create a Listing</h3>
      <FormContainer>
        <Row>
          <Col md={6}>
            <Form>
              <Form.Group controlId="name" className="my-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="description" className="my-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="textarea"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="address" className="my-3">
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
                  <Form.Check type="checkbox" label="Parking " id="parking" />
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
                <Form.Text>Regular price ($ / Month) </Form.Text>
                <Form.Control
                  type="number"
                  min="0"
                  defaultValue="0"
                  id="discountedprice"
                />
                <Form.Text>Discounted price ($ / Month) </Form.Text>
              </Form.Group>
            </Form>
          </Col>

          <Col md={6}>
            <Form.Group controlId="images" className="mb-3">
              <Form.Label>
                Images: <small>The first image will be cover</small>
              </Form.Label>
              <Form.Control type="file" multiple accept="image/*" />
            </Form.Group>

            <Button type="submit" className="btn btn-secondary w-100">
              UPLOAD
            </Button>
            <Button className="w-100 my-3">Create Listing</Button>
          </Col>
        </Row>
      </FormContainer>
    </main>
  );
};

export default ListingPage;
