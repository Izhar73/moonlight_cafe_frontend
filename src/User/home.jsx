import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./../asset/home.css";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 🍕 Pizza/Burger image slider
  const images = [
    "https://img.freepik.com/free-photo/delicious-burger-with-wooden-background_23-2148290630.jpg",
    "https://img.freepik.com/free-photo/fried-chicken-with-french-fries-ketchup_140725-3702.jpg",
    "https://img.freepik.com/free-photo/close-up-tasty-pizza-with-ingredients_23-2150776185.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="homepage">
      {/* 🌟 Hero Slider */}
      <section className="hero-section">
        <div className="slider-container">
          {images.map((img, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? "active" : ""}`}
              style={{ backgroundImage: `url(${img})` }}
            ></div>
          ))}
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>
            Welcome to <span>MOONLIGHT CAFE</span>
          </h1>
          <p>Where every bite feels like moonlight magic ✨</p>
          <Link to="/Menu" className="hero-btn">
            Explore Menu 🍕
          </Link>
        </div>
      </section>

      {/* 🌙 Signature Section */}
      <section className="signature-section">
        <h2>✨ Our Signature Delights</h2>
        <p className="subtitle">Handcrafted favorites loved by foodies everywhere</p>
        <div className="signature-grid">
          <div className="sig-card">
            <img src= "https://thetouristchecklist.com/wp-content/uploads/2020/11/Fuoco-Pizza-629x420.jpg" alt="Pizza" />
            <h3>Cheese Burst Pizza</h3>
            <p>Overflowing with molten cheese and topped with fresh herbs — pure heaven in every bite.</p>
          </div>
          <div className="sig-card">
            <img src="https://img.freepik.com/free-photo/front-view-tasty-burger_23-2148290642.jpg" alt="Burger" />
            <h3>Moonlight Supreme Burger</h3>
            <p>Double-layered perfection with crispy patties, melty cheese & our secret moonlight sauce.</p>
          </div>
          <div className="sig-card">
            <img src="https://img.freepik.com/free-photo/crispy-french-fries-with-salt_144627-45433.jpg" alt="Fries" />
            <h3>Golden Fries</h3>
            <p>Perfectly crispy, lightly salted, and the ultimate sidekick to every meal.</p>
          </div>
        </div>
      </section>

      {/* 💫 Why People Love Us */}
      <section className="whyus-section">
        <h2>💖 Why People Love Moonlight Cafe</h2>
        <div className="whyus-cards">
          <div className="why-card">
            <i className="fas fa-fire"></i>
            <h3>Freshly Made</h3>
            <p>Every order is cooked fresh — no pre-made, no compromise!</p>
          </div>
          <div className="why-card">
            <i className="fas fa-star"></i>
            <h3>Premium Ingredients</h3>
            <p>Only top-quality cheese, sauces, and veggies find their way to your plate.</p>
          </div>
          <div className="why-card">
            <i className="fas fa-moon"></i>
            <h3>Late Night Vibes</h3>
            <p>We’re here when hunger strikes — even after sunset 🌙</p>
          </div>
        </div>
      </section>

      {/* 🍽️ Explore Section */}
      <section className="explore-section">
        <h2>Ready to Taste Happiness?</h2>
        <p>Check out our special menu packed with sizzling combos, cheesy pizzas, and crunchy fries!</p>
        <Link to="/Menu" className="explore-btn">
          🍔 Explore Our Menu 🍕
        </Link>
      </section>
    </div>
  );
}
