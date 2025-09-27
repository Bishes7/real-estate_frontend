import React, { useState } from "react";
import { Badge, Dropdown, ListGroup } from "react-bootstrap";
import { Bell, CheckCircle, Trash } from "react-bootstrap-icons";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
  useCreateTestNotificationMutation,
} from "../slices/notificationsApiSlice";

const NotificationBell = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { data, isLoading } = useGetNotificationsQuery({ limit: 10 });
  const [markAsRead] = useMarkAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [createTestNotification] = useCreateTestNotificationMutation();

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id).unwrap();
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id).unwrap();
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const handleCreateTest = async () => {
    try {
      await createTestNotification();
    } catch (error) {
      console.error("Error creating test notification:", error);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "success": return "success";
      case "warning": return "warning";
      case "error": return "danger";
      case "booking": return "info";
      case "listing": return "primary";
      default: return "secondary";
    }
  };

  return (
    <Dropdown show={showDropdown} onToggle={setShowDropdown}>
      <Dropdown.Toggle
        variant="outline-light"
        className="position-relative border-0"
        style={{ background: "none" }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <Badge
            bg="danger"
            className="position-absolute top-0 start-100 translate-middle rounded-pill"
            style={{ fontSize: "0.7rem" }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu
        align="end"
        style={{ minWidth: "300px", maxHeight: "400px", overflowY: "auto" }}
      >
        <Dropdown.Header>
          <div className="d-flex justify-content-between align-items-center">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge bg="primary" pill>
                {unreadCount} new
              </Badge>
            )}
          </div>
        </Dropdown.Header>

        {isLoading ? (
          <Dropdown.Item disabled>Loading...</Dropdown.Item>
        ) : notifications.length === 0 ? (
          <>
            <Dropdown.Item disabled>No notifications</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleCreateTest}>
              Create Test Notification
            </Dropdown.Item>
          </>
        ) : (
          notifications.map((notification) => (
            <Dropdown.Item
              key={notification._id}
              as="div"
              className={`p-0 ${!notification.isRead ? "bg-light" : ""}`}
            >
              <div className="p-3 border-bottom">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-1">
                      <Badge
                        bg={getTypeColor(notification.type)}
                        className="me-2"
                        style={{ fontSize: "0.6rem" }}
                      >
                        {notification.type}
                      </Badge>
                      <small className="text-muted">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                    <h6 className="mb-1">{notification.title}</h6>
                    <p className="mb-2 small">{notification.message}</p>
                  </div>
                  <div className="d-flex gap-1">
                    {!notification.isRead && (
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => handleMarkAsRead(notification._id)}
                        title="Mark as read"
                      >
                        <CheckCircle size={12} />
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(notification._id)}
                      title="Delete"
                    >
                      <Trash size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </Dropdown.Item>
          ))
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationBell;
