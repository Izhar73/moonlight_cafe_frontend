import React, { useEffect, useState } from "react";
import { getMethod, deleteMethod } from "../APIService";

export default function AdminFeedback() {
  const [feedbackList, setFeedbackList] = useState([]);

  const loadFeedback = async () => {
    try {
      const res = await getMethod("Feedback/list");
      setFeedbackList(res.Result);
    } catch (error) {
      console.log("Error fetching feedback:", error);
    }
  };

  const deleteFeedback = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;

    try {
      await deleteMethod(`Feedback/delete/${id}`);
      loadFeedback();
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📬 Customer Feedback ({feedbackList.length})</h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <thead style={{ background: "#ff5722", color: "white" }}>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Customer Name</th>
            <th style={thStyle}>Message</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {feedbackList.map((item) => (
            <tr key={item._id}>
              <td style={tdStyle}>{item._id}</td>

              {/* ✅ Show customer name instead of ID */}
             <td style={tdStyle}>
                {item.UserData?.FullName || "Unknown"}
                </td>


              <td style={tdStyle}>{item.Message}</td>
              <td style={tdStyle}>
                {new Date(item.created_at).toLocaleString()}
              </td>

              <td style={tdStyle}>
                <button
                  onClick={() => deleteFeedback(item._id)}
                  style={{ ...btnSmall, background: "#e53935" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {feedbackList.length === 0 && (
            <tr>
              <td colSpan="5" style={{ padding: "20px", textAlign: "center" }}>
                No feedback found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  padding: "12px",
  textAlign: "left",
  fontWeight: "600",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
};

const btnSmall = {
  padding: "6px 12px",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.9rem",
};
