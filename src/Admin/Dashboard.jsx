import React, { useEffect, useState } from "react";
import { getMethod } from "../APIService";

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
      const res = await getMethod("dashboard/stats");

      if (res.Status === "OK") {
        setStats(res.Result);
      }
    } catch (err) {
      console.error("Dashboard error:", err);
    }
  };

  return (
    <div className="dashboard container py-4">
      <h2 className="text-center fw-bold mb-4">
        📊 Admin Dashboard
      </h2>

      <div className="row g-4 text-center">
        <div className="col-md-4 col-lg-2 mx-auto">
          <div className="card shadow-sm p-3 border-0 rounded-4">
            <h5>🛒 Products</h5>
            <h3 className="text-primary fw-bold">
              {stats.productsCount}
            </h3>
          </div>
        </div>

        <div className="col-md-4 col-lg-2 mx-auto">
          <div className="card shadow-sm p-3 border-0 rounded-4">
            <h5>📂 Categories</h5>
            <h3 className="text-success fw-bold">
              {stats.categoriesCount}
            </h3>
          </div>
        </div>

        <div className="col-md-4 col-lg-2 mx-auto">
          <div className="card shadow-sm p-3 border-0 rounded-4">
            <h5>🧾 Orders</h5>
            <h3 className="text-warning fw-bold">
              {stats.ordersCount}
            </h3>
          </div>
        </div>

        <div className="col-md-4 col-lg-2 mx-auto">
          <div className="card shadow-sm p-3 border-0 rounded-4">
            <h5>💰 Total Revenue</h5>
            <h3 className="text-danger fw-bold">
              ₹{Number(stats.totalRevenue).toFixed(2)}
            </h3>
          </div>
        </div>

        <div className="col-md-4 col-lg-2 mx-auto">
          <div className="card shadow-sm p-3 border-0 rounded-4">
            <h5>📅 Today’s Revenue</h5>
            <h3 className="text-info fw-bold">
              ₹{Number(stats.todayRevenue).toFixed(2)}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
