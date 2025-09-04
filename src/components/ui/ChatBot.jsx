import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { FaRobot } from "react-icons/fa";
import {
  useGetChatHistoryQuery,
  useSaveMessageMutation,
  useSendMessageMutation,
} from "../../slices/botApiSlice";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Persistent session ID in localStorage
  const sessionId =
    localStorage.getItem("chatSessionId") ||
    (() => {
      const newId = `session_${Date.now()}`;
      localStorage.setItem("chatSessionId", newId);
      return newId;
    })();

  // API hooks
  const [saveMessage] = useSaveMessageMutation();
  const { data: history, refetch } = useGetChatHistoryQuery(sessionId, {
    skip: !open,
  });
  const [sendMessage] = useSendMessageMutation();

  // Load chat history when chat opens
  useEffect(() => {
    if (open) refetch();
  }, [open, refetch]);

  // Update messages state with DB history
  useEffect(() => {
    if (history) {
      setMessages(history);
    }
  }, [history]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput("");

    // Show user message immediately in UI
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);

    try {
      // Save user message to DB
      await saveMessage({ sessionId, sender: "user", text: userText }).unwrap();

      // Send user input to backend for bot response
      const response = await sendMessage({
        sessionId,
        message: userText,
      }).unwrap();
      const botText = response.reply || "Sorry, I didn't understand that.";

      // Save bot reply to DB
      await saveMessage({ sessionId, sender: "bot", text: botText }).unwrap();

      // Display bot reply in UI
      setMessages((prev) => [...prev, { sender: "bot", text: botText }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Error connecting to server." },
      ]);
    }
  };

  return (
    <div>
      {/* Floating Button */}
      <Button
        variant="primary"
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          zIndex: 1000,
        }}
      >
        <FaRobot />
      </Button>

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "300px",
            height: "400px",
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#0d6efd",
              color: "white",
              padding: "10px",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}
          >
            Chat with Us
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  textAlign: msg.sender === "user" ? "right" : "left",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "15px",
                    background: msg.sender === "user" ? "#0d6efd" : "#f1f1f1",
                    color: msg.sender === "user" ? "white" : "black",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          {/* Input */}
          <Form onSubmit={handleSend} className="d-flex p-2 border-top">
            <Form.Control
              type="text"
              value={input}
              placeholder="Type a message..."
              onChange={(e) => setInput(e.target.value)}
            />
            <Button type="submit" variant="primary" className="ms-2">
              ➤
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
