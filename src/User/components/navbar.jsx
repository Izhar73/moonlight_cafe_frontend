import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./../../asset/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [animateBadge, setAnimateBadge] = useState(false);
  const isLoggedIn = !!localStorage.getItem("UserToken");

  // 🧮 Load and Sync Cart Count from Backend (and listen to updates)
  useEffect(() => {
    const RegisterationId = parseInt(localStorage.getItem("RegisterationId")) || 0;

    // 🔹 Fetch the latest cart count from backend
    const fetchCartCount = async () => {
      if (!RegisterationId) {
        setCartCount(0);
        return;
      }

      try {
        const res = await getMethod(`cart/list/${RegisterationId}`);
        if (res.Status === "OK") {
          const totalQty = res.Result.reduce(
            (sum, i) => sum + (i.Quantity || i.quantity || 1),
            0
          );
          setCartCount(totalQty);
        } else {
          setCartCount(0);
        }
      } catch (err) {
        console.error("Error fetching cart count:", err);
        setCartCount(0);
      }
    };

    // 🚀 Initial fetch on load
    fetchCartCount();

    // 🔁 Listen for real-time cart updates (from Add/Remove actions)
    const handleCartUpdate = (e) => {
      const newCount = e?.detail?.count ?? 0;
      setCartCount(newCount);
      setAnimateBadge(true);
      setTimeout(() => setAnimateBadge(false), 600);
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    // 🧹 Cleanup
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  // 🚪 Logout Function
  const handleLogout = () => {
    localStorage.removeItem("UserName");
    localStorage.removeItem("UserEmail");
    localStorage.removeItem("UserToken");
    localStorage.removeItem("RegisterationId");
    localStorage.removeItem("cart");
    setCartCount(0);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* 🔹 Logo */}
      <div
        className="nav-logo"
        onClick={() => navigate("/home")}
        style={{ cursor: "pointer" }}
      >
        MOONLIGHT CAFE
      </div>

      {/* 🔹 Navigation Links */}
      <ul className="nav-links">
        <li>
          <NavLink
            to="/home"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            🏠 Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/menu"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            🍽️ Menu
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            ℹ️ About
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            ☎️ Contact
          </NavLink>
        </li>

        {/* Conditional Links */}
        {!isLoggedIn ? (
          <>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                ➕ Register
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                🔐 Login
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink
                to="/yourorders"
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                📦 Your Orders
              </NavLink>
            </li>

            {/* 🛒 Cart with Animated Badge */}
            <li>
              <div
                className="nav-item cart-combo"
                onClick={() => navigate("/cart")}
              >
                <span className="cart-icon">🛒</span>
                <span>Cart</span>
                {cartCount > 0 && (
                  <span
                    className={`cart-badge ${
                      animateBadge ? "pulse-animation" : ""
                    }`}
                  >
                    {cartCount}
                  </span>
                )}
              </div>
            </li>

            <li>
              <button onClick={handleLogout} className="logout-btn">
                🚪 Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
