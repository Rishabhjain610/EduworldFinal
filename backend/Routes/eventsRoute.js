const express = require("express");
const EventRouter = express.Router();
const { verifyUser } = require("../Middlewares/verifyUserMiddleware");
const { createEvent, getEvents } = require("../Controllers/Events.controller");

EventRouter.post("/events", verifyUser, createEvent);
EventRouter.get("/events", verifyUser, getEvents);

module.exports = EventRouter;
