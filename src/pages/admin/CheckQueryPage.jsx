import React from "react";
import { useGetMessageQuery } from "../../slices/contactApiSlice";
import { Loader } from "../../components/ui/Loader";
import { Message } from "../../components/ui/Message";
import { Button, Container, Table } from "react-bootstrap";

const CheckQueryPage = () => {
  const { data: messages, isLoading, error } = useGetMessageQuery();

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;

  const handleDelete = (e) => {
    e.preventDefault();
  };

  return (
    <Container className="mt-3">
      <h2 className="mb-4">User Messages</h2>
      <Table striped hover responsive className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {messages?.map((msg, index) => (
            <tr key={msg._id}>
              <td>{index + 1}</td>
              <td>{msg.name}</td>
              <td>{msg.email}</td>
              <td>{msg.message}</td>
              <td>{new Date(msg.createdAt).toLocaleString()}</td>
              <td>
                <Button
                  size="sm"
                  variant="outline-primary"
                  href={`mailto:${msg.email}`}
                >
                  Reply
                </Button>
                <Button
                  size="sm"
                  variant="outline-danger"
                  className="ms-2"
                  onClick={() => handleDelete(msg._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default CheckQueryPage;
