import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

// Firebase imports
import { db, serverTimestamp } from "../firebase_config";
import { collection, getDocs, query, where, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: "",
    phone: "",
    address: "",
    landmark: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");

  // Fetch Cart
  useEffect(() => {
    const fetchCart = async () => {
      const RegisterationId = localStorage.getItem("RegisterationId");
      if (!RegisterationId) return;

      try {
        const cartRef = collection(db, "Cart_Master");
        const q = query(cartRef, where("RegisterationId", "==", RegisterationId));
        const snapshot = await getDocs(q);

        const cartItems = [];
        for (const docSnap of snapshot.docs) {
          let item = docSnap.data();
          item._id = docSnap.id;

          // Fetch product details
          const productRef = doc(db, "Product_Master", item.ProductId);
          const productSnap = await getDocs(productRef); // Note: getDoc for single doc
          if (productSnap.exists()) {
            const product = productSnap.data();
            item.ProductName = product.ProductName || item.ProductName;
            item.FileName = product.FileName || item.FileName;
          }

          cartItems.push(item);
        }

        setCart(cartItems);
        updateNavbarBadge(cartItems);
      } catch (err) {
        console.error("Cart Fetch Error:", err);
        toast.error("Failed to load cart");
      }
    };

    fetchCart();
  }, []);

  const updateNavbarBadge = (cartArray) => {
    const totalQty = cartArray.reduce((sum, i) => sum + (i.Quantity || 1), 0);
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { count: totalQty } }));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.Total, 0);

  const handleInputChange = (e) =>
    setDeliveryInfo({ ...deliveryInfo, [e.target.name]: e.target.value });

  // Update Quantity
  const updateQty = async (id, currentQty, change) => {
    const newQty = Math.max(1, currentQty + change);
    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, Quantity: newQty, Total: item.Price * newQty } : item
    );
    setCart(updatedCart);
    updateNavbarBadge(updatedCart);

    try {
      const cartDoc = doc(db, "Cart_Master", id);
      await updateDoc(cartDoc, { Quantity: newQty, Total: newQty * (cart.find(i => i._id === id).Price) });
    } catch (err) {
      console.error("Update Cart Error:", err);
      toast.error("Failed to update cart");
    }
  };

  // Remove Item
  const removeFromCart = async (id) => {
    setCart(cart.filter((item) => item._id !== id));
    updateNavbarBadge(cart.filter((item) => item._id !== id));

    try {
      const cartDoc = doc(db, "Cart_Master", id);
      await deleteDoc(cartDoc);
      toast.success("Item removed successfully");
    } catch (err) {
      console.error("Delete Cart Error:", err);
      toast.error("Failed to remove item");
    }
  };

  // Place Order
  const placeOrder = async () => {
    const { name, phone, address, landmark, pincode } = deliveryInfo;
    const RegisterationId = localStorage.getItem("RegisterationId");

    if (!name || !phone || !address || !pincode) {
      toast.error("Please fill delivery details");
      return;
    }

    const orderData = {
      RegisterationId,
      PaymentMethod: paymentMethod,
      DeliveryInfo: { name, phone, address: `${address}, ${landmark}, ${pincode}` },
      OrderItems: cart.map((item) => ({
        ProductId: item.ProductId,
        ProductName: item.ProductName,
        FileName: item.FileName,
        Quantity: item.Quantity,
        Price: item.Price,
        Total: item.Total,
      })),
      Total: totalPrice,
      Status: "Pending",
      OrderDate: serverTimestamp(),
    };

    try {
      const ordersRef = collection(db, "Orders");
      await addDoc(ordersRef, orderData);

      // Clear cart
      for (const item of cart) {
        const cartDoc = doc(db, "Cart_Master", item._id);
        await deleteDoc(cartDoc);
      }

      setCart([]);
      updateNavbarBadge([]);
      toast.success(`Order placed! Total ₹${totalPrice}`);
    } catch (err) {
      console.error("Order Error:", err);
      toast.error("Failed to place order");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "30px auto", padding: "20px" }}>
      <Toaster position="top-right" />
      <h2>🛒 Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item._id} style={{ display: "flex", marginBottom: "15px" }}>
              <img
                src={item.FileName || "https://via.placeholder.com/80"}
                alt={item.ProductName}
                style={{ width: "80px", height: "80px", marginRight: "10px" }}
              />
              <div>
                <h4>{item.ProductName}</h4>
                <p>Price: ₹{item.Price}</p>
                <div>
                  <button onClick={() => updateQty(item._id, item.Quantity, -1)}>−</button>
                  <span style={{ margin: "0 10px" }}>{item.Quantity}</span>
                  <button onClick={() => updateQty(item._id, item.Quantity, 1)}>+</button>
                </div>
                <p>Total: ₹{item.Total}</p>
              </div>
              <button onClick={() => removeFromCart(item._id)}>🗑️</button>
            </div>
          ))}

          <h3>Total: ₹{totalPrice}</h3>

          <div>
            <h3>Delivery Info</h3>
            {["name","phone","address","landmark","pincode"].map(f => (
              <input key={f} name={f} placeholder={f} onChange={handleInputChange} />
            ))}
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="COD">Cash On Delivery</option>
              <option value="Online">Online Payment</option>
            </select>

            <button onClick={placeOrder}>Place Order</button>
          </div>
        </>
      )}
    </div>
  );
}

// 🎨 Styles
const styles = {
  page: { maxWidth: 900, margin: "30px auto", padding: 20, fontFamily: "'Poppins', sans-serif" },
  title: { textAlign: "center", fontSize: "2rem", color: "#ff5200", marginBottom: 20 },
  empty: { textAlign: "center", color: "gray" },
  cartItem: { display: "flex", alignItems: "center", marginBottom: 15, background: "#fff", padding: 10, borderRadius: 10, boxShadow: "0 3px 8px rgba(0,0,0,0.1)" },
  itemImage: { width: 80, height: 80, borderRadius: 8, objectFit: "cover", marginRight: 10 },
  itemInfo: { flex: 1 },
  qtyWrapper: { display: "flex", alignItems: "center", margin: "5px 0" },
  removeBtn: { background: "#ff4d4f", color: "#fff", border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer" },
  deliveryForm: { marginTop: 20, display: "flex", flexDirection: "column", gap: 10 },
  input: { padding: 8, borderRadius: 6, border: "1px solid #ccc" },
  select: { padding: 8, borderRadius: 6, border: "1px solid #ccc" },
  placeOrderBtn: { marginTop: 10, padding: 10, background: "#ff5200", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
};
