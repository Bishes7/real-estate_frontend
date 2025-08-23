import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { useContactMessageMutation } from "../slices/contactApiSlice";

const ContactAdmin = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [contactMessage, { isLoading }] = useContactMessageMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!name || !email || !contactNumber || !subject || !message) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await contactMessage({
        name,
        email,
        contactNumber,
        subject,
        message,
      }).unwrap();
      toast.success("Your message has been sent to the admin!");
      // Reset form fields
      setName("");
      setEmail("");
      setContactNumber("");
      setSubject("");
      setMessage("");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send message");
    }
  };

  return (
    <div className="d-flex justify-content-center mt-4">
      <Card
        className="p-4 shadow-sm"
        style={{ width: "100%", maxWidth: "600px" }}
      >
        <h3 className="text-center mb-4">Contact Admin</h3>
        <Form onSubmit={submitHandler}>
          {/* Name */}
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Your Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          {/* Email */}
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          {/* Contact Number */}
          <Form.Group className="mb-3" controlId="contactNumber">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your contact number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />
          </Form.Group>

          {/* Subject */}
          <Form.Group className="mb-3" controlId="subject">
            <Form.Label>Subject</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </Form.Group>

          {/* Message */}
          <Form.Group className="mb-3" controlId="message">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Write your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </Form.Group>

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            className="w-100"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Message"}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default ContactAdmin;
