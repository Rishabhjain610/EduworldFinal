const ChatRoom = require("../Models/Chat.model");
const DirectMessage = require("../Models/Message.model");

// Store online users
let onlineUsers = new Map();

// Handle user connection
const handleConnection = (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Send current online users to new connection
  socket.emit('onlineUsers', Array.from(onlineUsers.values()));
};

// Handle user authentication
const handleAuthenticate = (socket, data, io) => {
  const { username, role } = data;
  socket.username = username;
  socket.role = role;
  
  // Add to online users
  onlineUsers.set(socket.id, { username, role, socketId: socket.id });
  
  // Broadcast updated online users list
  io.emit('onlineUsers', Array.from(onlineUsers.values()));
  
  console.log(`User authenticated: ${username} (${role})`);
};

// Handle user joining a room
const handleJoinRoom = async (socket, data, io) => {
  try {
    const { roomId, username, role } = data;
    
    socket.join(roomId);
    socket.username = username;
    socket.role = role;
    socket.roomId = roomId;

    // Add user to online users
    onlineUsers.set(socket.id, { username, role, socketId: socket.id });
    
    // Broadcast updated online users list
    io.emit('onlineUsers', Array.from(onlineUsers.values()));

    const room = await ChatRoom.findById(roomId);
    if (room) {
      const existingParticipant = room.participants.find(
        p => p.username === username
      );

      if (!existingParticipant) {
        room.participants.push({ username, role, joinedAt: new Date() });
        await room.save();
      }
    }

    socket.to(roomId).emit("userJoined", {
      username,
      role,
      message: `${username} (${role}) joined the chat`,
      timestamp: new Date()
    });

    socket.emit("roomJoined", {
      roomId,
      participants: room?.participants || []
    });

    console.log(`${username} joined room: ${roomId}`);
    return { success: true };
  } catch (error) {
    console.error("Join room error:", error);
    socket.emit("error", { message: "Failed to join room" });
    return { success: false, error: error.message };
  }
};

// Handle sending direct messages
const handleSendDirectMessage = async (socket, data, io) => {
  try {
    const { to, toRole, from, fromRole, content, messageType = "text", emoji, imageUrl } = data;
    
    // Find recipient socket
    const recipientSocket = Array.from(onlineUsers.entries())
      .find(([socketId, user]) => user.username === to);

    const newMessage = {
      from,
      fromRole,
      to,
      toRole,
      content,
      messageType,
      emoji,
      imageUrl,
      timestamp: new Date()
    };

    // Save to database
    try {
      const directMessage = new DirectMessage(newMessage);
      await directMessage.save();
      newMessage._id = directMessage._id;
    } catch (dbError) {
      console.error("Error saving direct message:", dbError);
      newMessage._id = Date.now() + Math.random();
    }

    // Send to recipient if online
    if (recipientSocket) {
      io.to(recipientSocket[0]).emit('directMessage', newMessage);
    }

    // Send back to sender for confirmation
    socket.emit('directMessage', newMessage);

    console.log(`Direct message sent from ${from} to ${to}`);
    return { success: true, message: newMessage };
  } catch (error) {
    console.error("Send direct message error:", error);
    socket.emit("error", { message: "Failed to send direct message" });
    return { success: false, error: error.message };
  }
};

// Handle sending text messages in rooms
const handleSendMessage = async (socket, data, io) => {
  try {
    const { roomId, content, messageType = "text" } = data;
    
    if (!socket.username || !socket.role) {
      socket.emit("error", { message: "User not authenticated" });
      return { success: false, error: "User not authenticated" };
    }

    const room = await ChatRoom.findById(roomId);
    if (!room) {
      socket.emit("error", { message: "Room not found" });
      return { success: false, error: "Room not found" };
    }

    const newMessage = {
      sender: socket.username,
      senderRole: socket.role,
      content,
      messageType,
      timestamp: new Date()
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
      timestamp: savedMessage.timestamp
    });

    console.log(`Message sent in room ${roomId} by ${socket.username}`);
    return { success: true, message: savedMessage };
  } catch (error) {
    console.error("Send message error:", error);
    socket.emit("error", { message: "Failed to send message" });
    return { success: false, error: error.message };
  }
};

// Handle sending emojis
const handleSendEmoji = async (socket, data, io) => {
  try {
    const { roomId, emoji } = data;
    
    if (!socket.username || !socket.role) {
      socket.emit("error", { message: "User not authenticated" });
      return { success: false, error: "User not authenticated" };
    }

    const room = await ChatRoom.findById(roomId);
    if (!room) {
      socket.emit("error", { message: "Room not found" });
      return { success: false, error: "Room not found" };
    }

    const newMessage = {
      sender: socket.username,
      senderRole: socket.role,
      emoji,
      messageType: "emoji",
      timestamp: new Date()
    };

    room.messages.push(newMessage);
    await room.save();

    const savedMessage = room.messages[room.messages.length - 1];

    io.to(roomId).emit("newMessage", {
      _id: savedMessage._id,
      sender: socket.username,
      senderRole: socket.role,
      emoji,
      messageType: "emoji",
      timestamp: savedMessage.timestamp
    });

    console.log(`Emoji sent in room ${roomId} by ${socket.username}`);
    return { success: true, message: savedMessage };
  } catch (error) {
    console.error("Send emoji error:", error);
    socket.emit("error", { message: "Failed to send emoji" });
    return { success: false, error: error.message };
  }
};

// Handle sending images
const handleSendImage = async (socket, data, io) => {
  try {
    const { roomId, imageUrl } = data;
    
    if (!socket.username || !socket.role) {
      socket.emit("error", { message: "User not authenticated" });
      return { success: false, error: "User not authenticated" };
    }

    const room = await ChatRoom.findById(roomId);
    if (!room) {
      socket.emit("error", { message: "Room not found" });
      return { success: false, error: "Room not found" };
    }

    const newMessage = {
      sender: socket.username,
      senderRole: socket.role,
      imageUrl,
      messageType: "image",
      timestamp: new Date()
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
      timestamp: savedMessage.timestamp
    });

    console.log(`Image sent in room ${roomId} by ${socket.username}`);
    return { success: true, message: savedMessage };
  } catch (error) {
    console.error("Send image error:", error);
    socket.emit("error", { message: "Failed to send image" });
    return { success: false, error: error.message };
  }
};

// Handle typing indicators
const handleTyping = (socket, data) => {
  if (data.roomId) {
    socket.to(data.roomId).emit("userTyping", {
      username: socket.username,
      isTyping: true
    });
  }
};

const handleStopTyping = (socket, data) => {
  if (data.roomId) {
    socket.to(data.roomId).emit("userTyping", {
      username: socket.username,
      isTyping: false
    });
  }
};

// Handle user leaving room
const handleLeaveRoom = async (socket, data) => {
  try {
    const { roomId } = data;
    
    if (socket.roomId && socket.username) {
      socket.leave(roomId);
      
      socket.to(roomId).emit("userLeft", {
        username: socket.username,
        message: `${socket.username} left the chat`,
        timestamp: new Date()
      });
      
      socket.roomId = null;
      console.log(`${socket.username} left room: ${roomId}`);
      return { success: true };
    }
  } catch (error) {
    console.error("Leave room error:", error);
    return { success: false, error: error.message };
  }
};

// Handle user disconnection
const handleDisconnect = (socket, io) => {
  if (socket.roomId && socket.username) {
    socket.to(socket.roomId).emit("userLeft", {
      username: socket.username,
      message: `${socket.username} disconnected`,
      timestamp: new Date()
    });
  }
  
  // Remove from online users
  onlineUsers.delete(socket.id);
  
  // Broadcast updated online users list
  io.emit('onlineUsers', Array.from(onlineUsers.values()));
  
  console.log(`User disconnected: ${socket.id} (${socket.username || 'Anonymous'})`);
};

// Get online users
const getOnlineUsers = () => {
  return Array.from(onlineUsers.values());
};

module.exports = {
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
  getOnlineUsers
};