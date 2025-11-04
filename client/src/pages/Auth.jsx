import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

export default function Auth() {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({});
  const navigate = useNavigate(); //  required for navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? 'http://localhost:5000/api/auth/register' : 'http://localhost:5000/api/auth/login';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong");
        return;
      }

      if (isRegister) {
        // Redirect to verify
        navigate("/verify", { state: { email: formData.email, role } });
      } else {
        //  Redirect to correct dashboard
        if (data.user.role === 'admin') {
          navigate("/dashboard/admin");
        } else {
          navigate("/dashboard/user");
        }
      }

    } catch (error) {
      console.error("Error during auth:", error);
      alert("Server error");
    }
  };

  return (
    <div className="auth-container">
      <h1>Excel Analytics Platform</h1>

      <div className="toggle-buttons">
        <button onClick={() => setIsRegister(false)}>Login</button>
        <button onClick={() => setIsRegister(true)}>Register</button>
      </div>

      <div className="role-selection">
        <label>
          <input type="radio" name="role" value="user" onChange={() => setRole('user')} checked={role === 'user'} />
          User
        </label>
        <label>
          <input type="radio" name="role" value="admin" onChange={() => setRole('admin')} />
          Admin
        </label>
      </div>

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <>
            <input type="text" placeholder="Full Name" name="fullName" onChange={handleChange} required />
            <input type="email" placeholder="Email" name="email" onChange={handleChange} required />
          </>
        )}
        <input type="text" placeholder="Username" name="username" required onChange={handleChange} />
        <input type="password" placeholder="Password" name="password" required onChange={handleChange} />
        {role === 'admin' && (
          <input type="text" placeholder="Admin ID" name="adminId" onChange={handleChange} required={isRegister ? false : true} />
        )}
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>
    </div>
  );
}
