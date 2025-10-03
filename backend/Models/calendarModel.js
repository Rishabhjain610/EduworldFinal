const mongoose = require("mongoose");
const { eventSchema } = require("../Schemas/calendarEvent");

const Event = mongoose.model("Event", eventSchema);

module.exports = { Event };
