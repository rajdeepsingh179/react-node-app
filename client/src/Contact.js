import React, { useState } from "react";
import "./Contact.css";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("SUBMIT CLICKED"); // 🔥 debug

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      console.log("RESPONSE:", res); // 🔥 debug

      const data = await res.json();
      console.log("DATA:", data);

      if (data.success) {
        alert("Message sent successfully ✅");
        setForm({ name: "", email: "", message: "" });
      } else {
        alert("Error sending message ❌");
      }

    } catch (err) {
      console.log("ERROR:", err);
      alert("Server error ❌");
    }
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>

      <form onSubmit={handleSubmit} className="contact-form">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
        />

        <textarea
          name="message"
          placeholder="Your Message"
          rows="5"
          value={form.message}
          onChange={handleChange}
        />

        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}

export default Contact;