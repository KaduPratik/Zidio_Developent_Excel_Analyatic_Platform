const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load .env
dotenv.config();

const uploadRouter = require("./Routes/UploadRouter");
const authRouter = require("./Routes/AuthRouter");

const app = express();

// CORS configuration
const allowedOrigins = [
  "https://excel-vision.onrender.com", // local dev
  "https://apnaablog.netlify.app", // Netlify frontend
  "https://excel-vision.onrender.com", // Render frontend
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

// Routers (use relative paths only)
app.use("/auth", authRouter);
app.use("/upload", uploadRouter);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to Excel Analytics API");
});

// Serve static files if you have a frontend build (optional)
const frontendPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(frontendPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
