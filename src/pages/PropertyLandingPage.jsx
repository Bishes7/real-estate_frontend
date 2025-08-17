import React from "react";
import { useGetListingQuery } from "../slices/listingsApiSlice";
import { useParams } from "react-router-dom";
import { Loader } from "../components/ui/Loader";
import { Message } from "../components/ui/Message";
import FormContainer from "../components/FormContainer";
import { BASE_URL } from "../utils/constants";

const PropertyLandingPage = () => {
  const { listingId } = useParams();
  const {
    data: listing,
    isLoading,
    refetch,
    error,
  } = useGetListingQuery(listingId);

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;

  return (
    <FormContainer>
      <h3>{listing.name}</h3>
      <p>{listing.description}</p>
      <p>
        <strong>Address:</strong>
        {listing.address}
      </p>
      {listing.images?.length > 0 && (
        <img
          src={`${BASE_URL}${listing.images[0]}`}
          alt={listing.name}
          style={{ width: "400px", borderRadius: "10px" }}
        />
      )}
    </FormContainer>
  );
};

export default PropertyLandingPage;
