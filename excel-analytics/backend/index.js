const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load .env file
dotenv.config();

const uploadRouter = require("./Routes/UploadRouter");
const authRouter = require("./Routes/AuthRouter");

const app = express();

// ✅ CORS configuration
const allowedOrigins = [
  "http://localhost:5173", // local frontend
  "https://excel-vision.onrender.com", // deployed backend
  "https://apnaablog.netlify.app", // deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ API Routes
app.use("/auth", authRouter);
app.use("/upload", uploadRouter);

app.get("/api", (req, res) => {
  res.send("Welcome to Excel Analytics API");
});

// ✅ Serve frontend build (React from frontend/dist)
const frontendPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(frontendPath));

// Handle React routing
app.get("*", (req, res) => {
  res.sendFile(path.resolve(frontendPath, "index.html"));
});

// ✅ Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
