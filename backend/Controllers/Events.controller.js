const { Event } = require("../Models/calendarModel");
const createEvent = async (req, res) => {
  try {
    const { title, description, startDate, endDate, classInfo } = req.body;
    const newEvent = new Event({
      title,
      description,
      startDate,
      endDate,
      classInfo,
      createdBy: req.user.id,
    });
    await newEvent.save();
    res.status(201).json({ success: true, event: newEvent });
  } catch {
    res.status(500).json({ success: false, message: "Error creating event" });
  }
};

const getEvents=async(req,res)=>{
  try {
        const { classInfo } = req.query;
        let filter = {};
        if (classInfo) filter.classInfo = classInfo;
        const events = await Event.find(filter).populate("createdBy", "username");
        res.status(200).json({ success: true, events });
    } catch {
        res.status(500).json({ success: false, message: "Error fetching events" });
    }
}

module.exports = { createEvent, getEvents };