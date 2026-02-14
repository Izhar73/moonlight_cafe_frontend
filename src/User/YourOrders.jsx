import React, { useEffect, useState } from "react";
import { getMethod } from "../APIService";

export default function YourOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("RegisterationId");
    if (!userId) return;

    getMethod(`order/list/${userId}`)
      .then((res) => {
        if (res.Status === "OK" && Array.isArray(res.Result)) {
          setOrders(res.Result);
        } else {
          setOrders([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setOrders([]);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateObj) => {
    if (!dateObj) return "—";
    if (dateObj.seconds) dateObj = new Date(dateObj.seconds * 1000);
    return new Date(dateObj).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading)
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>📦 Your Orders</h2>
        <p>Loading...</p>
      </div>
    );

  if (orders.length === 0)
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>📦 Your Orders</h2>
        <p style={styles.noOrder}>You haven’t placed any orders yet.</p>
      </div>
    );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📦 Your Orders</h2>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Items</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Payment</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Ordered On</th>
              <th style={styles.th}>Delivery Info</th>
              <th style={styles.th}>Message</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td style={styles.tdItems}>
                  {order.OrderItems?.map((item, i) => (
                    <div key={i} style={styles.item}>
                      <img
                        src={
                          item.FileName
                            ? `http://localhost:9600/Content/Product/${item.FileName}`
                            : "https://via.placeholder.com/60?text=No+Image"
                        }
                        alt={item.ProductName || "Product"}
                        style={styles.image}
                        onError={(e) =>
                          (e.target.src =
                            "https://via.placeholder.com/60?text=No+Image")
                        }
                      />
                      <div>
                        <p style={styles.itemName}>{item.ProductName}</p>
                        <p style={styles.itemQty}>
                          {item.Quantity} × ₹{item.Price}
                        </p>
                      </div>
                    </div>
                  ))}
                </td>
                <td style={styles.tdCenter}>₹{order.Total ?? 0}</td>
                <td style={styles.tdCenter}>{order.PaymentMethod || "—"}</td>
                <td style={styles.tdCenter}>
                  <span style={getStatusStyle(order.Status)}>{order.Status}</span>
                </td>
                <td style={styles.tdCenter}>{formatDate(order.OrderDate)}</td>
                <td style={styles.tdDelivery}>
                  {order.DeliveryInfo?.address
                    ? `${order.DeliveryInfo.address}, ${order.DeliveryInfo?.pincode || ""}`
                    : "No Address"}
                </td>
                <td style={styles.tdCenter}>
                  {order.Status === "Pending" && "🕒 Waiting for confirmation"}
                  {order.Status === "Shipped" && "🚚 On the way!"}
                  {order.Status === "Delivered" && "✅ Delivered successfully!"}
                  {order.Status === "Cancelled" && "❌ Order Cancelled"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


// 🌈 Styling
const styles = {
  container: {
    padding: "40px 60px",
    background: "#fff7f3",
    minHeight: "85vh",
  },
  title: {
    color: "#ff5722",
    textAlign: "center",
    fontSize: "2.2rem",
    fontWeight: "700",
    marginBottom: "30px",
  },
  noOrder: { textAlign: "center", color: "#777", fontSize: "1.1rem" },
  tableWrapper: {
    overflowX: "auto",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed", // ✅ keeps column widths aligned
  },
  th: {
    background: "#ff7043",
    color: "#fff",
    padding: "14px 10px",
    textAlign: "center",
    fontWeight: "600",
    fontSize: "1rem",
  },
  tr: {
    borderBottom: "1px solid #f0f0f0",
  },
  tdItems: {
    padding: "12px",
    minWidth: "240px",
    verticalAlign: "top",
  },
  tdDelivery: {
    padding: "12px",
    minWidth: "180px",
  },
  tdCenter: {
    textAlign: "center",
    padding: "12px",
    verticalAlign: "middle",
    minWidth: "100px",
  },
  itemsList: { display: "flex", flexDirection: "column", gap: "6px" },
  item: {
    display: "flex",
    alignItems: "center",
    background: "#fff4f0",
    padding: "6px 10px",
    borderRadius: "8px",
  },
  image: {
    width: "55px",
    height: "55px",
    objectFit: "cover",
    marginRight: "10px",
    borderRadius: "8px",
  },
  itemName: { fontWeight: "600" },
  itemQty: { fontSize: "0.9rem", color: "#555" },
  addressText: { color: "#333", fontSize: "0.95rem" },
  pinText: { color: "#666", fontSize: "0.85rem" },
  pendingMsg: { color: "#ff9800", fontWeight: "600" },
  shippedMsg: { color: "#0288d1", fontWeight: "600" },
  deliveredMsg: { color: "#2e7d32", fontWeight: "600" },
  cancelledMsg: { color: "#c62828", fontWeight: "600" },
};
// Paste your styles here (same as your original YourOrders styles)
function getStatusStyle(status) {
  const base = {
    fontWeight: "700",
    padding: "5px 10px",
    borderRadius: "10px",
    textTransform: "capitalize",
  };
  switch (status) {
    case "Pending":
      return { ...base, background: "#fff3e0", color: "#ef6c00" };
    case "Shipped":
      return { ...base, background: "#e1f5fe", color: "#0288d1" };
    case "Delivered":
      return { ...base, background: "#e8f5e9", color: "#2e7d32" };
    case "Cancelled":
      return { ...base, background: "#ffebee", color: "#c62828" };
    default:
      return { ...base, background: "#f5f5f5", color: "#555" };
  }
}