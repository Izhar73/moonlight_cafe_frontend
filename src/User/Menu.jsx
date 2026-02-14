import React, { useEffect, useState } from "react";
import { getMethod, postMethod } from "../APIService";
import { scroller } from "react-scroll";

export default function MenuPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showIntro, setShowIntro] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("vegPizza");

  const getData = async () => {
    try {
      const response = await getMethod("product/list");
      if (response.Status === "OK") setProducts(response.Result);
      else alert("Failed to fetch products!");
    } catch (err) {
      console.error("product fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();

    const introDisplayMs = 3000;
    const fadeMs = 1000;

    const t1 = setTimeout(() => {
      const overlay = document.querySelector(".introOverlay");
      if (overlay) overlay.classList.add("fadeOut");
      setTimeout(() => {
        setShowIntro(false);
        setShowMenu(true);
      }, fadeMs);
    }, introDisplayMs);

    return () => clearTimeout(t1);
  }, []);

  // ✅ Filtering Logic (veg/non-veg pizza & burgers)
  const vegPizzas = products.filter(
    (item) =>
      item.CategoryName?.toLowerCase().includes("pizza") &&
      !item.ProductName.toLowerCase().includes("chicken")
  );

  const nonVegPizzas = products.filter(
    (item) =>
      item.CategoryName?.toLowerCase().includes("pizza") &&
      item.ProductName.toLowerCase().includes("chicken")
  );

  const vegBurgers = products.filter(
    (item) =>
      item.CategoryName?.toLowerCase().includes("burger") &&
      !item.ProductName.toLowerCase().includes("chicken")
  );

  const nonVegBurgers = products.filter(
    (item) =>
      item.CategoryName?.toLowerCase().includes("burger") &&
      item.ProductName.toLowerCase().includes("chicken")
  );

  const scrollToSection = (id) => {
    setActiveTab(id);
    scroller.scrollTo(id, {
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart",
      offset: -60,
    });
  };

  const addToCart = async (product, e) => {
    const RegisterationId =
      parseInt(localStorage.getItem("RegisterationId")) || 0;

    if (!RegisterationId) {
      alert("⚠️ Please login first!");
      return;
    }

    const json = {
      RegisterationId,
      ProductId: product._id,
      ProductName: product.ProductName,
      Quantity: 1,
      Price: parseFloat(product.Price) || 0,
      Total: parseFloat(product.Price),
      FileName: product.FileName || "",
    };

    try {
      const res = await postMethod("cart/save", json);
      if (res.Status === "OK") flyToCart(e);
    } catch (err) {
      console.error("Add to Cart Error:", err);
      alert("⚠️ Something went wrong!");
    }
  };

  const flyToCart = (e) => {
    const cartIcon = document.querySelector(".cart-icon");
    if (!cartIcon) return;

    const img = e.target.closest(".menuCard")?.querySelector("img");
    if (!img) return;

    const imgRect = img.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    const flyingImg = img.cloneNode(true);
    flyingImg.style.position = "fixed";
    flyingImg.style.left = imgRect.left + "px";
    flyingImg.style.top = imgRect.top + "px";
    flyingImg.style.width = imgRect.width + "px";
    flyingImg.style.height = imgRect.height + "px";
    flyingImg.style.borderRadius = "12px";
    flyingImg.style.zIndex = "2000";
    flyingImg.style.pointerEvents = "none";
    flyingImg.style.transition =
      "transform 1s cubic-bezier(0.25, 1, 0.5, 1), opacity 1s ease-in-out";

    document.body.appendChild(flyingImg);

    const startX = imgRect.left;
    const startY = imgRect.top;
    const endX = cartRect.left;
    const endY = cartRect.top;
    const midX = (startX + endX) / 2;
    const midY = Math.min(startY, endY) - 150;

    let startTime;
    function animate(time) {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / 1000, 1);
      const x =
        (1 - progress) * (1 - progress) * startX +
        2 * (1 - progress) * progress * midX +
        progress * progress * endX;
      const y =
        (1 - progress) * (1 - progress) * startY +
        2 * (1 - progress) * progress * midY +
        progress * progress * endY;
      flyingImg.style.transform = `translate(${x - startX}px, ${
        y - startY
      }px) scale(${1 - 0.7 * progress}) rotate(${progress * 360}deg)`;
      flyingImg.style.opacity = `${1 - progress}`;
      if (progress < 1) requestAnimationFrame(animate);
      else {
        flyingImg.remove();
        cartIcon.animate(
          [
            { transform: "scale(1)" },
            { transform: "scale(1.3)" },
            { transform: "scale(1)" },
          ],
          { duration: 400, easing: "ease-out" }
        );
      }
    }
    requestAnimationFrame(animate);
  };

  const renderSection = (data, title, id, icon) => (
    <div id={id} style={{ marginBottom: "80px" }}>
      <h2 style={styles.sectionTitle}>
        {icon} {title}
      </h2>
      <div style={styles.menuGrid}>
        {data.length > 0 ? (
          data.map((p) => (
            <div key={p._id} className="menuCard" style={styles.menuCard}>
              <img
                src={
                  p.FileName
                    ? `http://localhost:9600/Content/Product/${p.FileName}`
                    : "https://via.placeholder.com/300x200?text=No+Image"
                }
                alt={p.ProductName}
                style={styles.menuImage}
              />
              <div style={styles.menuInfo}>
                <h3 style={styles.menuName}>{p.ProductName}</h3>
                <p style={styles.menuDesc}>{p.Description}</p>
                <div style={styles.menuFooter}>
                  <span style={styles.price}>₹{p.Price}</span>
                  <button
                    style={styles.orderBtn}
                    onClick={(e) => addToCart(p, e)}
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#777" }}>
            No items found in this category
          </p>
        )}
      </div>
    </div>
  );

  return (
    <section style={styles.menuSection}>
      {message && <div style={styles.popup}>{message}</div>}

      {/* ✅ INTRO SCREEN */}
      {showIntro && (
        <div
          className="introOverlay"
          style={{
            ...styles.overlayIntro,
            background: "linear-gradient(135deg, #fff8f0 0%, #ffe8d6 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div style={styles.overlayContent}>
            <div
              style={{
                fontSize: "3rem",
                marginBottom: "15px",
                animation: "popIn 1s ease-in-out",
              }}
            >
              🍽️
            </div>
            <h1
              style={{
                fontSize: "2.5rem",
                color: "#222",
                marginBottom: "10px",
                animation: "fadeSlide 1.2s ease-in-out",
              }}
            >
              Choose Your Favorite Dish
            </h1>
            <p
              style={{
                fontSize: "1.2rem",
                color: "#555",
                animation: "fadeSlide 1.5s ease-in-out",
              }}
            >
              Fresh, Delicious & Made with Love ❤️
            </p>
          </div>
        </div>
      )}

      {/* ✅ CATEGORY TAB BUTTONS */}
      {showMenu && (
        <div style={styles.tabContainer}>
          <button
            onClick={() => scrollToSection("vegPizza")}
            style={{
              ...styles.tabButton,
              background:
                activeTab === "vegPizza"
                  ? "linear-gradient(90deg,#4caf50,#2e7d32)"
                  : "#ddd",
              color: activeTab === "vegPizza" ? "white" : "#333",
            }}
          >
            🍕 Veg Pizza's
          </button>

          <button
            onClick={() => scrollToSection("nonVegPizza")}
            style={{
              ...styles.tabButton,
              background:
                activeTab === "nonVegPizza"
                  ? "linear-gradient(90deg,#ff3d00,#d50000)"
                  : "#ddd",
              color: activeTab === "nonVegPizza" ? "white" : "#333",
            }}
          >
            🍕 Non-Veg Pizza's
          </button>

          <button
            onClick={() => scrollToSection("vegBurger")}
            style={{
              ...styles.tabButton,
              background:
                activeTab === "vegBurger"
                  ? "linear-gradient(90deg,#009688,#00695c)"
                  : "#ddd",
              color: activeTab === "vegBurger" ? "white" : "#333",
            }}
          >
            🍔 Veg Burgers
          </button>

          <button
            onClick={() => scrollToSection("nonVegBurger")}
            style={{
              ...styles.tabButton,
              background:
                activeTab === "nonVegBurger"
                  ? "linear-gradient(90deg,#c62828,#8e0000)"
                  : "#ddd",
              color: activeTab === "nonVegBurger" ? "white" : "#333",
            }}
          >
            🍔 Non-Veg Burgers
          </button>
        </div>
      )}

      {/* ✅ MENU SECTIONS */}
      <div style={{ ...styles.menuContainer, opacity: showMenu ? 1 : 0 }}>
        {loading ? (
          <div style={styles.loader}>
            <div style={styles.spinner}></div>
            <p>Loading menu...</p>
          </div>
        ) : (
          <>
            {renderSection(vegPizzas, "Veg Pizzas", "vegPizza", "🥦")}
            {renderSection(nonVegPizzas, "Non-Veg Pizzas", "nonVegPizza", "🍗")}
            {renderSection(vegBurgers, "Veg Burgers", "vegBurger", "🍔")}
            {renderSection(nonVegBurgers, "Non-Veg Burgers", "nonVegBurger", "🍔")}
          </>
        )}
      </div>
    </section>
  );
}

// ✅ SAME STYLES (unchanged)
const styles = {
  menuSection: {
    backgroundColor: "#fff8f0",
    minHeight: "100vh",
    padding: "60px 80px",
    fontFamily: "'Poppins', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  overlayIntro: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    animation: "fadeIn 0.8s ease-in-out",
  },
  overlayContent: { textAlign: "center", color: "#222" },
  tabContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "40px",
  },
  tabButton: {
    padding: "10px 22px",
    borderRadius: "30px",
    border: "none",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontWeight: "600",
  },
  sectionTitle: {
    textAlign: "center",
    color: "#ff5200",
    fontSize: "2rem",
    marginBottom: "30px",
    fontWeight: "700",
  },
  menuGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "30px",
  },
  menuCard: {
    background: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
    transition: "transform 0.28s ease, box-shadow 0.28s ease",
    display: "flex",
    flexDirection: "column",
  },
  menuImage: { width: "100%", height: "200px", objectFit: "cover" },
  menuInfo: { padding: "18px", textAlign: "center" },
  menuName: { color: "#222", fontSize: "1.2rem", marginBottom: "8px" },
  menuDesc: { color: "#555", fontSize: "0.9rem", marginBottom: "14px" },
  menuFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: { fontWeight: "700", color: "#ff5200", fontSize: "1.05rem" },
  orderBtn: {
    background: "linear-gradient(90deg, #ff7a00, #ff5200)",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "20px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
};

// ✅ Animations (unchanged)
(function appendStyles() {
  const css = `
@keyframes fadeIn {from {opacity: 0;} to {opacity: 1;}}
@keyframes fadeOut {from {opacity:1;} to {opacity:0; visibility:hidden;}}
@keyframes popIn {0%{transform:scale(0);}80%{transform:scale(1.1);}100%{transform:scale(1);}}
@keyframes fadeSlide {0%{opacity:0; transform:translateY(20px);}100%{opacity:1; transform:translateY(0);}}
.introOverlay.fadeOut {animation: fadeOut 1s ease forwards;}
`;
  if (!document.getElementById("menu-animations")) {
    const s = document.createElement("style");
    s.id = "menu-animations";
    s.textContent = css;
    document.head.appendChild(s);
  }
})();
