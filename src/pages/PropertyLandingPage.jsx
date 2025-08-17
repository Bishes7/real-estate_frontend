import React from "react";
import { useGetListingQuery } from "../slices/listingsApiSlice";
import { useParams } from "react-router-dom";
import { Loader } from "../components/ui/Loader";
import { Message } from "../components/ui/Message";
import FormContainer from "../components/FormContainer";
import { BASE_URL } from "../utils/constants";
import { FaBed, FaBath, FaCar, FaCouch } from "react-icons/fa";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const PropertyLandingPage = () => {
  const { listingId } = useParams();
  const { data: listing, isLoading, error } = useGetListingQuery(listingId);

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;

  return (
    <div>
      {/* Title */}

      {/* Swiper Carousel */}
      {listing.images?.length > 0 && (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          spaceBetween={10}
          slidesPerView={1}
          style={{
            width: "100vw",
            height: "60vh",
          }}
        >
          {listing.images.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={`${BASE_URL}${img}`}
                alt={`${listing.name}-${index}`}
                style={{
                  width: "100%",
                  height: "500px",
                  objectFit: "cover",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Property Info */}
      <FormContainer>
        <div className="p-4">
          {/* Title + Price */}
          <h3 className="fw-bold mb-2">
            {listing.name} - $
            {listing.offer && listing.discountedPrice > 0
              ? listing.discountedPrice
              : listing.regularPrice}{" "}
            {listing.type === "rent" && "/ month"}
          </h3>
          {/* Status + Offer Badges */}
          <div className="d-flex gap-2 mb-3">
            <span
              className={`badge px-4 py-2 ${
                listing.type === "rent" ? "bg-danger" : "bg-success"
              }`}
              style={{ fontSize: "1rem" }}
            >
              {listing.type === "rent" ? "For Rent" : "For Sale"}
            </span>

            <span
              className="badge bg-success px-4 py-2"
              style={{ fontSize: "1rem" }}
            >
              $
              {listing.offer && listing.discountedPrice > 0
                ? listing.discountedPrice
                : listing.regularPrice}
            </span>
          </div>
          {/* Description */}
          <strong>Description: </strong> {listing.description}
          {/* Address */}
          <p>
            <strong>Address:</strong> {listing.address}
          </p>
          <div className="d-flex gap-4 flex-wrap mt-3 ">
            <span className="d-flex align-items-center gap-1 ">
              <FaBed />
              {listing.beds} Beds
            </span>
            <span className="d-flex align-items-center gap-1">
              <FaBath />
              {listing.baths} Baths
            </span>
            <span className="d-flex align-items-center gap-1">
              <FaCar />
              {listing.parking ? "Parking" : "No Parking"}
            </span>
            <span className="d-flex align-items-center gap-1">
              <FaCouch />
              {listing.furnished ? "Furnished" : "Not furnished"}
            </span>
          </div>
        </div>
      </FormContainer>
    </div>
  );
};

export default PropertyLandingPage;
