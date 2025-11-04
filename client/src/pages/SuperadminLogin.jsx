import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SuperadminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [superAdminId, setSuperAdminId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/superadmin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, superAdminId, role: "superadmin" }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || data.error || "Login failed");
        return;
      }

      alert("Superadmin login successful!");
      localStorage.setItem("token", data.token || data.user?.token);
      navigate("/dashboard/superadmin");
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Superadmin Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="SuperAdmin ID"
            value={superAdminId}
            onChange={(e) => setSuperAdminId(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
