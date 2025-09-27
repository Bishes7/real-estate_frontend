import React from "react";
import { Table, Button } from "react-bootstrap";
import {
  useAdminGetBookingsQuery,
  useUpdateBookingStatusMutation,
} from "../../slices/bookingsApiSlice";

const ManageBookings = () => {
  const { data = [], isLoading, error, refetch } = useAdminGetBookingsQuery();
  const [updateStatus] = useUpdateBookingStatusMutation();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  const setStatus = async (id, status) => {
    await updateStatus({ id, status }).unwrap();
    refetch();
  };

  return (
    <div>
      <h3 className="mb-3">Manage Bookings</h3>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Listing</th>
            <th>When</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((b) => (
            <tr key={b._id}>
              <td>{b._id}</td>
              <td>{b.user?.email}</td>
              <td>{b.listing?.name}</td>
              <td>{new Date(b.scheduledAt).toLocaleString()}</td>
              <td>{b.status}</td>
              <td>
                <Button
                  variant="success"
                  size="sm"
                  className="me-2"
                  onClick={() => setStatus(b._id, "confirmed")}
                >
                  Confirm
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => setStatus(b._id, "cancelled")}
                >
                  Cancel
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ManageBookings;


