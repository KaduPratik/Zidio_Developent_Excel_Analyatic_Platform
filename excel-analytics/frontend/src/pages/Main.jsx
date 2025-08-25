import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import logo from "../../img/logo2.png";

import "../index.css";
import "./main.css";

function Main() {
  const [excelFile, setExcelFile] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visitorCount, setVisitorCount] = useState(0);

  // Animated stats states
  const [filesProcessed, setFilesProcessed] = useState(0);
  const [chartsGenerated, setChartsGenerated] = useState(0);
  const [happyUsers, setHappyUsers] = useState(0);
  const [reportsExported, setReportsExported] = useState(0);
  const [animatedVisitors, setAnimatedVisitors] = useState(0);

  const navigate = useNavigate();

  const phrases = [
    "Analysis Chart",
    "Download Chart",
    "Data Insights",
    "Smart Visuals",
    "Interactive Dashboards",
    "Trends & Patterns",
    "Excel Data Magic",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const visited = localStorage.getItem("visited");
    let count = parseInt(localStorage.getItem("visitorCount")) || 0;

    if (!visited) {
      count += 1;
      localStorage.setItem("visited", "true");
      localStorage.setItem("visitorCount", count);
    }

    setVisitorCount(count);
  }, []);

  // Count-up animation
  useEffect(() => {
    const animateValue = (start, end, setter, duration = 2000) => {
      let startTime = null;
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setter(Math.floor(progress * (end - start) + start));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    animateValue(0, 12500, setFilesProcessed);
    animateValue(0, 6800, setChartsGenerated);
    animateValue(0, 4300, setHappyUsers);
    animateValue(0, 9500, setReportsExported);
    animateValue(0, visitorCount, setAnimatedVisitors);
  }, [visitorCount]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!excelFile) return handleError("No file selected");

    const formData = new FormData();
    formData.append("excel", excelFile);

    try {
      const response = await fetch("http://localhost:8080/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.data) {
        handleSuccess("File uploaded successfully!");
        localStorage.setItem("excelData", JSON.stringify(data.data));
        navigate("/visualize", { state: { parsedData: data.data } });
      } else {
        handleError(data.message || "Upload failed");
      }
    } catch (err) {
      handleError("Error uploading file");
    }
  };

  // review people
  const reviews = [
    {
      text: "Absolutely love the intuitive interface!",
      author: "Anjali T.",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmFrZSUyMHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      text: "Excel Vision helped me visualize sales data like never before.",
      author: "Ravi P.",
      image:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFrZSUyMHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      text: "A game changer for quick insights.",
      author: "Neha M.",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmFrZSUyMHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      text: "Uploading and analyzing Excel is super easy!",
      author: "Suresh D.",
      image:
        "https://images.unsplash.com/photo-1492446845049-9c50cc313f00?w=1400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZmFrZSUyMHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D",
    },
  ];

  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 3000); // Rotate every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-wrapper">
      <nav className="navbar">
        <div className="navbar-logo">
          <img src={logo} alt="Logo" className="logo-img" />
          Excel Vision
        </div>
        <div className="navbar-right">
          <button className="nav-btn" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="nav-btn" onClick={() => navigate("/signup")}>
            Sign up
          </button>
        </div>
      </nav>

      <div className="main-content">
        <div className="main-text">
          <h1>Welcome to Excel Vision</h1>
          <p className="phrase">{phrases[currentIndex]}</p>
          <p className="subtext">
            " Visualize your Excel data with smart analytics and interactive
            charting tools "
          </p>

          <div className="action-buttons">
            <button className="login-btn" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="signup-btn" onClick={() => navigate("/signup")}>
              Signup
            </button>
          </div>
        </div>

        <div className="animation-box">
          <iframe
            src="https://lottie.host/embed/027f9118-378f-4fd1-b918-572b93dca43a/BBOxAE4Yc3.lottie"
            title="Lottie Animation"
            className="lottie-iframe"
          ></iframe>
        </div>
      </div>

      <div className="info-section">
        <h2 className="heading">Why Choose Excel Vision?</h2>

        <div className="features-container">
          <div className="feature-box feature-1">
            <div className="icon-title">
              <span className="material-symbols-outlined icon">
                bar_chart_4_bars
              </span>
              <span className="title">Smart Charts</span>
            </div>
            <p className="desc">
              Generate insightful 2D charts instantly from your Excel data.
            </p>
          </div>

          <div className="feature-box feature-2">
            <div className="icon-title">
              <span className="icon">🧠</span>
              <span className="title">AI Insights</span>
            </div>
            <p className="desc">
              Let our tool highlight trends, patterns, and anomalies for you.
            </p>
          </div>

          <div className="feature-box feature-3">
            <div className="icon-title">
              <span className="material-symbols-outlined icon">download</span>
              <span className="title">Export Options</span>
            </div>
            <p className="desc">
              Download your visuals in PNG or PDF format effortlessly.
            </p>
          </div>
        </div>
      </div>

      {/* { review people } */}

      <section className="user-reviews">
        <div className="review-wrapper">
          <h2>Our Users Reviews</h2>
          <div className="review-card">
            <img
              src={reviews[currentReviewIndex].image}
              alt="User"
              className="review-img"
            />
          </div>
          <p className="review-text">"{reviews[currentReviewIndex].text}"</p>
          <p className="review-author">
            – {reviews[currentReviewIndex].author}
          </p>

          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-icon">📄</span>
              <h3 className="stat-number">512</h3>
              <p className="stat-label">Files Processed</p>
            </div>
            <div className="stat-card">
              <span className="stat-icon">📊</span>
              <h3 className="stat-number">807</h3>
              <p className="stat-label">Charts Generated</p>
            </div>
            <div className="stat-card">
              <span className="stat-icon">😊</span>
              <h3 className="stat-number">305</h3>
              <p className="stat-label">Happy Users</p>
            </div>
            <div className="stat-card">
              <span className="stat-icon">⬇️</span>
              <h3 className="stat-number">53</h3>
              <p className="stat-label">Reports Exported</p>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🌐</span>
              <h3 className="stat-number">151</h3>
              <p className="stat-label">Total Visitors</p>
            </div>
          </div>
        </div>
      </section>

      <ToastContainer />

      <footer className="footer">
        <p>
          Made with <span className="heart">❤️</span> by{" "}
          <strong>Pratik Kadu</strong>
        </p>
        <p>
          Project created under the{" "}
          <strong>ZIDIO Development Internship</strong>
          <br />
          Web Development
        </p>
      </footer>
    </div>
  );
}

export default Main;
