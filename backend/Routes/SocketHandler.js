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
  handleDisconnect
} = require("../Controllers/Socket.controller");

const chatSocketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);
    
    // Handle initial connection
    handleConnection(socket);

    // Authenticate user
    socket.on("authenticate", (data) => {
      handleAuthenticate(socket, data, io);
    });

    // Join a chat room
    socket.on("joinRoom", async (data) => {
      await handleJoinRoom(socket, data, io);
    });

    // Handle text messages in rooms
    socket.on("sendMessage", async (data) => {
      await handleSendMessage(socket, data, io);
    });

    // Handle direct messages
    socket.on("sendDirectMessage", async (data) => {
      await handleSendDirectMessage(socket, data, io);
    });

    // Handle emoji messages
    socket.on("sendEmoji", async (data) => {
      await handleSendEmoji(socket, data, io);
    });

    // Handle image messages
    socket.on("sendImage", async (data) => {
      await handleSendImage(socket, data, io);
    });

    // Handle typing indicators
    socket.on("typing", (data) => {
      handleTyping(socket, data);
    });

    socket.on("stopTyping", (data) => {
      handleStopTyping(socket, data);
    });

    // Handle user leaving room
    socket.on("leaveRoom", async (data) => {
      await handleLeaveRoom(socket, data);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      handleDisconnect(socket, io);
    });

    // Handle errors
    socket.on("error", (error) => {
      console.error(`Socket error for ${socket.id}:`, error);
    });
  });

  // Handle server errors
  io.on("error", (error) => {
    console.error("Socket.IO server error:", error);
  });
};

module.exports = chatSocketHandler;