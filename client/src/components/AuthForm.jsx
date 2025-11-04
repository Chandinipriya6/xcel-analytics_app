import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    adminId: '',
    superAdminId: ''
  });

  const navigate = useNavigate();

  const handleToggle = () => setIsLogin(!isLogin);

  const handleRoleChange = (e) => setRole(e.target.value);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Dynamic endpoint based on role
    const endpoint =
      role === 'superadmin'
        ? isLogin
          ? '/api/auth/superadmin/login'
          : '/api/auth/superadmin/register'
        : isLogin
        ? '/api/auth/login'
        : '/api/auth/register';

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || data.error || 'Something went wrong');
        return;
      }

      if (!isLogin) {
        alert('Registered successfully! Check your email for the verification code.');
        navigate('/verify', { state: { email: formData.email, role } });
      } else {
        if (data.success) {
          alert('Login successful!');
          localStorage.setItem('token', data.token||data.user?.token);

          if (data.user.role === 'superadmin') navigate('/dashboard/superadmin');
          else if (data.user.role === 'admin') navigate('/dashboard/admin');
          else navigate('/dashboard/user');
        } else {
          alert(data.message || data.error || 'Login failed');
        }
      }
    } catch (err) {
      console.error('Error during request:', err);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Excel Analytics Platform</h1>

        <div className="toggle-buttons">
          <button onClick={() => setIsLogin(true)} className={isLogin ? 'active' : ''}>Login</button>
          <button onClick={() => setIsLogin(false)} className={!isLogin ? 'active' : ''}>Register</button>
        </div>

        <div className="role-selection">
          <label>
            <input type="radio" name="role" value="user" checked={role === 'user'} onChange={handleRoleChange} /> User
          </label>
          <label>
            <input type="radio" name="role" value="admin" checked={role === 'admin'} onChange={handleRoleChange} /> Admin
          </label>
          {/* <label>
            <input type="radio" name="role" value="superadmin" checked={role === 'superadmin'} onChange={handleRoleChange} /> Superadmin
          </label> */}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Full Name - required for registration */}
          {!isLogin && (
            <input type="text" name="fullName" placeholder="FullName" value={formData.fullName} onChange={handleChange} required />
          )}

          {/* Email - always required */}
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />

          {/* Username - only for user/admin */}
          {!isLogin && role !== 'superadmin' && (
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
          )}

          {/* Password */}
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

          {/* Admin ID - only for admin */}
          {role === 'admin' && (
            <input type="text" name="adminId" placeholder="Admin ID" value={formData.adminId} onChange={handleChange} required />
          )}

          {/* SuperAdmin ID - only for superadmin */}
          {role === 'superadmin' && (
            <input type="text" name="superAdminId" placeholder="SuperAdmin ID" value={formData.superAdminId} onChange={handleChange} required />
          )}

          <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>
      </div>
    </div>
  );
}
