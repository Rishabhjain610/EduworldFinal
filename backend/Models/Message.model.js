
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const directMessageSchema = new Schema({
  from: { type: String, required: true },
  fromRole: { type: String, enum: ['student', 'teacher'], required: true },
  to: { type: String, required: true },
  toRole: { type: String, enum: ['student', 'teacher'], required: true },
  content: { type: String },
  messageType: { type: String, enum: ['text', 'image'], default: 'text' },
  imageUrl: { type: String },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  readAt: { type: Date }
});

// Index for efficient queries
directMessageSchema.index({ from: 1, to: 1, timestamp: -1 });
directMessageSchema.index({ to: 1, read: 1 });

// This pattern prevents the OverwriteModelError
// It checks if the model is already compiled and uses it, otherwise it compiles a new one.
module.exports = mongoose.models.DirectMessage || model("DirectMessage", directMessageSchema);