import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  getMethod,
  postMethod,
  putMethod,
  deleteMethod,
} from "../APIService";

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

  const RegisterationId = localStorage.getItem("RegisterationId");

  // 🔹 Fetch Cart
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    if (!RegisterationId) return;

    try {
      const res = await getMethod(`cart/list/${RegisterationId}`);

      if (res.Status === "OK") {
        setCart(Array.isArray(res.Result) ? res.Result : []);
        updateNavbarBadge(res.Result);
      }
    } catch (err) {
      console.error("Cart fetch error:", err);
      toast.error("Failed to load cart");
    }
  };

  const updateNavbarBadge = (cartArray) => {
    const totalQty = cartArray.reduce(
      (sum, i) => sum + (i.Quantity || 1),
      0
    );
    window.dispatchEvent(
      new CustomEvent("cartUpdated", {
        detail: { count: totalQty },
      })
    );
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + Number(item.Total || 0),
    0
  );

  const handleInputChange = (e) =>
    setDeliveryInfo({ ...deliveryInfo, [e.target.name]: e.target.value });

  // 🔹 Update Quantity
  const updateQty = async (id, currentQty, change) => {
    const newQty = Math.max(1, currentQty + change);

    try {
      const res = await putMethod(`cart/update/${id}`, {
        Quantity: newQty,
      });

      if (res.Status === "OK") {
        const updated = cart.map((item) =>
          item._id === id
            ? {
                ...item,
                Quantity: newQty,
                Total: item.Price * newQty,
              }
            : item
        );

        setCart(updated);
        updateNavbarBadge(updated);
      }
    } catch (err) {
      console.error("Update cart error:", err);
      toast.error("Failed to update cart");
    }
  };

  // 🔹 Remove Item
  const removeFromCart = async (id) => {
    try {
      const res = await deleteMethod(`cart/delete/${id}`);

      if (res.Status === "OK") {
        const updated = cart.filter((item) => item._id !== id);
        setCart(updated);
        updateNavbarBadge(updated);
        toast.success("Item removed successfully");
      }
    } catch (err) {
      console.error("Delete cart error:", err);
      toast.error("Failed to remove item");
    }
  };

  // 🔹 Place Order
  const placeOrder = async () => {
    const { name, phone, address, landmark, pincode } = deliveryInfo;

    if (!name || !phone || !address || !pincode) {
      toast.error("Please fill delivery details");
      return;
    }

    const orderData = {
      RegisterationId,
      PaymentMethod: paymentMethod,
      DeliveryInfo: {
        name,
        phone,
        address: `${address}, ${landmark}, ${pincode}`,
      },
      OrderItems: cart.map((item) => ({
        ProductId: item.ProductId,
        ProductName: item.ProductName,
        FileName: item.FileName,
        Quantity: item.Quantity,
        Price: item.Price,
        Total: item.Total,
      })),
      Total: totalPrice,
    };

    try {
      const res = await postMethod("order/save", orderData);

      if (res.Status === "OK") {
        setCart([]);
        updateNavbarBadge([]);
        toast.success(`Order placed! Total ₹${totalPrice}`);
      } else {
        toast.error("Order failed");
      }
    } catch (err) {
      console.error("Order error:", err);
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
            <div
              key={item._id}
              style={{ display: "flex", marginBottom: "15px" }}
            >
              <img
                src={item.FileName || "https://via.placeholder.com/80"}
                alt={item.ProductName}
                style={{
                  width: "80px",
                  height: "80px",
                  marginRight: "10px",
                }}
              />
              <div>
                <h4>{item.ProductName}</h4>
                <p>Price: ₹{item.Price}</p>

                <div>
                  <button
                    onClick={() =>
                      updateQty(item._id, item.Quantity, -1)
                    }
                  >
                    −
                  </button>

                  <span style={{ margin: "0 10px" }}>
                    {item.Quantity}
                  </span>

                  <button
                    onClick={() =>
                      updateQty(item._id, item.Quantity, 1)
                    }
                  >
                    +
                  </button>
                </div>

                <p>Total: ₹{item.Total}</p>
              </div>

              <button onClick={() => removeFromCart(item._id)}>
                🗑️
              </button>
            </div>
          ))}

          <h3>Total: ₹{totalPrice}</h3>

          <div>
            <h3>Delivery Info</h3>

            {["name", "phone", "address", "landmark", "pincode"].map(
              (f) => (
                <input
                  key={f}
                  name={f}
                  placeholder={f}
                  value={deliveryInfo[f]}
                  onChange={handleInputChange}
                />
              )
            )}

            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
            >
              <option value="COD">
                Cash On Delivery
              </option>
              <option value="Online">
                Online Payment
              </option>
            </select>

            <button onClick={placeOrder}>
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}
