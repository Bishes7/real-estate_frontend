import React from "react";
import { Loader } from "../../components/ui/Loader";
import { Message } from "../../components/ui/Message";
import { Table, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  useDeleteListingMutation,
  useGetListingsQuery,
} from "../../slices/listingsApiSlice";
import { useNavigate } from "react-router-dom";

const ManageListings = () => {
  const navigate = useNavigate();
  const { data: listings, isLoading, error, refetch } = useGetListingsQuery();
  const [deleteListing] = useDeleteListingMutation();

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

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error?.data?.message}</Message>;

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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings?.map((listing) => (
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
