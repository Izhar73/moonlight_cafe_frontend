import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:9600/Registeration/list");
      setUsers(res.data.Result || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "#f5f5f5",
        minHeight: "90vh",
      }}
    >
      <h2
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "25px",
          color: "#222",
        }}
      >
        Users List
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "white",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#ff6600", color: "white" }}>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Full Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Contact No</th>
            <th style={thStyle}>Address</th>
            <th style={thStyle}>User Name</th>
            <th style={thStyle}>Created Date</th>
          </tr>
        </thead>

        <tbody>
          {users.length > 0 ? (
            users.map((u, i) => (
              <tr key={u._id} style={rowStyle}>
                <td style={tdStyle}>{i + 1}</td>
                <td style={tdStyle}>{u.FullName}</td>
                <td style={tdStyle}>{u.Email}</td>
                <td style={tdStyle}>{u.ContactNo}</td>
                <td style={tdStyle}>{u.Address}</td>
                <td style={tdStyle}>{u.UserName}</td>
                <td style={tdStyle}>
                  {u.created_at
                    ? new Date(u.created_at).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                No Users Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  padding: "12px 10px",
  fontWeight: "600",
  fontSize: "14px",
  textAlign: "left",
};

const tdStyle = {
  padding: "10px",
  fontSize: "14px",
  color: "#333",
};

const rowStyle = {
  borderBottom: "1px solid #ddd",
};
