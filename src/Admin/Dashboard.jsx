import React, { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase_config";

export default function Dashboard() {
  const [stats, setStats] = useState({
    productsCount: 0,
    categoriesCount: 0,
    ordersCount: 0,
    totalRevenue: 0,
    todayRevenue: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const productsSnap = await getDocs(collection(db, "Product_Master"));
      const categoriesSnap = await getDocs(collection(db, "Category_Master"));
      const ordersSnap = await getDocs(collection(db, "Order_Master"));

      const orders = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const totalRevenue = orders.reduce((sum, o) => sum + Number(o.Total || 0), 0);

      const today = new Date().toISOString().slice(0, 10);
      const todayRevenue = orders
        .filter(o => o.OrderDate && new Date(o.OrderDate.seconds * 1000).toISOString().slice(0, 10) === today)
        .reduce((sum, o) => sum + Number(o.Total || 0), 0);

      setStats({
        productsCount: productsSnap.size,
        categoriesCount: categoriesSnap.size,
        ordersCount: ordersSnap.size,
        totalRevenue,
        todayRevenue,
      });
    } catch (err) {
      console.error("Firebase Dashboard error:", err);
    }
  };

  return (
    <div className="dashboard container py-4">
      <h2 className="text-center fw-bold mb-4">📊 Admin Dashboard</h2>
      <div className="row g-4 text-center">
        <div className="col-md-4 col-lg-2 mx-auto">
          <div className="card shadow-sm p-3 border-0 rounded-4">
            <h5>🛒 Products</h5>
            <h3 className="text-primary fw-bold">{stats.productsCount}</h3>
          </div>
        </div>

        <div className="col-md-4 col-lg-2 mx-auto">
          <div className="card shadow-sm p-3 border-0 rounded-4">
            <h5>📂 Categories</h5>
            <h3 className="text-success fw-bold">{stats.categoriesCount}</h3>
          </div>
        </div>

        <div className="col-md-4 col-lg-2 mx-auto">
          <div className="card shadow-sm p-3 border-0 rounded-4">
            <h5>🧾 Orders</h5>
            <h3 className="text-warning fw-bold">{stats.ordersCount}</h3>
          </div>
        </div>

        <div className="col-md-4 col-lg-2 mx-auto">
          <div className="card shadow-sm p-3 border-0 rounded-4">
            <h5>💰 Total Revenue</h5>
            <h3 className="text-danger fw-bold">₹{stats.totalRevenue.toFixed(2)}</h3>
          </div>
        </div>

        <div className="col-md-4 col-lg-2 mx-auto">
          <div className="card shadow-sm p-3 border-0 rounded-4">
            <h5>📅 Today’s Revenue</h5>
            <h3 className="text-info fw-bold">₹{stats.todayRevenue.toFixed(2)}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
