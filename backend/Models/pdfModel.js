const mongoose = require("mongoose");
const {Schema, model} = require("mongoose");
const pdfSchema = new Schema({
  pdf: String, // Cloudinary URL
  fileName: String,
  subject: String,
  year: String,
  branch: String,
  uploadedBy: String,
});

const Pdf = model("Pdf", pdfSchema);

module.exports = { Pdf };