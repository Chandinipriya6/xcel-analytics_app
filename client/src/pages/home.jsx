import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // optional CSS for styling

export default function Home() {
  return (
    <div className="home-container">
      <header className="navbar">
        <h1 className="logo">Excel Analytics Platform</h1>
        <nav>
          <ul className="nav-links">
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </nav>
      </header>

      <main className="home-content">
        <h2>Welcome to Excel Analytics Platform</h2>
        <p>Analyze your Excel files with interactive charts and AI insights.</p>
        <p>Upload files, track analysis history, and more!</p>
      </main>
    </div>
  );
}
