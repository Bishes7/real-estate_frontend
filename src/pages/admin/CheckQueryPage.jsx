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

  // Auto-mark all unread messages as read when page loads
  React.useEffect(() => {
    if (messages && messages.length > 0) {
      console.log("Messages data:", messages);
      console.log("First message structure:", messages[0]);
      
      // Check if messages have status field or if they're all unread by default
      const unreadMessages = messages.filter(msg => 
        msg.status === 'unread' || !msg.status || msg.status === undefined
      );
      
      console.log("Unread messages found:", unreadMessages.length);
      
      unreadMessages.forEach(msg => {
        console.log("Marking message as read:", msg._id);
        markRead(msg._id).catch(err => {
          console.error("Error marking message as read:", err);
        });
      });
    }
  }, [messages, markRead]);

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteMessage(id).unwrap();
        toast.success("Message deleted");
      } catch (err) {
        toast.error(err?.data?.message);
      }
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
                  variant="outline-danger"
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
