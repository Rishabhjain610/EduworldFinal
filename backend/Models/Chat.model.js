
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// This schema is for messages embedded within a ChatRoom
const messageSchema = new Schema({
  sender: {
    type: String,
    required: true
  },
  senderRole: {
    type: String,
    enum: ['student', 'teacher'],
    required: true
  },
  content: {
    type: String
  },
  messageType: {
    type: String,
    enum: ['text', 'image'], // Simplified schema
    default: 'text'
  },
  imageUrl: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  edited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  }
});

const chatRoomSchema = new Schema({
  roomName: {
    type: String,
    required: true,
    unique: true
  },
  participants: [{
    username: String,
    role: {
      type: String,
      enum: ['student', 'teacher']
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Check if the model already exists before compiling it
module.exports = mongoose.models.ChatRoom || model("ChatRoom", chatRoomSchema);