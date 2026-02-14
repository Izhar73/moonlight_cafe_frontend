import React, { useEffect, useState } from "react";
import { getMethod, putMethod } from "../APIService";

export default function AdminCart() {
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getMethod("order/list");
      setOrderList(Array.isArray(res.Result) ? res.Result : []);
    } catch (err) {
      console.error("Fetch orders error:", err);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const res = await putMethod(`order/update-status/${orderId}`, {
        Status: status,
      });

      if (res.Status === "OK") {
        setOrderList((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, Status: status } : o
          )
        );
      }
    } catch (err) {
      console.error("Update status error:", err);
      alert("Failed to update status");
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleString();
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
              <th>ID</th>
              <th>Customer</th>
              <th>Address</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orderList.map((o) => (
              <tr key={o._id}>
                <td>{o._id}</td>
                <td>
                  {o.DeliveryInfo?.name || "—"} <br />
                  {o.DeliveryInfo?.phone || "—"}
                </td>
                <td>{o.DeliveryInfo?.address || "—"}</td>
                <td>₹{o.Total}</td>
                <td>{o.PaymentMethod}</td>
                <td>{formatDate(o.OrderDate)}</td>
                <td>
                  <select
                    value={o.Status}
                    onChange={(e) =>
                      updateStatus(o._id, e.target.value)
                    }
                  >
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
