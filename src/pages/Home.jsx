import React, { useState } from "react";

import { Loader } from "../components/ui/Loader";
import { Message } from "../components/ui/Message";
import { Card, Button, Row, Col, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGetListingsQuery } from "../slices/listingsApiSlice";
import { BASE_URL } from "../utils/constants";

const Home = () => {
  const [page, setPage] = useState(1);
  const limit = 6; // listings per page
  const startIndex = (page - 1) * limit;

  const {
    data: listings,
    isLoading,
    error,
  } = useGetListingsQuery({
    limit,
    startIndex,
  });

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || "Failed to load listings"}
      </Message>
    );

  const { listings: listingData, totalCount } = listings;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Available Listings</h2>
      <Row>
        {listingData?.map((listing) => (
          <Col key={listing._id} md={4} className="mb-4">
            <Card className="shadow-sm">
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
                <Card.Title>{listing.name}</Card.Title>
                <Card.Text>
                  <strong>Price:</strong> $
                  {listing.discountedPrice > 0
                    ? listing.discountedPrice
                    : listing.regularPrice}{" "}
                  <br />
                  <strong>Beds:</strong> {listing.beds} |{" "}
                  <strong>Baths:</strong> {listing.baths}
                </Card.Text>
                <Button
                  as={Link}
                  to={`/listing/${listing._id}`}
                  variant="primary"
                  size="sm"
                >
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-4">
          <Pagination.Prev
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          />
          {[...Array(totalPages).keys()].map((x) => (
            <Pagination.Item
              key={x + 1}
              active={x + 1 === page}
              onClick={() => setPage(x + 1)}
            >
              {x + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          />
        </Pagination>
      )}
    </div>
  );
};

export default Home;
