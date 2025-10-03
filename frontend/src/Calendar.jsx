import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import {
  Box,
  CircularProgress,
  Typography,
  Modal,
  TextField,
  Button,
} from "@mui/material";

export default function ECalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    classInfo: "",
  });

  // Load events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/event/events", {
          withCredentials: true,
        });
        const calendarEvents = response.data.events.map((event) => ({
          title: event.title,
          start: event.startDate,
          end: event.endDate,
          extendedProps: {
            description: event.description,
            classInfo: event.classInfo,
            createdBy: event.createdBy?.username,
          },
        }));
        setEvents(calendarEvents);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events. Please try again later.");
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // When a date is clicked
  const handleDateClick = (arg) => {
    setFormData((prev) => ({
      ...prev,
      startDate: arg.dateStr,
      endDate: arg.dateStr,
    }));
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/events",
        formData,
        {
          withCredentials: true,
        }
      );
      setEvents((prev) => [
        ...prev,
        {
          title: formData.title,
          start: formData.startDate,
          end: formData.endDate,
          extendedProps: {
            description: formData.description,
            classInfo: formData.classInfo,
          },
        },
      ]);
      setModalOpen(false);
      setFormData({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        classInfo: "",
      });
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  if (loading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <div className="p-6">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        dateClick={handleDateClick}
        eventClick={(info) => {
          alert(
            `Event: ${info.event.title}\n${info.event.extendedProps.description}`
          );
        }}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>
            Add Event
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              name="classInfo"
              label="Class Info"
              value={formData.classInfo}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              name="endDate"
              label="End Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.endDate}
              onChange={handleInputChange}
            />
            <Button
              variant="contained"
              style={{ backgroundColor: "#FB923C" }}
              type="submit"
              fullWidth
            >
              Add Event
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
