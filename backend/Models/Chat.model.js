const mongoose = require("mongoose");
const { Schema, model } = mongoose;

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

module.exports = model("ChatRoom", chatRoomSchema);