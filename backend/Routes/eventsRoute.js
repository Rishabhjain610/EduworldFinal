const express = require("express");
const EventRouter = express.Router();
const { verifyUser } = require("../Middlewares/verifyUserMiddleware");
const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} = require("../Controllers/Events.controller");

// Middleware to check if user is teacher (for creating events)
const checkTeacherRole = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({
      success: false,
      message: "Only teachers can create events",
    });
  }
  next();
};

// CRUD Routes
EventRouter.post("/events", verifyUser, checkTeacherRole, createEvent); // Create
EventRouter.get("/events", verifyUser, getEvents); // Read All
EventRouter.get("/events/:id", verifyUser, getEvent); // Read One
EventRouter.put("/events/:id", verifyUser, updateEvent); // Update
EventRouter.delete("/events/:id", verifyUser, deleteEvent); // Delete

module.exports = EventRouter;
