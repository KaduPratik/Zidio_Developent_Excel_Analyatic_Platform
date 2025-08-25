const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");

const router = express.Router();

// Multer setup - store in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/upload
router.post("/", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    res.status(200).json({
      message: "File uploaded and parsed successfully",
      data: jsonData,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload/parse file" });
  }
});

module.exports = router;
