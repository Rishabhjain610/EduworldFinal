
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const cookieParser = require("cookie-parser");

const authRoute = require("./Routes/AuthRoute");
const aiRoutes = require("./Routes/CodeEditorRoute");
const pdfRouter = require("./Routes/pdfRoutes");
const eventRouter = require("./Routes/eventsRoute");
const orderRouter = require("./Routes/orderRoutes");
const VideoLectureRouter = require("./Routes/Video.routes");
const ChatRouter = require("./Routes/Chat.routes");
// Add this to your app.js after existing routes
const MarksRouter = require("./Routes/Marks.Route");

const {
  handleConnection, handleAuthenticate, handleJoinRoom, handleSendMessage,
  handleSendDirectMessage, handleSendImage, handleTyping, handleStopTyping,
  handleLeaveRoom, handleDisconnect,
} = require("./Controllers/Chat.controller");

const ConnectDB = require("./DB/Db");
const PORT = 8080;
const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:8080", process.env.FRONTEND_URL || "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

ConnectDB();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", process.env.FRONTEND_URL || "http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/auth", authRoute);
app.use("/ai", aiRoutes);
app.use("/api/pdf", pdfRouter);
app.use("/api/event", eventRouter);
app.use("/api/order", orderRouter);
app.use("/api/videos", VideoLectureRouter);
app.use("/api/chat", ChatRouter);
app.use("/api/marks", MarksRouter);

io.on("connection", (socket) => {
  handleConnection(socket);
  socket.on("authenticate", (data) => handleAuthenticate(socket, data, io));
  socket.on("joinRoom", (data) => handleJoinRoom(socket, data, io));
  socket.on("leaveRoom", (data) => handleLeaveRoom(socket, data));
  socket.on("sendMessage", (data) => handleSendMessage(socket, data, io));
  socket.on("sendDirectMessage", (data) => handleSendDirectMessage(socket, data, io));
  socket.on("sendImage", (data) => handleSendImage(socket, data, io));
  socket.on("typing", (data) => handleTyping(socket, data));
  socket.on("stopTyping", (data) => handleStopTyping(socket, data));
  socket.on("disconnect", () => handleDisconnect(socket, io));
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = { app, server, io };