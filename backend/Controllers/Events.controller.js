const { Event } = require("../Models/calendarModel");

// Create Event
const createEvent = async (req, res) => {
  try {
    const { title, subject, description, startDate, endDate, classInfo } = req.body;
    
    // Validate required fields
    if (!title || !subject || !startDate || !endDate || !classInfo) {
      return res.status(400).json({ 
        success: false, 
        message: "Title, subject, start date, end date, and class info are required" 
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      return res.status(400).json({ 
        success: false, 
        message: "End time must be after start time" 
      });
    }

    const newEvent = new Event({
      title,
      subject,
      description,
      startDate: start,
      endDate: end,
      classInfo,
      createdBy: req.user.id, // This should be set by verifyUser middleware
    });
    
    await newEvent.save();
    
    // Populate the createdBy field before sending response
    await newEvent.populate("createdBy", "username");
    
    console.log("Event created:", newEvent);
    res.status(201).json({ success: true, event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ success: false, message: "Error creating event" });
  }
};

// Get All Events
const getEvents = async (req, res) => {
  try {
    const { classInfo, subject } = req.query;
    let filter = {};
    
    if (classInfo) filter.classInfo = classInfo;
    if (subject) filter.subject = subject;
    
    const events = await Event.find(filter)
      .populate("createdBy", "username")
      .sort({ startDate: 1 });
      
    console.log("Events fetched:", events.length);
    res.status(200).json({ success: true, events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ success: false, message: "Error fetching events" });
  }
};

// Get Single Event
const getEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).populate("createdBy", "username");
    
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    
    res.status(200).json({ success: true, event });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ success: false, message: "Error fetching event" });
  }
};

// Update Event
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subject, description, startDate, endDate, classInfo } = req.body;
    
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    
    // Check if user is the creator or is a teacher
    if (event.createdBy.toString() !== req.user.id && req.user.role !== "teacher") {
      return res.status(403).json({ 
        success: false, 
        message: "You can only update events you created" 
      });
    }
    
    // Validate dates if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start >= end) {
        return res.status(400).json({ 
          success: false, 
          message: "End time must be after start time" 
        });
      }
    }
    
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        ...(title && { title }),
        ...(subject && { subject }),
        ...(description !== undefined && { description }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(classInfo && { classInfo }),
        updatedAt: new Date()
      },
      { new: true }
    ).populate("createdBy", "username");
    
    res.status(200).json({ success: true, event: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ success: false, message: "Error updating event" });
  }
};

// Delete Event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    
    // Check if user is the creator or is a teacher
    if (event.createdBy.toString() !== req.user.id && req.user.role !== "teacher") {
      return res.status(403).json({ 
        success: false, 
        message: "You can only delete events you created" 
      });
    }
    
    await Event.findByIdAndDelete(id);
    
    res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ success: false, message: "Error deleting event" });
  }
};

module.exports = { 
  createEvent, 
  getEvents, 
  getEvent, 
  updateEvent, 
  deleteEvent 
};