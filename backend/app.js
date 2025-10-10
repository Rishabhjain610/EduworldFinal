// // const express = require("express");
// // const mongoose = require("mongoose");
// // const bodyParser = require("body-parser");
// // const dotenv = require("dotenv").config();
// // const PORT = 8080;
// // const cors = require("cors");


// // const authRoute = require("./Routes/AuthRoute");
// // const aiRoutes = require("./Routes/CodeEditorRoute");
// // const cookieParser = require("cookie-parser");
// // const { Event } = require("./Models/calendarModel");


// // const pdfRouter = require("./Routes/pdfRoutes");
// // const eventRouter = require("./Routes/eventsRoute");
// // const orderRouter = require("./Routes/orderRoutes");
// // const VideoLectureRouter = require("./Routes/Video.routes");
// // const cloudinary=require("./Util/Cloudinary");
// // const multer = require("multer");

// // const ConnectDB = require("./DB/Db");


// // const app = express();

// // ConnectDB();

// // app.use(
// //   cors({
// //     origin: ["*","http://localhost:5173","http://localhost:5174"],
// //     credentials: true,
// //     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
// //   })
// // );

// // app.use(cookieParser());
// // app.use(express.json({limit: '50mb'}));
// // app.use(express.urlencoded({ extended: true , limit: '50mb'}));

// // app.use('/uploads', express.static('uploads'));

// // app.use("/auth", authRoute);
// // app.use("/ai", aiRoutes);
// // app.use("/api/pdf", pdfRouter); // Handles /upload-files and /show-pdfs
// // app.use("/api/event", eventRouter); // Handles /events
// // app.use("/api/order", orderRouter);
// // app.use("/api/videos", VideoLectureRouter);



// // app.listen(PORT, () => {
// //   console.log(`listening at port ${PORT}`);
// // });
// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const dotenv = require("dotenv").config();
// const cors = require("cors");
// const http = require("http");
// const socketIo = require("socket.io");
// const path = require("path");
// const cookieParser = require("cookie-parser");

// // Import existing routes
// const authRoute = require("./Routes/AuthRoute");
// const aiRoutes = require("./Routes/CodeEditorRoute");
// const pdfRouter = require("./Routes/pdfRoutes");
// const eventRouter = require("./Routes/eventsRoute");
// const orderRouter = require("./Routes/orderRoutes");
// const VideoLectureRouter = require("./Routes/Video.routes");

// // Import chat routes and socket handler
// const Chatrouter = require("./Routes/Chat.routes"); // Fixed import path
// const chatSocketHandler = require("./Routes/SocketHandler");

// // Import utilities
// const ConnectDB = require("./DB/Db");

// const PORT = process.env.PORT || 8080;

// // Initialize Express app and HTTP server
// const app = express();
// const server = http.createServer(app);

// // Configure Socket.IO with CORS
// const io = socketIo(server, {
//   cors: {
//     origin: [
//       "http://localhost:5173",
//       "http://localhost:5174",
//       process.env.FRONTEND_URL || "http://localhost:5173"
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true
//   }
// });

// // Connect to Database
// ConnectDB();

// // CORS Configuration
// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "http://localhost:5174",
//       process.env.FRONTEND_URL || "http://localhost:5173"
//     ],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   })
// );

// // Middleware
// app.use(cookieParser());
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// // Serve static files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Health check endpoint
// app.get('/health', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'Server is running successfully',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime()
//   });
// });

// // API Routes
// app.use("/auth", authRoute);
// app.use("/ai", aiRoutes);
// app.use("/api/pdf", pdfRouter);
// app.use("/api/event", eventRouter);
// app.use("/api/order", orderRouter);
// app.use("/api/videos", VideoLectureRouter);
// app.use("/api/chat", Chatrouter);

// // Initialize Socket.IO chat handler
// chatSocketHandler(io);

// // Global error handling middleware
// app.use((error, req, res, next) => {
//   console.error('Global Error Handler:', error);
  
//   res.status(error.status || 500).json({
//     success: false,
//     message: error.message || 'Internal server error',
//     ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
//   });
// });

// // Handle 404 routes
// app.use('*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: `Route ${req.originalUrl} not found`
//   });
// });

// // Graceful shutdown handling
// const gracefulShutdown = (signal) => {
//   console.log(`Received ${signal}. Starting graceful shutdown...`);
  
//   server.close(() => {
//     console.log('HTTP server closed');
    
//     mongoose.connection.close(false, () => {
//       console.log('MongoDB connection closed');
//       process.exit(0);
//     });
//   });
  
//   setTimeout(() => {
//     console.log('Could not close connections in time, forcefully shutting down');
//     process.exit(1);
//   }, 10000);
// };

// process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
// process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// process.on('unhandledRejection', (err, promise) => {
//   console.log('Unhandled Promise Rejection:', err.message);
//   server.close(() => {
//     process.exit(1);
//   });
// });

// process.on('uncaughtException', (err) => {
//   console.log('Uncaught Exception:', err.message);
//   process.exit(1);
// });

// // Start server
// server.listen(PORT, () => {
//   console.log(` Server running on port ${PORT}`);
  
// });

// module.exports = { app, server, io };
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const cookieParser = require("cookie-parser");

// Import existing routes
const authRoute = require("./Routes/AuthRoute");
const aiRoutes = require("./Routes/CodeEditorRoute");
const pdfRouter = require("./Routes/pdfRoutes");
const eventRouter = require("./Routes/eventsRoute");
const orderRouter = require("./Routes/orderRoutes");
const VideoLectureRouter = require("./Routes/Video.routes");

// Import chat routes - FIXED
const ChatRouter = require("./Routes/Chat.routes");

// Import socket handlers - FIXED
const {
  handleConnection,
  handleAuthenticate,
  handleJoinRoom,
  handleSendMessage,
  handleSendDirectMessage,
  handleSendEmoji,
  handleSendImage,
  handleTyping,
  handleStopTyping,
  handleLeaveRoom,
  handleDisconnect,
} = require("./Controllers/Chat.controller");

// Import utilities
const ConnectDB = require("./DB/Db");

const PORT = process.env.PORT || 8080;

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Configure Socket.IO with CORS
const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      process.env.FRONTEND_URL || "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// Connect to Database
ConnectDB();

// CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "http://localhost:5174",
      process.env.FRONTEND_URL || "http://localhost:5173"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Middleware
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use("/auth", authRoute);
app.use("/ai", aiRoutes);
app.use("/api/pdf", pdfRouter);
app.use("/api/event", eventRouter);
app.use("/api/order", orderRouter);
app.use("/api/videos", VideoLectureRouter);
app.use("/api/chat", ChatRouter); // This should work now

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);
  
  handleConnection(socket);

  socket.on("authenticate", (data) => {
    handleAuthenticate(socket, data, io);
  });

  socket.on("joinRoom", (data) => {
    handleJoinRoom(socket, data, io);
  });

  socket.on("leaveRoom", (data) => {
    handleLeaveRoom(socket, data);
  });

  socket.on("sendMessage", (data) => {
    handleSendMessage(socket, data, io);
  });

  socket.on("sendDirectMessage", (data) => {
    handleSendDirectMessage(socket, data, io);
  });

  socket.on("sendEmoji", (data) => {
    handleSendEmoji(socket, data, io);
  });

  socket.on("sendImage", (data) => {
    handleSendImage(socket, data, io);
  });

  socket.on("typing", (data) => {
    handleTyping(socket, data);
  });

  socket.on("stopTyping", (data) => {
    handleStopTyping(socket, data);
  });

  socket.on("disconnect", () => {
    handleDisconnect(socket, io);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = { app, server, io };