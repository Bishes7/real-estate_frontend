import React, { useState, useEffect, useRef } from "react";
import { Button, Form, Badge, Spinner } from "react-bootstrap";
import { FaRobot, FaTimes, FaPaperPlane, FaHome, FaSearch, FaHeart, FaDollarSign } from "react-icons/fa";
import {
  useGetChatHistoryQuery,
  useSaveMessageMutation,
  useSendMessageMutation,
} from "../../slices/botApiSlice";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Generate new session ID on each page load/refresh
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // API hooks
  const [saveMessage] = useSaveMessageMutation();
  const { data: history, refetch } = useGetChatHistoryQuery(sessionId, {
    skip: !open,
  });
  const [sendMessage] = useSendMessageMutation();

  // Load chat history when chat opens (will be empty due to new session ID)
  useEffect(() => {
    if (open) refetch();
  }, [open, refetch]);

  // Clear messages when component mounts (fresh start on page refresh)
  useEffect(() => {
    setMessages([]);
    setShowSuggestions(true);
  }, []);

  // Update messages state with DB history
  useEffect(() => {
    if (history) {
      setMessages(history);
    }
  }, [history]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Quick suggestions for users
  const quickSuggestions = [
    { text: "Show me properties", icon: <FaHome /> },
    { text: "Find apartments under $2000", icon: <FaDollarSign /> },
    { text: "Properties in Sydney", icon: <FaSearch /> },
    { text: "Any available properties", icon: <FaHeart /> }
  ];

  // Test search function
  const testSearch = async () => {
    try {
      // First check if we have any properties in database
      const allPropsResponse = await fetch('http://localhost:8000/api/chatbot/all-properties');
      const allPropsData = await allPropsResponse.json();
      console.log('All properties in database:', allPropsData);
      
      // Then test specific search
      const response = await fetch('http://localhost:8000/api/chatbot/test-search?budget=2000&area=sydney&propertyType=apartment&transactionType=rent');
      const data = await response.json();
      console.log('Test search result:', data);
      
      // Show results in chat
      if (allPropsData.properties && allPropsData.properties.length > 0) {
        setMessages(prev => [...prev, {
          sender: "bot",
          text: `🧪 Test Results: Found ${allPropsData.count} properties in database`,
          properties: allPropsData.properties.slice(0, 3) // Show first 3 properties
        }]);
      } else {
        setMessages(prev => [...prev, {
          sender: "bot",
          text: "❌ No properties found in database. Please add some properties first."
        }]);
      }
    } catch (error) {
      console.error('Test search error:', error);
      setMessages(prev => [...prev, {
        sender: "bot",
        text: "❌ Error testing search. Check console for details."
      }]);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput("");
    setShowSuggestions(false);
    setIsTyping(true);

    // Show user message immediately in UI
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);

    try {
      // Save user message to DB
      await saveMessage({ sessionId, sender: "user", text: userText }).unwrap();

      // Simulate typing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Send user input to backend for bot response
      const response = await sendMessage({
        sessionId,
        message: userText,
      }).unwrap();
      const botText = response.reply || "Sorry, I didn't understand that.";
      const properties = response.properties || [];

      // Save bot reply to DB
      await saveMessage({ sessionId, sender: "bot", text: botText }).unwrap();

      // Display bot reply in UI with properties if available
      console.log('Bot response:', { botText, properties });
      console.log('Properties count:', properties.length);
      
      setMessages((prev) => [...prev, { 
        sender: "bot", 
        text: botText, 
        properties: properties 
      }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Error connecting to server." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setShowSuggestions(false);
  };

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        @keyframes glow {
          0% { box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3); }
          100% { box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6); }
        }
      `}</style>
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
          width: "65px",
          height: "65px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.6rem",
          zIndex: 1000,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "none",
          boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          animation: open ? "pulse 2s infinite" : "bounce 3s infinite"
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.15)";
          e.target.style.boxShadow = "0 15px 40px rgba(102, 126, 234, 0.6)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "0 10px 30px rgba(102, 126, 234, 0.4)";
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
            width: "380px",
            height: "550px",
            background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)",
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: "25px",
            boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
            overflow: "hidden",
            animation: "fadeInUp 0.5s ease-out"
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              padding: "15px 20px",
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "35px",
                height: "35px",
                background: "rgba(255,255,255,0.2)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <FaRobot />
              </div>
              <div>
                <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>AI Assistant</div>
                <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>Real Estate Expert</div>
              </div>
            </div>
            <Button
              variant="link"
              onClick={() => setOpen(false)}
              style={{ color: "white", padding: "5px" }}
            >
              <FaTimes />
            </Button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "15px",
              overflowY: "auto",
              background: "rgba(255,255,255,0.5)"
            }}
          >
            {messages.length === 0 && showSuggestions && (
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <div style={{ 
                  fontSize: "0.8rem", 
                  color: "#667eea", 
                  marginBottom: "10px",
                  fontWeight: "bold",
                  background: "rgba(102, 126, 234, 0.1)",
                  padding: "5px 10px",
                  borderRadius: "15px",
                  display: "inline-block"
                }}>
                  ✨ Fresh Chat Session
                </div>
                <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "15px" }}>
                  👋 Hi! I'm your AI real estate assistant. How can I help you today?
                </div>
                <Button 
                  variant="outline-info" 
                  size="sm" 
                  onClick={testSearch}
                  style={{ marginBottom: "10px", fontSize: "0.8rem" }}
                >
                  🧪 Test Search
                </Button>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {quickSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      style={{
                        fontSize: "0.8rem",
                        borderRadius: "15px",
                        border: "1px solid #667eea",
                        color: "#667eea",
                        background: "rgba(102, 126, 234, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        justifyContent: "flex-start"
                      }}
                    >
                      {suggestion.icon}
                      {suggestion.text}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "12px 16px",
                    borderRadius: msg.sender === "user" ? "20px 20px 5px 20px" : "20px 20px 20px 5px",
                    background: msg.sender === "user" 
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                      : "rgba(255,255,255,0.9)",
                    color: msg.sender === "user" ? "white" : "#333",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    fontSize: "0.9rem",
                    lineHeight: "1.4"
                  }}
                >
                  {msg.text}
                  
                  {/* Display property cards if bot message contains property data */}
                  {msg.sender === "bot" && msg.properties && msg.properties.length > 0 && (
                    <div style={{ marginTop: "15px" }}>
                      <div style={{ 
                        fontSize: "0.9rem", 
                        fontWeight: "bold", 
                        color: "#667eea", 
                        marginBottom: "10px",
                        textAlign: "center"
                      }}>
                        🏠 Found Properties for You:
                      </div>
                      <div style={{ 
                        display: "grid", 
                        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
                        gap: "12px",
                        maxHeight: "300px",
                        overflowY: "auto"
                      }}>
                        {msg.properties.map((property, propIndex) => (
                          <div
                            key={propIndex}
                            style={{
                              background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)",
                              backdropFilter: "blur(10px)",
                              border: "1px solid rgba(102, 126, 234, 0.2)",
                              borderRadius: "15px",
                              padding: "15px",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                              position: "relative",
                              overflow: "hidden"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "translateY(-5px)";
                              e.currentTarget.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.3)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
                            }}
                            onClick={() => window.open(`/listing/${property._id}`, '_blank')}
                          >
                            {/* Property Image */}
                            <div style={{ 
                              width: "100%", 
                              height: "120px", 
                              borderRadius: "10px", 
                              overflow: "hidden",
                              marginBottom: "10px",
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            }}>
                              {property.imageUrls && property.imageUrls[0] ? (
                                <img
                                  src={property.imageUrls[0]}
                                  alt={property.name}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    transition: "transform 0.3s ease"
                                  }}
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.parentElement.innerHTML = `
                                      <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; font-size: 2rem;">
                                        🏠
                                      </div>
                                    `;
                                  }}
                                />
                              ) : (
                                <div style={{ 
                                  display: "flex", 
                                  alignItems: "center", 
                                  justifyContent: "center", 
                                  height: "100%", 
                                  color: "white", 
                                  fontSize: "2rem" 
                                }}>
                                  🏠
                                </div>
                              )}
                            </div>
                            
                            {/* Property Details */}
                            <div>
                              <div style={{ 
                                fontWeight: "bold", 
                                fontSize: "0.9rem", 
                                marginBottom: "6px",
                                color: "#333",
                                lineHeight: "1.3"
                              }}>
                                {property.name}
                              </div>
                              
                              <div style={{ 
                                fontSize: "0.8rem", 
                                color: "#666", 
                                marginBottom: "8px",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px"
                              }}>
                                📍 {property.address}
                              </div>
                              
                              <div style={{ 
                                display: "flex", 
                                justifyContent: "space-between", 
                                alignItems: "center",
                                marginBottom: "8px"
                              }}>
                                <div style={{ 
                                  fontSize: "1rem", 
                                  color: "#667eea", 
                                  fontWeight: "bold",
                                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                                  WebkitBackgroundClip: "text",
                                  WebkitTextFillColor: "transparent",
                                  backgroundClip: "text"
                                }}>
                                  💰 ${property.price.toLocaleString()}
                                  {property.type === 'rent' ? '/week' : ''}
                                </div>
                                
                                <div style={{ 
                                  fontSize: "0.75rem", 
                                  color: "#888",
                                  display: "flex",
                                  gap: "8px"
                                }}>
                                  <span>🛏️ {property.bedrooms}</span>
                                  <span>🚿 {property.bathrooms}</span>
                                </div>
                              </div>
                              
                              <div style={{
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                color: "white",
                                padding: "6px 12px",
                                borderRadius: "20px",
                                fontSize: "0.75rem",
                                fontWeight: "bold",
                                textAlign: "center",
                                cursor: "pointer",
                                transition: "all 0.3s ease"
                              }}>
                                View Details →
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "12px" }}>
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: "20px 20px 20px 5px",
                    background: "rgba(255,255,255,0.9)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <Spinner animation="border" size="sm" />
                  <span style={{ fontSize: "0.9rem", color: "#666" }}>AI is typing...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: "15px",
            background: "rgba(255,255,255,0.8)",
            borderTop: "1px solid rgba(0,0,0,0.1)"
          }}>
            <Form onSubmit={handleSend} className="d-flex gap-2">
              <Form.Control
                ref={inputRef}
                type="text"
                value={input}
                placeholder="Type your message..."
                onChange={(e) => setInput(e.target.value)}
                style={{
                  borderRadius: "20px",
                  border: "1px solid #ddd",
                  padding: "10px 15px",
                  fontSize: "0.9rem"
                }}
                onFocus={() => setShowSuggestions(false)}
              />
              <Button 
                type="submit" 
                variant="primary"
                disabled={!input.trim() || isTyping}
                style={{
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)"
                }}
              >
                <FaPaperPlane />
              </Button>
            </Form>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default Chatbot;
