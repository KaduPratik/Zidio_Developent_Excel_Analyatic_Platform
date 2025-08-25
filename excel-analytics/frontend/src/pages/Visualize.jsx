import React, { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Pie, Scatter } from "react-chartjs-2";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";
import logo from "../../img/logo2.png";
import "./visualize.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const chartComponents = {
  Bar,
  Line,
  Pie,
  Scatter,
};

export default function Visualize() {
  const location = useLocation();
  const navigate = useNavigate();
  const parsedData = location.state?.parsedData || [];

  const [loggedInUser, setLoggedInUser] = useState("");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartType, setChartType] = useState("Bar");
  const [columns, setColumns] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
    if (parsedData.length > 0) {
      setColumns(Object.keys(parsedData[0]));
    }
  }, [parsedData]);

  const goBack = () => {
    handleSuccess("Navigating back");
    navigate(-1);
  };

  const getChartData = () => {
    if (!xAxis || !yAxis) return null;

    const xData = parsedData.map((row) => row[xAxis]);
    const yData = parsedData.map((row) => parseFloat(row[yAxis]));

    if (chartType === "Pie") {
      return {
        labels: xData,
        datasets: [
          {
            data: yData,
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
              "#FF9F40",
            ],
            hoverOffset: 4,
          },
        ],
      };
    }

    if (chartType === "Scatter") {
      return {
        datasets: [
          {
            label: `${yAxis} vs ${xAxis}`,
            data: parsedData.map((row) => ({
              x: parseFloat(row[xAxis]),
              y: parseFloat(row[yAxis]),
            })),
            backgroundColor: "#36A2EB",
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBorderColor: "#333",
          },
        ],
      };
    }

    return {
      labels: xData,
      datasets: [
        {
          label: `${yAxis} by ${xAxis}`,
          data: yData,
          backgroundColor: "#4BC0C0",
          borderColor: "#4BC0C0",
          borderWidth: 1,
        },
      ],
    };
  };

  const chartData = getChartData();
  const ChartComponent = chartComponents[chartType];

  const chartOptions =
    chartType === "Scatter"
      ? {
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Scatter Chart" },
          },
          scales: {
            x: {
              type: "linear",
              title: { display: true, text: xAxis },
              ticks: { beginAtZero: true },
            },
            y: {
              title: { display: true, text: yAxis },
              ticks: { beginAtZero: true },
            },
          },
        }
      : {
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: { display: true, text: `${chartType} Chart` },
          },
          scales:
            chartType !== "Pie"
              ? {
                  x: { beginAtZero: true },
                  y: { beginAtZero: true },
                }
              : {},
        };

  const downloadPNG = () => {
    const chartCanvas = chartRef.current?.canvas;
    if (chartCanvas) {
      const link = document.createElement("a");
      link.download = "chart.png";
      link.href = chartCanvas.toDataURL("image/png");
      link.click();
    }
  };

  const downloadPDF = () => {
    const chartBox = document.getElementById("chart-download");
    if (!chartBox) return;

    html2canvas(chartBox).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, width - 20, height);
      pdf.save("chart.pdf");
    });
  };

  return (
    <div className="page-wrapper">
      <nav className="navbar">
        <div className="navbar-logo">
          <img src={logo} alt="Logo" className="logo-img" />
          Excel Vision
        </div>
        <div className="navbar-right">
          <span className="navbar-user">Welcome, {loggedInUser}</span>
          <button className="logout-btn" onClick={goBack}>
            ⬅️ Go Back
          </button>
        </div>
      </nav>

      <div className="visualize-container">
        <h2 className="title">
          📊 Data <span className="highlight">Visualization</span>
        </h2>

        <div className="controls">
          <label>Select X-Axis:</label>
          <select value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
            <option value="">Select</option>
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>

          <label>Select Y-Axis:</label>
          <select value={yAxis} onChange={(e) => setYAxis(e.target.value)}>
            <option value="">Select</option>
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>

          <label>Chart Type:</label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            <option value="Bar">Bar</option>
            <option value="Line">Line</option>
            <option value="Pie">Pie</option>
            <option value="Scatter">Scatter</option>
          </select>
        </div>

        <div id="chart-download" className="chart-box">
          {ChartComponent && chartData ? (
            <ChartComponent
              data={chartData}
              options={chartOptions}
              ref={chartRef}
            />
          ) : (
            <p>Please select both X and Y axes to display chart.</p>
          )}
        </div>

        <div className="download-buttons">
          <button onClick={downloadPNG}>📥 Download PNG</button>
          <button onClick={downloadPDF}>📄 Download PDF</button>
        </div>
      </div>

      <ToastContainer />

      <footer className="footer">
        <p>
          Made with <span className="heart">❤️</span> by{" "}
          <strong>Pratik Kadu</strong>
        </p>
        <p>
          Project created under the{" "}
          <strong>ZIDIO Development Internship</strong>
        </p>
      </footer>
    </div>
  );
}
