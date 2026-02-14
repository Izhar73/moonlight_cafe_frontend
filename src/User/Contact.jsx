import React, { useState } from "react";
import { postMethod } from "../APIService";

export default function UserContact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ UPDATED: API-connected submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const RegisterationId = parseInt(localStorage.getItem("RegisterationId"));

    if (!RegisterationId) {
      alert("Please login to submit feedback");
      return;
    }

    const payload = {
      RegisterationId,
      Message: formData.message,
    };

    try {
      const res = await postMethod("Feedback/save", payload);

      if (res.Status === "OK") {
        alert("📨 Feedback sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("Failed to send feedback");
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  return (
    <div
      style={{
        background: "#fff8f0",
        minHeight: "100vh",
        fontFamily: "Poppins, sans-serif",
        color: "#333",
      }}
    >
      {/* ---------- Header ---------- */}
      <section
        style={{
          textAlign: "center",
          padding: "70px 20px 40px",
          background: "linear-gradient(45deg, #ff5722, #e64a19)",
          color: "white",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>
          📞 Contact Us
        </h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.9 }}>
          Have questions or feedback? We’d love to hear from you!
        </p>
      </section>

      {/* ---------- Form + Info ---------- */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "40px",
          padding: "60px 10%",
          background: "#fff",
        }}
      >
        {/* ---------- Form ---------- */}
        <div
          style={{
            background: "#fff",
            borderRadius: "15px",
            padding: "30px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ color: "#ff5722", marginBottom: "20px" }}>
            Get in Touch
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <textarea
              name="message"
              placeholder="Write your Message or Feedback..."
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required
              style={{ ...inputStyle, resize: "none" }}
            ></textarea>

            <button type="submit" style={btnStyle}>
              Send Message
            </button>
          </form>
        </div>

        {/* ---------- Info ---------- */}
        <div
          style={{
            background: "#fff3e0",
            borderRadius: "15px",
            padding: "30px",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ color: "#ff5722", marginBottom: "20px" }}>Visit Us</h2>
          <p>📍 Moonlight Cafe, Near City Center, Bharuch</p>
          <p>📞 +91 98765 43210</p>
          <p>📧 info@moonlightcafe.com</p>

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <a href="https://facebook.com" target="_blank" style={linkStyle}>
              🌐 Facebook
            </a>
            <a href="https://instagram.com" target="_blank" style={linkStyle}>
              📸 Instagram
            </a>
            <a
              href="https://wa.me/919978612310?text=Hello%20Moonlight%20Cafe!%20I%20want%20to%20order%20🍕"
              target="_blank"
              style={linkStyle}
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---- styles unchanged ---- */
const inputStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  marginBottom: "15px",
  fontSize: "1rem",
  outline: "none",
};

const btnStyle = {
  background: "#ff5722",
  color: "white",
  border: "none",
  padding: "12px 20px",
  width: "100%",
  borderRadius: "25px",
  fontSize: "1rem",
  fontWeight: 600,
  cursor: "pointer",
  transition: "0.3s",
};

const linkStyle = {
  color: "#ff5722",
  textDecoration: "none",
  fontWeight: 600,
};
