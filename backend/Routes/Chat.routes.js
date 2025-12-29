const express = require("express");
const Chatrouter = express.Router();
const ChatRoom = require("../Models/Chat.model");
const cloudinary = require("cloudinary").v2;
const DirectMessage = require("../Models/Message.model");
const {
  getOnlineUsers,
  summarizeChat,
} = require("../Controllers/Chat.controller");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ... (multer configuration remains the same)
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Multer configuration for local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads/chat-images");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "chat-" + uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// ... (all existing routes for rooms, messages, and users remain the same)
Chatrouter.get("/rooms", async (req, res) => {
  try {
    const rooms = await ChatRoom.find()
      .select("roomName participants createdAt")
      .sort({ createdAt: -1 });
    res.json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch rooms" });
  }
});
Chatrouter.post("/rooms", async (req, res) => {
  try {
    const { roomName, username, role } = req.body;
    if (!roomName || !username || !role) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Room name, username, and role are required",
        });
    }
    const existingRoom = await ChatRoom.findOne({
      roomName: { $regex: new RegExp(`^${roomName}$`, "i") },
    });
    if (existingRoom) {
      return res
        .status(400)
        .json({ success: false, message: "Room name already exists" });
    }
    const newRoom = new ChatRoom({
      roomName,
      participants: [{ username, role, joinedAt: new Date() }],
      messages: [],
    });
    await newRoom.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Room created successfully",
        room: {
          _id: newRoom._id,
          roomName: newRoom.roomName,
          participants: newRoom.participants,
          createdAt: newRoom.createdAt,
        },
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create room" });
  }
});
Chatrouter.post("/rooms/:roomId/join", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { username, role } = req.body;
    if (!username || !role) {
      return res
        .status(400)
        .json({ success: false, message: "Username and role are required" });
    }
    const room = await ChatRoom.findById(roomId);
    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }
    const existingParticipant = room.participants.find(
      (p) => p.username === username
    );
    if (!existingParticipant) {
      room.participants.push({ username, role, joinedAt: new Date() });
      await room.save();
    }
    res.json({
      success: true,
      message: "Joined room successfully",
      room: {
        _id: room._id,
        roomName: room.roomName,
        participants: room.participants,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to join room" });
  }
});
Chatrouter.get("/rooms/:roomId/messages", async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await ChatRoom.findById(roomId).select("messages");
    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }
    res.json({ success: true, messages: room.messages || [] });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch messages" });
  }
});
Chatrouter.get("/direct-messages/:user1/:user2", async (req, res) => {
  try {
    const { user1, user2 } = req.params;
    const messages = await DirectMessage.find({
      $or: [
        { from: user1, to: user2 },
        { from: user2, to: user1 },
      ],
    }).sort({ timestamp: 1 });
    res.json({
      success: true,
      messages: messages.map((msg) => ({
        _id: msg._id,
        sender: msg.from,
        senderRole: msg.fromRole,
        content: msg.content,
        messageType: msg.messageType,
        imageUrl: msg.imageUrl,
        timestamp: msg.timestamp,
        isDirect: true,
      })),
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch direct messages" });
  }
});
Chatrouter.get("/online-users", (req, res) => {
  try {
    const users = getOnlineUsers();
    res.json({ success: true, users });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch online users" });
  }
});
// Chatrouter.post("/upload-image", upload.single("chatImage"), (req, res) => {
//   try {
//     if (!req.file) {
//       return res
//         .status(400)
//         .json({ success: false, message: "No file uploaded" });
//     }
//     const imageUrl = `/uploads/chat-images/${req.file.filename}`;
//     res.json({
//       success: true,
//       message: "Image uploaded successfully",
//       imageUrl,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Failed to upload image" });
//   }
// // });
Chatrouter.post("/upload-image", upload.single("chatImage"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Upload image to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "chat-images", // Cloudinary folder
    });

    // Delete the local file after successful upload
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Error deleting local file:", err);
      }
    });

    res.json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: cloudinaryResult.secure_url, // Cloudinary URL
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ success: false, message: "Failed to upload image" });
  }
});

// NEW: Route for AI chat summarization
Chatrouter.post("/summarize", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || messages.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No messages to summarize." });
    }
    const summary = await summarizeChat(messages);
    res.json({ success: true, summary });
  } catch (error) {
    console.error("Summarize chat error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate summary." });
  }
});

module.exports = Chatrouter;
