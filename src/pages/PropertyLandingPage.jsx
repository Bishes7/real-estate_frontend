import React, { useEffect, useState } from "react";
import { useGetListingQuery, useGetSimilarQuery } from "../slices/listingsApiSlice";
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
import ContactModal from "../components/ContactModal";
import { useCreateBookingMutation } from "../slices/bookingsApiSlice";

const PropertyLandingPage = () => {
  const [showModal, setShowModal] = useState(false);
  const { listingId } = useParams();
  const { data: listing, isLoading, error } = useGetListingQuery(listingId);
  const { data: similar = [] } = useGetSimilarQuery(listingId);
  const [createBooking, { isLoading: isBookingLoading }] = useCreateBookingMutation();
  const [tourDateTime, setTourDateTime] = useState("");
  const [bookingMsg, setBookingMsg] = useState("");

  // track recently viewed listing ids in localStorage
  useEffect(() => {
    if (!listingId) return;
    try {
      const key = "recentlyViewedListingIds";
      const raw = localStorage.getItem(key);
      const ids = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
      const next = [listingId, ...ids.filter((id) => id !== listingId)].slice(0, 10);
      localStorage.setItem(key, JSON.stringify(next));
    } catch (_) {}
  }, [listingId]);

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || error?.error || "Failed to load listing"}
      </Message>
    );

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
              {listing.beds > 1 ? `${listing.beds}beds` : `${listing.beds} bed`}
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
        <div className="mt-2 mb-2">
          <button
            className="btn btn-dark w-100 py-2 fw-bold"
            onClick={() => setShowModal(true)}
          >
            Contact Agents
          </button>
          <div className="mt-3">
            <label className="form-label">Schedule a Tour</label>
            <div className="d-flex gap-2">
              <input
                type="datetime-local"
                className="form-control"
                value={tourDateTime}
                onChange={(e) => setTourDateTime(e.target.value)}
              />
              <button
                className="btn btn-outline-primary"
                disabled={isBookingLoading || !tourDateTime}
                onClick={async () => {
                  try {
                    if (!tourDateTime) return setBookingMsg("Select date/time");
                    await createBooking({ listingId, scheduledAt: tourDateTime }).unwrap();
                    setBookingMsg("Tour requested. We'll confirm soon.");
                  } catch (err) {
                    setBookingMsg(err?.data?.message || "Failed to schedule");
                  }
                }}
              >
                {isBookingLoading ? "Scheduling..." : "Schedule"}
              </button>
            </div>
            {bookingMsg && <div className="small mt-1">{bookingMsg}</div>}
          </div>
        </div>
      </FormContainer>

      <ContactModal
        show={showModal}
        listingId={listingId}
        listingName={listing?.name}
        handleClose={() => setShowModal(false)}
      />

      {/* Similar Listings */}
      {Array.isArray(similar) && similar.length > 0 && (
        <div className="container my-5">
          <h4 className="mb-3">Similar Listings</h4>
          <div className="row">
            {similar.map((s) => (
              <div key={s._id} className="col-md-4 mb-3">
                <div className="card h-100 shadow-sm">
                  <img
                    src={`${BASE_URL}${s.images?.[0] || ""}`}
                    className="card-img-top"
                    alt={s.name}
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h6 className="card-title">{s.name}</h6>
                    <div className="text-muted small">{s.address}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyLandingPage;
