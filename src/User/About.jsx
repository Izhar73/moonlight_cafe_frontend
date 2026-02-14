import React from "react";

export default function About() {
  return (
    <div
      style={{
        fontFamily: "Poppins, sans-serif",
        backgroundColor: "#fff7f0",
        color: "#333",
        padding: "50px 20px",
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          textAlign: "center",
          marginBottom: "50px",
        }}
      >
        <h1
          style={{
            color: "#ff5722",
            fontSize: "2.5rem",
            fontWeight: "700",
            marginBottom: "10px",
          }}
        >
          🍕 About MOONLIGHT CAFE
        </h1>
        <p style={{ fontSize: "1.1rem", maxWidth: "700px", margin: "0 auto" }}>
          Welcome to <b>MOONLIGHT CAFE</b> — where flavor meets freshness!  
          We serve the most delicious pizzas, burgers, and combos made from
          premium ingredients with a touch of love.  
          Our goal is simple: to make every bite unforgettable. ❤️
        </p>
      </section>

      {/* Image Section */}
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "30px",
          flexWrap: "wrap",
          marginBottom: "60px",
        }}
      >
        <img
          src="https://png.pngtree.com/background/20240507/original/pngtree-delicious-salami-and-olive-pizza-in-3d-rendered-advertising-background-picture-image_8838188.jpg"
          alt="Cafe Interior"
          style={{
            width: "420px",
            borderRadius: "15px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          }}
        />
        <img
          src="https://tse1.mm.bing.net/th/id/OIP.vZnDvs9GCbfzKh11Hb4f2AHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
          alt="Food Items"
          style={{
            width: "420px",
            borderRadius: "15px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          }}
        />
      </section>

      {/* Mission Section */}
      <section
        style={{
          backgroundColor: "#fff",
          borderRadius: "15px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          padding: "40px 30px",
          maxWidth: "900px",
          margin: "0 auto 60px",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#ff5722", fontSize: "2rem", marginBottom: "10px" }}>
          Our Mission
        </h2>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.7" }}>
          At MOONLIGHT CAFE, we believe great food brings people together.  
          Whether it’s a quick lunch, a family dinner, or a late-night snack,
          we’re here to make your day brighter with mouth-watering flavors.
        </p>
      </section>

      {/* Contact CTA */}
      <section
        style={{
          textAlign: "center",
          padding: "30px 20px",
        }}
      >
        <h3 style={{ fontSize: "1.8rem", marginBottom: "15px" }}>
          Visit Us or Order Online!
        </h3>
        <a
          href="/contact"
          style={{
            backgroundColor: "#ff5722",
            color: "#fff",
            textDecoration: "none",
            padding: "12px 30px",
            borderRadius: "25px",
            fontWeight: "600",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#e64a19")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#ff5722")}
        >
          Contact Us
        </a>
      </section>
    </div>
  );
}
