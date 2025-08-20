import React, { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useSearchListingsQuery } from "../slices/listingsApiSlice";
import { Loader } from "../components/ui/Loader";
import { Message } from "../components/ui/Message";

const SearchPage = () => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    offer: false,
    parking: false,
    furnished: false,
    sort: "latest", // frontend-friendly sort values
  });

  const [params, setParams] = useState(null);

  // Fetch listings only when params is set
  const { data, isLoading, error } = useSearchListingsQuery(params, {
    skip: !params,
  });
  const listings = data?.listings || data || [];

  console.log("Fetched Listings:", listings);

  // Map frontend sort values to backend fields
  const mapSort = {
    latest: { sort: "createdAt", order: "desc" },
    oldest: { sort: "createdAt", order: "asc" },
    price_high: { sort: "regularPrice", order: "desc" },
    price_low: { sort: "regularPrice", order: "asc" },
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const { sort, order } = mapSort[filters.sort];

    setParams({
      searchTerm: search,
      type: filters.type,
      offer: filters.offer,
      parking: filters.parking,
      furnished: filters.furnished,
      sort,
      order,
    });
  };

  return (
    <Row className="mt-3 ">
      <Col md={3}>
        <Form className="p-3 rounded" onSubmit={handleOnSubmit}>
          {/* Search box */}
          <Form.Group className="mb-3">
            <Form.Label>Search</Form.Label>
            <Form.Control
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-75"
            />
          </Form.Group>

          {/* Type */}
          <Form.Group className="mb-3">
            <Form.Label>Type:</Form.Label>
            <div>
              <Form.Check
                type="radio"
                label="All"
                name="type"
                checked={filters.type === "all"}
                onChange={() => setFilters({ ...filters, type: "all" })}
              />
              <Form.Check
                type="radio"
                label="Rent"
                name="type"
                checked={filters.type === "rent"}
                onChange={() => setFilters({ ...filters, type: "rent" })}
              />
              <Form.Check
                type="radio"
                label="Sell"
                name="type"
                checked={filters.type === "sell"}
                onChange={() => setFilters({ ...filters, type: "sell" })}
              />

              <Form.Check
                type="checkbox"
                label="Offer"
                checked={filters.offer}
                onChange={(e) =>
                  setFilters({ ...filters, offer: e.target.checked })
                }
              />
            </div>
          </Form.Group>

          {/* Amenities */}
          <Form.Group className="mb-3">
            <Form.Label>Amenities:</Form.Label>
            <div>
              <Form.Check
                type="checkbox"
                label="Parking"
                checked={filters.parking}
                onChange={(e) =>
                  setFilters({ ...filters, parking: e.target.checked })
                }
              />
              <Form.Check
                type="checkbox"
                label="Furnished"
                checked={filters.furnished}
                onChange={(e) =>
                  setFilters({ ...filters, furnished: e.target.checked })
                }
              />
            </div>
          </Form.Group>

          {/* Sort */}
          <Form.Group className="mb-3">
            <Form.Label>Sort:</Form.Label>
            <Form.Select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className="w-75"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="price_high">Price: High to low</option>
              <option value="price_low">Price: Low to High</option>
            </Form.Select>
          </Form.Group>

          <Button variant="dark" className="fw-bold w-75 " type="submit">
            Search
          </Button>
        </Form>
      </Col>

      {/* Results */}
      <Col md={9}>
        <h4 className="mb-4 text-center">Listing Results</h4>
        {isLoading && <Loader />}
        {error && <Message variant="danger">{error}</Message>}

        <Row>
          {listings && listings.length > 0
            ? listings.map((listing) => (
                <Col md={6} lg={4} key={listing._id} className="mb-4">
                  <Card className="shadow-sm h-100">
                    <Card.Img
                      variant="top"
                      src={listing.images?.[0]}
                      alt={listing.name}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <Card.Body>
                      <Card.Title className="fw-bold">
                        {listing.name}
                      </Card.Title>
                      <Card.Text className="text-muted mb-2">
                        {listing.address}
                      </Card.Text>
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
              ))
            : params &&
              !isLoading && <Message variant="info">No listings found</Message>}
        </Row>
      </Col>
    </Row>
  );
};

export default SearchPage;
