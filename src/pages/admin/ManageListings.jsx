import React from "react";
import { Loader } from "../../components/ui/Loader";
import { Message } from "../../components/ui/Message";
import { Table, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useDeleteListingMutation } from "../../slices/listingsApiSlice";
import {
  useApproveListingMutation,
  useRejectListingMutation,
  useGetAllListingsAdminQuery,
} from "../../slices/adminApiSLice";
import { data, useNavigate } from "react-router-dom";

const ManageListings = () => {
  const navigate = useNavigate();
  const { data: listings, isLoading, error, refetch } = useGetAllListingsAdminQuery({
    limit: 50,
    startIndex: 0,
  });
  const [deleteListing] = useDeleteListingMutation();
  const [approveListing] = useApproveListingMutation();
  const [rejectListing] = useRejectListingMutation();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await deleteListing(id).unwrap();
        toast.success("Listing deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete listing");
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveListing(id).unwrap();
      toast.success("Listing approved");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to approve");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectListing(id).unwrap();
      toast.success("Listing rejected");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to reject");
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error?.data?.message}</Message>;

  const { listings: listingData } = listings || {};
  return (
    <div>
      <h2 className="mb-4">Manage Listings</h2>
      <Table striped bordered hover responsive className="table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {listingData?.map((listing) => (
            <tr key={listing._id}>
              <td>{listing._id}</td>
              <td>{listing.name}</td>
              <td>
                <span
                  className={`badge ${
                    listing.type === "rent" ? "bg-info" : "bg-success"
                  }`}
                >
                  {listing.type}
                </span>
              </td>
              <td>${listing.regularPrice}</td>
              <td>
                <span
                  className={`badge ${
                    listing.status === "approved"
                      ? "bg-success"
                      : listing.status === "rejected"
                      ? "bg-danger"
                      : "bg-warning text-dark"
                  }`}
                >
                  {listing.status}
                </span>
              </td>
              <td>
                <Button
                  variant="secondary"
                  size="sm"
                  className="me-2"
                  onClick={() =>
                    navigate(`/admin/listings/${listing._id}/edit`)
                  }
                >
                  {" "}
                  <i className="bi bi-pencil"></i> Edit
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  className="me-2"
                  onClick={() => handleApprove(listing._id)}
                  disabled={listing.status === "approved"}
                >
                  Approve
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleReject(listing._id)}
                  disabled={listing.status === "rejected"}
                >
                  Reject
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(listing._id)}
                >
                  <i className="bi bi-trash"></i> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ManageListings;
