import React, { useEffect, useState } from "react";
import { db } from "../firebase_config";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";

export default function AdminCart() {
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersRef = collection(db, "Orders");
      const q = query(ordersRef, orderBy("OrderDate", "desc"));
      const snapshot = await getDocs(q);
      const orders = snapshot.docs.map(docSnap => ({ _id: docSnap.id, ...docSnap.data() }));
      setOrderList(orders);
    };
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const orderDoc = doc(db, "Orders", orderId);
      await updateDoc(orderDoc, { Status: status });
      setOrderList(prev => prev.map(o => o._id === orderId ? { ...o, Status: status } : o));
    } catch (err) {
      console.error("Update status error:", err);
      alert("Failed to update status");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "—";
    if (timestamp.seconds) return new Date(timestamp.seconds * 1000).toLocaleString();
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>📦 All Orders</h1>
      {orderList.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table border={1} cellPadding={5} cellSpacing={0}>
          <thead>
            <tr>
              <th>ID</th><th>Customer</th><th>Address</th><th>Total</th><th>Payment</th><th>Date</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orderList.map(o => (
              <tr key={o._id}>
                <td>{o._id}</td>
                <td>{o.DeliveryInfo?.name || "—"}<br/>{o.DeliveryInfo?.phone || "—"}</td>
                <td>{o.DeliveryInfo?.address || "—"}</td>
                <td>₹{o.Total}</td>
                <td>{o.PaymentMethod}</td>
                <td>{formatDate(o.OrderDate)}</td>
                <td>
                  <select value={o.Status} onChange={e => updateStatus(o._id, e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


// 🎨 Styles
const styles = {
  page: { padding: "30px", fontFamily: "'Poppins', sans-serif", minHeight: "100vh", background: "#f8f8f8" },
  title: { textAlign: "center", fontSize: "2rem", color: "#ff5200", marginBottom: "20px" },
  empty: { textAlign: "center", color: "gray" },
  tableWrapper: { overflowX: "auto", borderRadius: 10, boxShadow: "0 3px 10px rgba(0,0,0,0.1)" },
  table: { width: "100%", borderCollapse: "collapse", background: "#fff", minWidth: 800 },
  headerRow: { background: "#ff5200", color: "#fff", textTransform: "uppercase" },
  row: { textAlign: "center", borderBottom: "1px solid #eee" },
  cellCustomer: { textAlign: "left", padding: "10px", lineHeight: 1.4 },
  customerName: { fontWeight: 600, color: "#333" },
  customerPhone: { fontSize: "13px", color: "#666" },
  cellAddress: { textAlign: "left", padding: "10px", maxWidth: 250, whiteSpace: "normal", wordWrap: "break-word", color: "#444" },
  statusDropdown: { padding: 6, borderRadius: 6, border: "1px solid #ccc", outline: "none", fontWeight: 600, cursor: "pointer", background: "#fff" },
};
