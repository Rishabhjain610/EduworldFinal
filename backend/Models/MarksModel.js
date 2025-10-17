const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
  rollNo: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  exam: { type: String, required: true },
  remarks: { type: String, default: '' }, // Add remarks field
  marks: {
    obtained: { type: Number, required: true },
    total: { type: Number, required: true },
    percentage: { type: Number, required: true }
  },
  aiAnalysis: {
    grade: { type: String },
    strengths: [String],
    improvements: [String],
    recommendations: [String],
    comment: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Marks', marksSchema);