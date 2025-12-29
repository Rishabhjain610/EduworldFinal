const ChatRoom = require("../Models/Chat.model");
const DirectMessage = require("../Models/Message.model");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
let onlineUsers = new Map();

const handleConnection = (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.emit("onlineUsers", Array.from(onlineUsers.values()));
};

const handleAuthenticate = (socket, data, io) => {
  const { username, role } = data;
  socket.username = username;
  socket.role = role;
  onlineUsers.set(socket.id, { username, role, socketId: socket.id });
  io.emit("onlineUsers", Array.from(onlineUsers.values()));
  console.log(`User authenticated: ${username} (${role})`);
};

const handleJoinRoom = async (socket, data, io) => {
  try {
    const { roomId, username, role } = data;
    socket.join(roomId);
    socket.username = username;
    socket.role = role;
    socket.roomId = roomId;
    onlineUsers.set(socket.id, { username, role, socketId: socket.id });
    io.emit("onlineUsers", Array.from(onlineUsers.values()));
    const room = await ChatRoom.findById(roomId);
    if (room) {
      const existingParticipant = room.participants.find(
        (p) => p.username === username
      );
      if (!existingParticipant) {
        room.participants.push({ username, role, joinedAt: new Date() });
        await room.save();
      }
    }
    socket.emit("roomJoined", {
      roomId,
      participants: room?.participants || [],
    });
    console.log(`${username} joined room: ${roomId}`);
    return { success: true };
  } catch (error) {
    console.error("Join room error:", error);
    socket.emit("error", { message: "Failed to join room" });
    return { success: false, error: error.message };
  }
};

const handleSendDirectMessage = async (socket, data, io) => {
  try {
    const {
      to,
      toRole,
      from,
      fromRole,
      content,
      messageType = "text",
      imageUrl,
    } = data;
    const recipientSocket = Array.from(onlineUsers.entries()).find(
      ([socketId, user]) => user.username === to
    );
    const newMessage = {
      from,
      fromRole,
      to,
      toRole,
      content,
      messageType,
      imageUrl,
      timestamp: new Date(),
    };
    const directMessage = new DirectMessage(newMessage);
    await directMessage.save();
    newMessage._id = directMessage._id;
    if (recipientSocket) {
      io.to(recipientSocket[0]).emit("directMessage", newMessage);
    }
    socket.emit("directMessage", newMessage);
    return { success: true, message: newMessage };
  } catch (error) {
    console.error("Send direct message error:", error);
    socket.emit("error", { message: "Failed to send direct message" });
    return { success: false, error: error.message };
  }
};

const handleSendMessage = async (socket, data, io) => {
  try {
    const { roomId, content, messageType = "text" } = data;
    if (!socket.username || !socket.role)
      return { success: false, error: "User not authenticated" };
    const room = await ChatRoom.findById(roomId);
    if (!room) return { success: false, error: "Room not found" };
    const newMessage = {
      sender: socket.username,
      senderRole: socket.role,
      content,
      messageType,
      timestamp: new Date(),
    };
    room.messages.push(newMessage);
    await room.save();
    const savedMessage = room.messages[room.messages.length - 1];
    io.to(roomId).emit("newMessage", {
      _id: savedMessage._id,
      sender: socket.username,
      senderRole: socket.role,
      content,
      messageType,
      timestamp: savedMessage.timestamp,
    });
    return { success: true, message: savedMessage };
  } catch (error) {
    console.error("Send message error:", error);
    socket.emit("error", { message: "Failed to send message" });
    return { success: false, error: error.message };
  }
};

const handleSendImage = async (socket, data, io) => {
  try {
    const { roomId, imageUrl } = data;
    if (!socket.username || !socket.role)
      return { success: false, error: "User not authenticated" };
    const room = await ChatRoom.findById(roomId);
    if (!room) return { success: false, error: "Room not found" };
    const newMessage = {
      sender: socket.username,
      senderRole: socket.role,
      imageUrl,
      messageType: "image",
      timestamp: new Date(),
    };
    room.messages.push(newMessage);
    await room.save();
    const savedMessage = room.messages[room.messages.length - 1];
    io.to(roomId).emit("newMessage", {
      _id: savedMessage._id,
      sender: socket.username,
      senderRole: socket.role,
      imageUrl,
      messageType: "image",
      timestamp: savedMessage.timestamp,
    });
    return { success: true, message: savedMessage };
  } catch (error) {
    console.error("Send image error:", error);
    socket.emit("error", { message: "Failed to send image" });
    return { success: false, error: error.message };
  }
};

const handleTyping = (socket, data) => {
  if (data.roomId) {
    socket
      .to(data.roomId)
      .emit("userTyping", { username: socket.username, isTyping: true });
  }
};
const handleStopTyping = (socket, data) => {
  if (data.roomId) {
    socket
      .to(data.roomId)
      .emit("userTyping", { username: socket.username, isTyping: false });
  }
};
const handleLeaveRoom = async (socket, data) => {
  try {
    const { roomId } = data;
    if (socket.roomId && socket.username) {
      socket.leave(roomId);
      socket.roomId = null;
      return { success: true };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};
const handleDisconnect = (socket, io) => {
  onlineUsers.delete(socket.id);
  io.emit("onlineUsers", Array.from(onlineUsers.values()));
  console.log(
    `User disconnected: ${socket.id} (${socket.username || "Anonymous"})`
  );
};
const getOnlineUsers = () => Array.from(onlineUsers.values());

// NEW: AI Chat Summarizer function
const summarizeChat = async (messages) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const chatTranscript = messages
    .filter((msg) => msg.messageType === "text" && msg.content)
    .map((msg) => `${msg.sender || msg.from}: ${msg.content}`)
    .join("\n");
  if (!chatTranscript) return "There are no text messages to summarize.";
  const prompt = `Please summarize the following chat conversation concisely. Focus on the key topics, questions, and conclusions.\n\nConversation:\n${chatTranscript}`;
  const result = await model.generateContent(prompt);
  console.log("AI Summary Result:", result);
  return result.response.text();
};

module.exports = {
  handleConnection,
  handleAuthenticate,
  handleJoinRoom,
  handleSendMessage,
  handleSendDirectMessage,
  handleSendImage,
  handleTyping,
  handleStopTyping,
  handleLeaveRoom,
  handleDisconnect,
  getOnlineUsers,
  summarizeChat,
};
