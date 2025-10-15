const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const pdfSchema = new Schema({
  pdf: String,
  fileName: String,
  subject: String,
  year: String,
  branch: String,
  uploadedBy: String,
  extractedText: String // <-- Add this line!
});

const Pdf = model("Pdf", pdfSchema);

module.exports = { Pdf };