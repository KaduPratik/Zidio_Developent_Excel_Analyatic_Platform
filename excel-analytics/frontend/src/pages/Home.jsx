import logo from "../../img/logo2.png";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";

import "./Home.css";

function Home() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [excelFile, setExcelFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    handleSuccess("User Logged out");
    setTimeout(() => {
      navigate("/main");
    }, 1000);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!excelFile) return handleError("No file selected");

    const formData = new FormData();
    formData.append("file", excelFile);

    try {
      const response = await fetch("http://localhost:8080/upload", {
        method: "POST",
        // DO NOT SET HEADERS HERE
        body: formData,
      });

      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();

        if (response.ok && data.data) {
          handleSuccess("File uploaded successfully!");
          localStorage.setItem("excelData", JSON.stringify(data.data));
          navigate("/visualize", { state: { parsedData: data.data } });

          // Save filename in uploaded list
          const existingFiles =
            JSON.parse(localStorage.getItem("uploadedFiles")) || [];
          localStorage.setItem(
            "uploadedFiles",
            JSON.stringify([...new Set([...existingFiles, excelFile.name])])
          );
        } else {
          handleError(data.message || "Upload failed");
        }
      } else {
        const text = await response.text();
        handleError("Unexpected server response: " + text);
      }
    } catch (err) {
      console.error("Upload error:", err);
      handleError("Error uploading file");
    }
  };

  return (
    <div className="page-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <img src={logo} alt="Logo" className="logo-img" />
          Excel Vision
        </div>

        <div className="navbar-right">
          <span className="navbar-user">Welcome, {loggedInUser}</span>
          <button className="logout-btn" onClick={handleLogout}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: "8px" }}
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="main-content">
        <div className="main-content-inner split-layout">
          {/* Left Side: Title + Description */}
          <div className="left-section">
            <h1>Excel Vision</h1> <br />
            <p>
              " Visualize your Excel data with smart analytics and interactive
              charting tools "
            </p>
          </div>

          {/* Right Side: Uploaded Files */}
          <div className="right-section uploaded-files">
            <h3>
              <strong>Previously Uploaded Files:</strong>
            </h3>
            <ul>
              {JSON.parse(localStorage.getItem("uploadedFiles") || "[]").map(
                (fileName, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span>{fileName}</span>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        className="view-btn"
                        onClick={() => {
                          const data = JSON.parse(
                            localStorage.getItem("excelData")
                          );
                          if (data) {
                            navigate("/visualize", {
                              state: { parsedData: data },
                            });
                          } else {
                            handleError("No data found for this file.");
                          }
                        }}
                      >
                        View
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => {
                          const uploadedFiles = JSON.parse(
                            localStorage.getItem("uploadedFiles") || "[]"
                          );
                          const updatedFiles = uploadedFiles.filter(
                            (f) => f !== fileName
                          );

                          localStorage.setItem(
                            "uploadedFiles",
                            JSON.stringify(updatedFiles)
                          );

                          const data = JSON.parse(
                            localStorage.getItem("excelData")
                          );
                          if (data?.fileName === fileName) {
                            localStorage.removeItem("excelData");
                          }

                          window.location.reload();
                        }}
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          border: "none",
                          padding: "5px 5px",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="info">
        <div className="info-inner">
          {/* Left: Upload Box */}
          <div className="upload-box">
            <h2>Upload Excel File &#8595;</h2>
            <form onSubmit={handleUpload} className="upload-form">
              <label htmlFor="file-upload" className="custom-file-label">
                {excelFile ? excelFile.name : "Choose Excel file"}
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".xls,.xlsx,.csv"
                onChange={(e) => setExcelFile(e.target.files[0])}
                required
                className="hidden-file-input"
              />
              <button type="submit" className="upload-btn">
                Upload
              </button>
            </form>
          </div>

          {/* Right: Attractive Text */}
          <div className="upload-text">
            <h2>📊 Transform Your Data</h2>
            <p>
              Turn your raw Excel sheets into beautiful, interactive charts
              instantly. No coding required — just upload and visualize.
            </p>
            <p>
              Make smarter decisions with clear, visual insights at your
              fingertips.
            </p>
          </div>
        </div>
      </div>

      <ToastContainer />

      {/* Footer */}
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

export default Home;
