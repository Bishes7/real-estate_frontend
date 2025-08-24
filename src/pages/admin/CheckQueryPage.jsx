import React from "react";
import {
  useDeleteMessageMutation,
  useGetMessageQuery,
  useMarkAsReadMutation,
} from "../../slices/contactApiSlice";
import { Loader } from "../../components/ui/Loader";
import { Message } from "../../components/ui/Message";
import { Badge, Button, Container, Table } from "react-bootstrap";
import { toast } from "react-toastify";

const CheckQueryPage = () => {
  const { data: messages, isLoading, error, refetch } = useGetMessageQuery();
  const [deleteMessage] = useDeleteMessageMutation();
  const [markRead] = useMarkAsReadMutation();

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteMessage(id).unwrap();
        toast.success("Message deleted");
      } catch (err) {
        toast.err(err?.data?.message);
      }
    }
  };

  //   update message status
  const handleReply = async (id, email) => {
    try {
      await markRead(id).unwrap();
      toast.info("Message mark as read");
      refetch();
      window.location.href = `mailto: ${email}?subject=Regarding%20your%20property%20enquiry`;
    } catch (err) {
      toast.err(err?.data?.message);
    }
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
            <th>Status</th>
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
                {msg.status === "unread" ? (
                  <Badge bg="warning text-dark">Unread</Badge>
                ) : (
                  <Badge bg="success">Read</Badge>
                )}
              </td>
              <td>
                <Button
                  size="sm"
                  variant="outline-primary"
                  href={`mailto:${msg.email}`}
                  onClick={() => handleReply(msg._id)}
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
