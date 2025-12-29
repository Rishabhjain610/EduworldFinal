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
  Grid,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthDataContext } from "./AuthContext.jsx";
export default function ECalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { serverUrl } = useContext(AuthDataContext);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    classInfo: "",
  });

  // Load events and user role from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user role first
        const userResponse = await axios.get(`${serverUrl}/auth/verify-cookie`, {
          withCredentials: true,
        });
        setUserRole(userResponse.data.role);

        // Fetch events
        const eventsResponse = await axios.get(`${serverUrl}/api/event/events`, {
          withCredentials: true,
        });
        const calendarEvents = eventsResponse.data.events.map((event) => ({
          id: event._id,
          title: event.title,
          start: event.startDate,
          end: event.endDate,
          extendedProps: {
            subject: event.subject,
            description: event.description,
            classInfo: event.classInfo,
            createdBy: event.createdBy?.username || "Unknown",
          },
        }));
        setEvents(calendarEvents);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load calendar. Please try again later.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // When a date is clicked - only allow teachers to add events
  const handleDateClick = (arg) => {
    if (userRole === "teacher") {
      const clickedDate = arg.dateStr;
      setFormData({
        title: "",
        subject: "",
        description: "",
        startDate: clickedDate,
        startTime: "09:00",
        endDate: clickedDate,
        endTime: "10:00",
        classInfo: "",
      });
      setEditMode(false);
      setSelectedEventId(null);
      setModalOpen(true);
    } else {
      toast.warning("Only teachers can add events to the calendar.");
    }
  };

  // Handle event click for viewing/editing
  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setAnchorEl(info.jsEvent.currentTarget);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEvent(null);
  };

  // Handle edit event
  const handleEditEvent = async () => {
    if (!selectedEvent) return;
    
    try {
      const response = await axios.get(
        `${serverUrl}/api/event/events/${selectedEvent.id}`,
        { withCredentials: true }
      );
      
      const event = response.data.event;
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      
      setFormData({
        title: event.title,
        subject: event.subject,
        description: event.description,
        startDate: startDate.toISOString().split('T')[0],
        startTime: startDate.toTimeString().slice(0, 5),
        endDate: endDate.toISOString().split('T')[0],
        endTime: endDate.toTimeString().slice(0, 5),
        classInfo: event.classInfo,
      });
      
      setEditMode(true);
      setSelectedEventId(selectedEvent.id);
      setModalOpen(true);
      handleMenuClose();
    } catch (error) {
      console.error("Error fetching event:", error);
      toast.error("Failed to load event data.");
    }
  };

  // Handle delete event
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(
          `${serverUrl}/api/event/events/${selectedEvent.id}`,
          { withCredentials: true }
        );
        
        setEvents(events.filter(event => event.id !== selectedEvent.id));
        toast.success("Event deleted successfully!");
        handleMenuClose();
      } catch (error) {
        console.error("Error deleting event:", error);
        toast.error("Failed to delete event.");
      }
    }
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
      // Combine date and time for start and end
      const startDateTime = `${formData.startDate}T${formData.startTime}:00`;
      const endDateTime = `${formData.endDate}T${formData.endTime}:00`;

      const eventData = {
        title: formData.title,
        subject: formData.subject,
        description: formData.description,
        startDate: startDateTime,
        endDate: endDateTime,
        classInfo: formData.classInfo,
      };

      let response;
      if (editMode && selectedEventId) {
        // Update existing event
        response = await axios.put(
          `${serverUrl}/api/event/events/${selectedEventId}`,
          eventData,
          { withCredentials: true }
        );
        
        // Update event in calendar
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event.id === selectedEventId 
              ? {
                  ...event,
                  title: formData.title,
                  start: startDateTime,
                  end: endDateTime,
                  extendedProps: {
                    ...event.extendedProps,
                    subject: formData.subject,
                    description: formData.description,
                    classInfo: formData.classInfo,
                  },
                }
              : event
          )
        );
        toast.success("Event updated successfully!");
      } else {
        // Create new event
        response = await axios.post(
          `${serverUrl}/api/event/events`,
          eventData,
          { withCredentials: true }
        );

        // Add new event to calendar
        setEvents((prev) => [
          ...prev,
          {
            id: response.data.event._id,
            title: formData.title,
            start: startDateTime,
            end: endDateTime,
            extendedProps: {
              subject: formData.subject,
              description: formData.description,
              classInfo: formData.classInfo,
              createdBy: response.data.event.createdBy?.username || "You",
            },
          },
        ]);
        toast.success("Event created successfully!");
      }
      
      setModalOpen(false);
      setFormData({
        title: "",
        subject: "",
        description: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        classInfo: "",
      });
      setEditMode(false);
      setSelectedEventId(null);
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error(`Failed to ${editMode ? 'update' : 'create'} event. Please try again.`);
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
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        selectable={userRole === "teacher"}
        
        // Time display settings
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        slotDuration="00:30:00"
        
        // Event display format
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short'
        }}
        
        displayEventTime={true}
        dayMaxEvents={3}
        moreLinkText="more"
        eventDisplay="block"
        height="auto"
        contentHeight="600px"
        
        // Custom event rendering with time and subject
        eventContent={(eventInfo) => {
          const start = eventInfo.event.start;
          const end = eventInfo.event.end;
          
          let timeString = "";
          if (start) {
            timeString = start.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            });
            
            if (end && end.getTime() !== start.getTime()) {
              timeString += " - " + end.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
              });
            }
          }
          
          return (
            <div style={{ fontSize: '11px', padding: '2px', cursor: 'pointer' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '1px' }}>
                {eventInfo.event.title}
              </div>
              <div style={{ fontSize: '9px', opacity: 0.9, marginBottom: '1px' }}>
                📚 {eventInfo.event.extendedProps.subject}
              </div>
              <div style={{ fontSize: '9px', opacity: 0.8, marginBottom: '1px' }}>
                🕒 {timeString}
              </div>
              <div style={{ fontSize: '9px', opacity: 0.7 }}>
                🏫 {eventInfo.event.extendedProps.classInfo}
              </div>
            </div>
          );
        }}
      />

      {/* Context Menu for Events */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          const event = selectedEvent;
          const startTime = new Date(event.start).toLocaleString();
          const endTime = event.end ? new Date(event.end).toLocaleString() : "No end time";
          
          alert(
            `📝 Event: ${event.title}\n` +
            `📚 Subject: ${event.extendedProps.subject}\n` +
            `📄 Description: ${event.extendedProps.description || 'No description'}\n` +
            `🏫 Class: ${event.extendedProps.classInfo}\n` +
            `🕒 Start: ${startTime}\n` +
            `🕒 End: ${endTime}\n` +
            `👤 Created by: ${event.extendedProps.createdBy}`
          );
          handleMenuClose();
        }}>
          📋 View Details
        </MenuItem>
        {userRole === "teacher" && (
          <>
            <MenuItem onClick={handleEditEvent}>
              <EditIcon fontSize="small" style={{ marginRight: 8 }} />
              Edit Event
            </MenuItem>
            <MenuItem onClick={handleDeleteEvent} style={{ color: 'red' }}>
              <DeleteIcon fontSize="small" style={{ marginRight: 8 }} />
              Delete Event
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Modal for Add/Edit Event */}
      {userRole === "teacher" && (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 500,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            <Typography variant="h6" mb={2}>
              {editMode ? "Edit Event" : "Add Event"}
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                name="title"
                label="Event Title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              
              <TextField
                fullWidth
                margin="normal"
                name="subject"
                label="Subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                placeholder="e.g., Mathematics, Physics, Chemistry"
              />
              
              <TextField
                fullWidth
                margin="normal"
                name="description"
                label="Description"
                multiline
                rows={2}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Optional event description"
              />
              
              <TextField
                fullWidth
                margin="normal"
                name="classInfo"
                label="Class/Section"
                value={formData.classInfo}
                onChange={handleInputChange}
                required
                placeholder="e.g., Grade 10-A, BSc-CS-2nd"
              />

              {/* Date and Time Grid */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    name="startDate"
                    label="Start Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    name="startTime"
                    label="Start Time"
                    type="time"
                    InputLabelProps={{ shrink: true }}
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    name="endDate"
                    label="End Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    name="endTime"
                    label="End Time"
                    type="time"
                    InputLabelProps={{ shrink: true }}
                    value={formData.endTime}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setModalOpen(false);
                    setEditMode(false);
                    setSelectedEventId(null);
                  }}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#FB923C" }}
                  type="submit"
                  fullWidth
                >
                  {editMode ? "Update Event" : "Add Event"}
                </Button>
              </Box>
            </form>
          </Box>
        </Modal>
      )}
    </div>
  );
}