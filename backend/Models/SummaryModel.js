const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
  pdfId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pdf',
    required: true
  },
  studentId: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  extractedText: { // <-- Add this field
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Summary', summarySchema);