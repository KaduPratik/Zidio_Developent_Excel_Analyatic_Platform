const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load .env
dotenv.config();

const uploadRouter = require("./Routes/UploadRouter");
const authRouter = require("./Routes/AuthRouter");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    // These are not needed anymore but won't cause error
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// Routes
app.use("/auth", authRouter);
app.use("/upload", uploadRouter);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to Excel Analytics API");
});

// Server listen
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
