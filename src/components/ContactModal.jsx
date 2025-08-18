import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { Message } from "./ui/Message";
import { useContactMessageMutation } from "../slices/contactApiSlice";

const ContactModal = ({ show, handleClose, listingId }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [contactMessage, { isLoading, error }] = useContactMessageMutation();

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await contactMessage({ listingId, ...formData }).unwrap();
      toast.success("Your message has been sent");
      setFormData({ name: "", email: "", message: "" });
      handleClose();
    } catch (err) {
      toast.error(err?.data?.message);
    }
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Contact Agent</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              type="text"
              value={formData.name}
              onChange={handleOnChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
              type="email"
              value={formData.email}
              onChange={handleOnChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Message</Form.Label>
            <Form.Control
              name="message"
              as="textarea"
              value={formData.message}
              onChange={handleOnChange}
              required
            />
          </Form.Group>
          <Button
            type="submit"
            variant="dark"
            className="w-100 fw-bold"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Message"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ContactModal;
