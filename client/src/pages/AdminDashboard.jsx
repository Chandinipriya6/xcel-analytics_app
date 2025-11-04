import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { FaUsers, FaToggleOn, FaToggleOff } from "react-icons/fa";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch users
  useEffect(() => {
    fetch("http://localhost:5000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
        else if (Array.isArray(data.users)) setUsers(data.users);
        else setUsers([]);
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, [token]);

  // Toggle status
  const toggleStatus = (id) => {
    fetch(`http://localhost:5000/api/admin/users/${id}/toggle`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === id ? { ...user, status: data.status } : user
          )
        );
      })
      .catch((err) => console.error("Error toggling status:", err));
  };

  // Filter users
  const filteredUsers = users.filter((u) =>
    (u?.username || "").toLowerCase().includes(search.toLowerCase())
  );

  // Stats
  const activeUsers = users.filter((u) => u.status === "active").length;
  const inactiveUsers = users.length - activeUsers;

  const pieData = [
    { name: "Active Users", value: activeUsers },
    { name: "Inactive Users", value: inactiveUsers },
  ];
  const COLORS = ["#2ecc71", "#e74c3c"];

  // Fake login activity data for bar chart
  const loginData = [
    { date: "Mon", logins: 15 },
    { date: "Tue", logins: 22 },
    { date: "Wed", logins: 10 },
    { date: "Thu", logins: 30 },
    { date: "Fri", logins: 25 },
    { date: "Sat", logins: 18 },
    { date: "Sun", logins: 12 },
  ];

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2 className="admin-sidebar-title">Admin Panel</h2>
        <div className="admin-sidebar-actions">
          <button
            onClick={() => setActiveTab("dashboard")}
            className="admin-btn-profile"
          >
            🏠 Dashboard
          </button>
          <button
            onClick={() => setActiveTab("details")}
            className="admin-btn-profile"
          >
            📊 Details
          </button>
          <button
            className="admin-btn-profile"
            onClick={() => navigate("/profile")}
          >
            👤 Profile
          </button>
          <button className="admin-btn-logout">Logout</button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="admin-main">
        <div className="admin-topbar">
          <h2 className="admin-topbar-title">
            {activeTab === "dashboard" ? "Dashboard" : "Details"}
          </h2>
        </div>

        <div className="admin-content">
          {/* 🔹 Stats Always Visible */}
          <div className="stats-grid">
            <div className="stat-card">
              <FaUsers className="stat-icon" />
              <h3>{users.length}</h3>
              <p>Total Users</p>
            </div>
            <div className="stat-card">
              <FaToggleOn className="stat-icon green" />
              <h3>{activeUsers}</h3>
              <p>Active Users</p>
            </div>
            <div className="stat-card">
              <FaToggleOff className="stat-icon red" />
              <h3>{inactiveUsers}</h3>
              <p>Inactive Users</p>
            </div>
          </div>

          {/* 🔹 Dashboard view → Table + Search */}
          {activeTab === "dashboard" && (
            <>
              <input
                type="text"
                placeholder="Search Users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="admin-search-input"
              />
              <table className="admin-user-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Joined</th>
                    <th>Last Login</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.username || "Unknown"}</td>
                      <td>{user.email || "N/A"}</td>
                      <td>
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td>
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleString()
                          : "N/A"}
                      </td>
                      <td>
                        <button
                          onClick={() => toggleStatus(user._id)}
                          className={
                            user.status === "active"
                              ? "admin-btn-active"
                              : "admin-btn-inactive"
                          }
                        >
                          {user.status === "active" ? "Active" : "Inactive"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* 🔹 Details view → Graphs only */}
          {activeTab === "details" && (
            <>
              <div className="chart-box">
                <h2>Weekly Login Activity</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={loginData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="logins" fill="#0077b6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-box">
                <h2>User Status Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={110}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
