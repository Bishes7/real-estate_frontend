import React, { useMemo, useState } from "react";

import { Loader } from "../components/ui/Loader";
import { Message } from "../components/ui/Message";
import { Card, Button, Row, Col, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGetListingsQuery, useGetPopularQuery, useGetSimilarQuery } from "../slices/listingsApiSlice";
import { BASE_URL } from "../utils/constants";
import {
  useAddFavoriteMutation,
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
} from "../slices/usersApiSlice";

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

  const { data: popular = [] } = useGetPopularQuery(6);

  // recommended: take most recent viewed id and fetch similar for it
  let lastViewedId = null;
  try {
    const raw = localStorage.getItem("recentlyViewedListingIds");
    const ids = JSON.parse(raw);
    if (Array.isArray(ids) && ids.length > 0) lastViewedId = ids[0];
  } catch (_) {}
  const { data: recommended = [] } = useGetSimilarQuery(lastViewedId, {
    skip: !lastViewedId,
  });

  // favorites hooks
  const { data: favoritesData } = useGetFavoritesQuery(undefined, { skip: false });
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

  const favoriteIds = useMemo(
    () => new Set((favoritesData || []).map((f) => (f._id ? f._id : f))),
    [favoritesData]
  );

  const isFav = (id) => favoriteIds.has(id);

  const toggleFavorite = async (listingId) => {
    try {
      if (isFav(listingId)) {
        await removeFavorite(listingId).unwrap();
      } else {
        await addFavorite(listingId).unwrap();
      }
    } catch (err) {
      console.error("Favorite toggle failed", err);
    }
  };

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
      {recommended.length > 0 && (
        <>
          <h5 className="mb-3">Recommended For You</h5>
          <Row className="mb-4">
            {recommended.map((listing) => (
              <Col key={listing._id} md={4} className="mb-3">
                <Card className="shadow-sm">
                  <Card.Img
                    variant="top"
                    src={
                      listing.images && listing.images.length > 0
                        ? `${BASE_URL}${
                            listing.images[0].startsWith("/")
                              ? listing.images[0]
                              : "/" + listing.images[0]
                          }`
                        : "/default-image.jpg"
                    }
                    alt={listing.name}
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title className="mb-0">{listing.name}</Card.Title>
                    <div className="text-muted small">{listing.address}</div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
      {popular.length > 0 && (
        <>
          <h5 className="mb-3">Popular Listings</h5>
          <Row className="mb-4">
            {popular.map((listing) => (
              <Col key={listing._id} md={4} className="mb-3">
                <Card className="shadow-sm">
                  <Card.Img
                    variant="top"
                    src={
                      listing.images && listing.images.length > 0
                        ? `${BASE_URL}${
                            listing.images[0].startsWith("/")
                              ? listing.images[0]
                              : "/" + listing.images[0]
                          }`
                        : "/default-image.jpg"
                    }
                    alt={listing.name}
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title className="mb-0">{listing.name}</Card.Title>
                    <div className="text-muted small">{listing.address}</div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
      <Row>
        {listingData?.map((listing) => (
          <Col key={listing._id} md={4} className="mb-4">
            <Card className="shadow-sm">
              <Card.Img
                variant="top"
                src={
                  listing.images && listing.images.length > 0
                    ? `${BASE_URL}${
                        listing.images[0].startsWith("/")
                          ? listing.images[0]
                          : "/" + listing.images[0]
                      }`
                    : "/default-image.jpg"
                }
                alt={listing.name}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <Card.Title className="mb-0">{listing.name}</Card.Title>
                  <Button
                    variant={isFav(listing._id) ? "danger" : "outline-danger"}
                    size="sm"
                    onClick={() => toggleFavorite(listing._id)}
                    aria-label="Toggle favorite"
                  >
                    {isFav(listing._id) ? "♥" : "♡"}
                  </Button>
                </div>
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
