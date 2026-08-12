import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "./config";

function Admin() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/contact`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>📩 Contact Messages</h1>

      {messages.length === 0 ? (
        <p>No messages found</p>
      ) : (
        messages.map((msg, index) => (
          <div
            key={index}
            style={{
              border: "1px solid gold",
              margin: "10px 0",
              padding: "15px",
              borderRadius: "10px"
            }}
          >
            <h3>{msg.name}</h3>
            <p><b>Email:</b> {msg.email}</p>
            <p>{msg.message}</p>

            {msg.createdAt && (
              <small>{new Date(msg.createdAt).toLocaleString()}</small>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Admin;