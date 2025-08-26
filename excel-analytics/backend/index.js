const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

// Load .env
dotenv.config();

const uploadRouter = require("./Routes/UploadRouter");
const authRouter = require("./Routes/AuthRouter");

const app = express();

// CORS configuration
const allowedOrigins = [
  "https://excel-vision.onrender.com",
  "https://apnaablog.netlify.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Preflight OPTIONS request handler
app.options(
  "*",
  cors({
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routers
app.use("/auth", authRouter);
app.use("/upload", uploadRouter);

// Default route
app.get("/api", (req, res) => {
  res.send("Welcome to Excel Analytics API");
});

// Serve frontend build safely (only if exists)
const frontendPath = path.join(__dirname, "frontend", "dist");

if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    const indexFile = path.join(frontendPath, "index.html");
    if (fs.existsSync(indexFile)) {
      res.sendFile(indexFile);
    } else {
      res.status(404).send("Frontend not found");
    }
  });
}

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
