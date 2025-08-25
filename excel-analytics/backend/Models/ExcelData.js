const mongoose = require("mongoose");

const ExcelRowSchema = new mongoose.Schema({}, { strict: false });

const ExcelDataSchema = new mongoose.Schema({
  uploadedBy: { type: String, default: "Anonymous" },
  rows: [ExcelRowSchema],
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ExcelData", ExcelDataSchema);
