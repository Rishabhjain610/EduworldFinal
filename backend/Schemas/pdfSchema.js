const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema({
  pdf: String, // This will store the Cloudinary URL
  fileName: String,
  subject: String,
  year: String,
  branch: String,
  uploadedBy: String,
});

module.exports = { pdfSchema };
