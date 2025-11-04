import React from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">Excel Analytics</div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About Us</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <button className="login-btn" onClick={() => navigate("/login")}>
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="overlay"></div>
        <div className="hero-container"> {/* Left side: text */}
          <div className="hero-text">
          {/* <h1>
            <span className="highlight">From Spreadsheets</span> to Stunning Insights — Instantly
          </h1> */}
          <p>
            Upload your Excel files and instantly turn them into interactive 2D and 3D visualizations. Explore your data with zoom, filters, and dynamic charts while AI reveals hidden trends, anomalies, and key patterns. Create professional dashboards in seconds — no coding, no complexity, just smarter insights at your fingertips.
          </p>
          <button className="cta-btn" onClick={() => navigate("/upload")}>
             Get Started
          </button>
      
        </div>

        {/* Right side: images */}
        <div className="hero-image">
          <img
          src="https://t3.ftcdn.net/jpg/03/54/00/74/360_F_354007466_mm4QilA3n92YWPseqs82gbWxbb06R1i4.jpg"
          alt="Data Analysis "
        /> 
      </div>
    </div>
  </section>

      
  {/* Features */}
  <section id="services" className="features">
  <div className="features-content">
    
    <h2 className="section-title">Our Services</h2>

    <div className="feature">
      <i className="fas fa-database"></i>
      <div>
        <h3>About Excel Analytics</h3>
        <p>
          We simplify data analysis by combining Excel’s flexibility with powerful analytics tools.
          Upload your files, and our platform will provide actionable insights within seconds.
        </p>
      </div>
    </div>

    <div className="feature">
      <i className="fas fa-chart-line"></i>
      <div>
        <h3>Visualize Data</h3>
        <p>Create interactive charts and graphs from your Excel files instantly.</p>
      </div>
    </div>

    <div className="feature">
      <i className="fas fa-robot"></i>
      <div>
        <h3>AI Insights</h3>
        <p>Our AI analyzes your data and highlights trends automatically.</p>
      </div>
    </div>

    <div className="feature">
      <i className="fas fa-file-export"></i>
      <div>
        <h3>Export Reports</h3>
        <p>Download ready-made reports in multiple formats with one click.</p>
      </div>
    </div>
  </div>

  <div className="features-image">
    <img
      src="https://png.pngtree.com/background/20231018/original/pngtree-d-rendering-of-data-analysis-circle-graph-on-blue-background-for-picture-image_5598084.jpg"
      alt="Data Analysis Circle Graph"
    />
  </div>
</section>


      {/* About Section */}
      <section id="about" className="about">
        <div className="about-text">
          <h2>About Excel Analytics</h2>
          <p>
            We simplify data analysis by combining Excel’s flexibility with powerful analytics tools.
            Upload your files, and our platform will provide actionable insights within seconds.
          </p>
        </div>
        <div className="about-image">
          <img
          src="https://ik.imgkit.net/3vlqs5axxjf/PCWW/uploadedImages/Articles/Interviews/2023/July/AI%20Insights%20Hostfully.jpeg?tr=w-800,fo-auto"
          alt="About Excel Analytics"
          />

        </div>
        
      </section>

      {/* Footer */}
<footer className="footer">
  <div className="footer-container">

    {/* About Section */}
    <div className="footer-about">
      <h3><i className="fa-solid fa-circle-info"></i> About</h3>
      <p><i className="fa-solid fa-location-dot"></i> 203 Fake St. Mountain View, San Francisco, California, USA</p>
      <p><i className="fa-solid fa-phone"></i> +91 98765 43210</p>
      <p><i className="fa-solid fa-envelope"></i> support@excelanalytics.com</p>
      <div className="email-box">
        <input type="email" placeholder="Enter email address" />
        <button><i className="fa-solid fa-paper-plane"></i></button>
      </div>
    </div>

    {/* Latest News */}
    <div className="footer-news">
      <h3><i className="fa-solid fa-newspaper"></i> Latest News</h3>
      <div className="news-item">
        <img src="https://via.placeholder.com/60" alt="News" />
        <div>
          <p>Even the all-powerful Pointing has no control about</p>
          <span>Aug. 15, 2025 | Admin | 10</span>
        </div>
      </div>
      <div className="news-item">
        <img src="https://via.placeholder.com/60" alt="News" />
        <div>
          <p>AI-driven analytics now in your hands</p>
          <span>Aug. 14, 2025 | Admin | 8</span>
        </div>
      </div>
    </div>

    {/* Information Links */}
    <div className="footer-info">
      <h3><i className="fa-solid fa-list"></i> Information</h3>
      <ul>
        <li>About</li>
        <li>Products</li>
        <li>Blog</li>
        <li>Contact</li>
        <li>Help & Support</li>
      </ul>
    </div>

    {/* Instagram */}
    <div className="footer-instagram">
      <h3><i className="fa-brands fa-instagram"></i> Instagram</h3>
      <div className="insta-grid">
        <img src="https://via.placeholder.com/70" alt="insta1" />
        <img src="https://via.placeholder.com/70" alt="insta2" />
        <img src="https://via.placeholder.com/70" alt="insta3" />
        <img src="https://via.placeholder.com/70" alt="insta4" />
        <img src="https://via.placeholder.com/70" alt="insta5" />
        <img src="https://via.placeholder.com/70" alt="insta6" />
      </div>
    </div>

  </div>

  <div className="footer-bottom">
    <p>© 2025 Excel Analytics | All Rights Reserved</p>
    <p>Made with <span>♥</span> by <a href="#">Excel Analytics Team</a></p>
  </div>
</footer>

    </div>
  );
};

export default LandingPage;
