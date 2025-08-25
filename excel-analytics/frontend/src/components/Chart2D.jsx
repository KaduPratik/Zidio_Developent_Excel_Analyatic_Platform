// components/Chart2D.jsx
import React from "react";
import { Bar, Line, Pie, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Chart2D({ type, xData, yData }) {
  const chartData = {
    labels: xData,
    datasets: [
      {
        label: "Dataset",
        data: yData,
        backgroundColor: [
          "#36A2EB",
          "#FF6384",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        borderColor: "#000",
        borderWidth: 1,
      },
    ],
  };

  const options = { responsive: true };

  switch (type) {
    case "Bar":
      return <Bar data={chartData} options={options} />;
    case "Line":
      return <Line data={chartData} options={options} />;
    case "Pie":
      return <Pie data={chartData} options={options} />;
    case "Scatter":
      return (
        <Scatter
          data={{
            datasets: [
              {
                label: "Scatter Dataset",
                data: xData.map((x, i) => ({ x, y: yData[i] })),
                backgroundColor: "#FF6384",
              },
            ],
          }}
          options={options}
        />
      );
    default:
      return <p>Please select a valid chart type.</p>;
  }
}
