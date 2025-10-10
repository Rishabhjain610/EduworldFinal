const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const directMessageSchema = new Schema({
  from: {
    type: String,
    required: true
  },
  fromRole: {
    type: String,
    enum: ['student', 'teacher'],
    required: true
  },
  to: {
    type: String,
    required: true
  },
  toRole: {
    type: String,
    enum: ['student', 'teacher'],
    required: true
  },
  content: {
    type: String,
    required: function() {
      return this.messageType === 'text';
    }
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'emoji'],
    default: 'text'
  },
  imageUrl: {
    type: String,
    required: function() {
      return this.messageType === 'image';
    }
  },
  emoji: {
    type: String,
    required: function() {
      return this.messageType === 'emoji';
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  }
});

// Index for efficient queries
directMessageSchema.index({ from: 1, to: 1, timestamp: -1 });
directMessageSchema.index({ to: 1, read: 1 });

module.exports = model("DirectMessage", directMessageSchema);