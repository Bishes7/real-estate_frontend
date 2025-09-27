import React from "react";
import { useGetMyBookingsQuery } from "../slices/bookingsApiSlice";
import { BASE_URL } from "../utils/constants";

const MyBookings = () => {
  const { data = [], isLoading, error } = useGetMyBookingsQuery();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  return (
    <div className="container mt-4">
      <h3>My Scheduled Tours</h3>
      {data.length === 0 && <div>No bookings yet.</div>}
      <div className="row mt-3">
        {data.map((b) => (
          <div key={b._id} className="col-md-6 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="row g-0">
                <div className="col-4">
                  <img
                    src={`${BASE_URL}${b.listing?.images?.[0] || ""}`}
                    alt={b.listing?.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div className="col-8">
                  <div className="card-body">
                    <h6 className="card-title mb-1">{b.listing?.name}</h6>
                    <div className="small text-muted">{b.listing?.address}</div>
                    <div className="mt-2">
                      <strong>When:</strong> {new Date(b.scheduledAt).toLocaleString()}
                    </div>
                    <span className={`badge ${
                      b.status === "confirmed" ? "bg-success" : b.status === "cancelled" ? "bg-danger" : "bg-warning text-dark"
                    }`}>{b.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;


