import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FaUsers, FaUserShield, FaToggleOn, FaToggleOff, FaMoon, FaSun } from "react-icons/fa";
import "./SuperAdminDashboard.css";

const SuperAdminDashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [storageUsed, setStorageUsed] = useState(75);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/superadmin/admins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(res.data);
    } catch (err) {
      console.error("Error fetching admins", err);
      setError("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  const fetchStorageUsed = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/storage", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const totalStorageGB = (res.data.totalStorage / (1024 ** 3)).toFixed(2);
      setStorageUsed(totalStorageGB);
    } catch (err) {
      console.error("Error fetching storage data", err);
      setError("Failed to fetch storage data");
    }
  };

  const handleToggleUser = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/admin/superusers/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      console.error("Error toggling user status", err);
      setError("Failed to toggle user status");
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/superadmin/admins/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAdmins();
    } catch (err) {
      console.error("Error approving admin", err);
      setError("Failed to approve admin");
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/superadmin/admins/${id}/status`,
        { status: "inactive", approvedBySuperadmin: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAdmins();
    } catch (err) {
      console.error("Error rejecting admin", err);
      setError("Failed to reject admin");
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchUsers();
    fetchStorageUsed();
  }, []);

  if (loading) return <p style={{ color: "white" }}>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const activeUsers = users.filter((u) => u.status === "active").length;
  const inactiveUsers = users.length - activeUsers;
  const pieData = [
    { name: "Active Users", value: activeUsers },
    { name: "Inactive Users", value: inactiveUsers },
  ];
  const COLORS = ["#2ecc71", "#e74c3c"];

  return (
    <div className={`dashboardd ${darkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <aside className="sidebarr">
        <h2>SuperAdmin</h2>
        <button onClick={() => setActiveTab("users")}>Users Details</button>
        <button onClick={() => setActiveTab("admins")}>Admin Details</button>
      </aside>

      {/* Main Content */}
      <main className="main-contentt">
        <div className="header-bar">
          <h1>Super Admin Dashboard</h1>
          <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        {/* Only show stats, charts, storage for Users tab */}
        {activeTab === "users" && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <FaUsers className="stat-icon" />
                <h3>{users.length}</h3>
                <p>Total Users</p>
              </div>
              <div className="stat-card">
                <FaUserShield className="stat-icon" />
                <h3>{admins.length}</h3>
                <p>Total Admins</p>
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
              {/* <div className="stat-card">
                <FaToggleOn className="stat-icon blue" />
                <h3>{storageUsed} GB</h3>
                <p>Storage Used</p>
              </div> */}
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
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* Users Table */}
        {activeTab === "users" && (
          <>
            <h2>Users</h2>
            <table className="dashboard-tablee">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <button
                        className={`btn ${user.status === "active" ? "btn-approve" : "btn-reject"}`}
                        onClick={() => handleToggleUser(user._id)}
                      >
                        {user.status === "active" ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td>
                      {user.createdAt && !isNaN(new Date(user.createdAt))
                        ? new Date(user.createdAt).toLocaleDateString("en-GB")
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Admins Table only */}
        {activeTab === "admins" && (
          <>
            <h2>Admins</h2>
            <table className="dashboard-tablee">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Approved</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin._id}>
                    <td>{admin.username}</td>
                    <td>{admin.email}</td>
                    <td>{admin.status}</td>
                    <td>{admin.approvedBySuperadmin ? "✅ Yes" : "❌ No"}</td>
                    <td>
                      <button
                        className="btn btn-approve"
                        onClick={() => handleApprove(admin._id)}
                        disabled={admin.approvedBySuperadmin}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-reject"
                        onClick={() => handleReject(admin._id)}
                        disabled={admin.status === "inactive"}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </main>
    </div>
  );
};

export default SuperAdminDashboard;

