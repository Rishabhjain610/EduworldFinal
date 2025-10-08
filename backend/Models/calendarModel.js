const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const eventSchema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  subject: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String,
    default: ""
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  classInfo: { 
    type: String, 
    required: true 
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true 
});

// Index for better performance
eventSchema.index({ startDate: 1 });
eventSchema.index({ subject: 1 });
eventSchema.index({ classInfo: 1 });

const Event = model("Event", eventSchema);
module.exports = { Event };