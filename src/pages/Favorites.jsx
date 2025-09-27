import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useGetFavoritesQuery } from "../slices/usersApiSlice";
import { Loader } from "../components/ui/Loader";
import { Message } from "../components/ui/Message";
import { BASE_URL } from "../utils/constants";

const Favorites = () => {
  const { data, isLoading, error } = useGetFavoritesQuery();
  const favorites = Array.isArray(data) ? data : [];

  return (
    <Container className="mt-4">
      <h3 className="mb-4">My Favorites</h3>
      {isLoading && <Loader />}
      {error && (
        <Message variant="danger">{error?.data?.message || "Error"}</Message>
      )}
      {!isLoading && favorites.length === 0 && (
        <Message variant="info">No favorite listings yet.</Message>
      )}
      <Row>
        {favorites.map((listing) => (
          <Col md={6} lg={4} key={listing._id} className="mb-4">
            <Card className="shadow-sm h-100">
              <Card.Img
                variant="top"
                src={
                  listing.images && listing.images.length > 0
                    ? `${BASE_URL}${listing.images[0]}`
                    : "/default-image.jpg"
                }
                alt={listing.name}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title className="fw-bold">{listing.name}</Card.Title>
                <Card.Text className="text-muted">{listing.address}</Card.Text>
                <Card.Text>
                  {listing.offer && listing.discountedPrice > 0
                    ? listing.discountedPrice
                    : listing.regularPrice}
                  {listing.type === "rent" && "/month"}
                </Card.Text>
                <Card.Text className="small">
                  {listing.beds} Beds | {listing.baths} Baths
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Favorites;


