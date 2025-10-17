import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Image,
  Smile,
  Users,
  X,
  Plus,
  Search,
  MoreVertical,
  ArrowLeft,
  CheckCheck,
  Sparkles,
  LoaderCircle,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";

const Chat = ({ username = "Anonymous", role = "student" }) => {
  const [socket, setSocket] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("groups");
  const [isConnected, setIsConnected] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryContent, setSummaryContent] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const API_BASE_URL = "http://localhost:8080/api";

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setShowSidebar(window.innerWidth >= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const newSocket = io("http://localhost:8080", {
      transports: ["websocket"],
    });
    setSocket(newSocket);
    newSocket.on("connect", () => {
      setIsConnected(true);
      newSocket.emit("authenticate", { username, role });
    });
    newSocket.on("disconnect", () => setIsConnected(false));
    newSocket.on("newMessage", (msg) => setMessages((prev) => [...prev, msg]));
    newSocket.on("userTyping", (data) => {
      setTypingUsers((prev) =>
        data.isTyping
          ? [...prev.filter((u) => u !== data.username), data.username]
          : prev.filter((u) => u !== data.username)
      );
    });
    newSocket.on("roomJoined", (data) =>
      setParticipants(data.participants || [])
    );
    newSocket.on("onlineUsers", (users) => {
      const uniqueUsers = users.filter(
        (user, index, self) =>
          user.username !== username &&
          index === self.findIndex((u) => u.username === user.username)
      );
      setOnlineUsers(uniqueUsers);
    });
    newSocket.on("directMessage", (message) => {
      if (
        currentChatUser &&
        (message.from === currentChatUser.username ||
          message.to === currentChatUser.username)
      ) {
        setMessages((prev) => [
          ...prev,
          {
            _id: message._id || Date.now(),
            sender: message.from,
            senderRole: message.fromRole,
            content: message.content,
            messageType: message.messageType || "text",
            imageUrl: message.imageUrl,
            timestamp: message.timestamp,
            isDirect: true,
          },
        ]);
      }
    });
    fetchRooms();
    fetchOnlineUsers();
    return () => newSocket.close();
  }, [username, role, currentChatUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  const getRoleColor = (userRole) =>
    userRole === "teacher"
      ? "from-orange-500 to-red-500"
      : "from-orange-400 to-yellow-500";
  const getRoleBadge = (userRole) =>
    userRole === "teacher"
      ? "bg-orange-100 text-orange-800"
      : "bg-yellow-100 text-yellow-800";

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/chat/rooms`);
      const data = await res.json();
      if (data.success) setRooms(data.rooms);
    } catch (e) {
      console.error("Error fetching rooms:", e);
    }
  };
  const fetchOnlineUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/chat/online-users`);
      const data = await res.json();
      if (data.success) {
        const uniqueUsers = data.users.filter(
          (user, index, self) =>
            user.username !== username &&
            index === self.findIndex((u) => u.username === user.username)
        );
        setOnlineUsers(uniqueUsers);
      }
    } catch (e) {
      console.error("Error fetching online users:", e);
    }
  };

  const createRoom = async () => {
    if (!newRoomName.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/chat/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomName: newRoomName, username, role }),
      });
      const data = await res.json();
      if (data.success) {
        setNewRoomName("");
        setShowCreateRoom(false);
        fetchRooms();
        joinRoom(data.room._id);
      }
    } catch (e) {
      console.error("Error creating room:", e);
    }
  };
  const joinRoom = async (roomId) => {
    if (currentRoom === roomId) return;
    try {
      if (currentRoom && socket)
        socket.emit("leaveRoom", { roomId: currentRoom });
      setCurrentChatUser(null);
      const res = await fetch(`${API_BASE_URL}/chat/rooms/${roomId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, role }),
      });
      if (res.ok) {
        setCurrentRoom(roomId);
        socket.emit("joinRoom", { roomId, username, role });
        const msgsRes = await fetch(
          `${API_BASE_URL}/chat/rooms/${roomId}/messages`
        );
        const msgsData = await msgsRes.json();
        if (msgsData.success) setMessages(msgsData.messages);
        if (isMobile) setShowSidebar(false);
      }
    } catch (e) {
      console.error("Error joining room:", e);
    }
  };
  const startDirectChat = async (user) => {
    if (currentRoom && socket) {
      socket.emit("leaveRoom", { roomId: currentRoom });
      setCurrentRoom(null);
    }
    setCurrentChatUser(user);
    try {
      const res = await fetch(
        `${API_BASE_URL}/chat/direct-messages/${username}/${user.username}`
      );
      const data = await res.json();
      if (data.success) setMessages(data.messages);
    } catch (e) {
      setMessages([]);
    }
    if (isMobile) setShowSidebar(false);
  };

  const sendMessage = () => {
    if (!messageInput.trim() || !socket) return;
    const payload = { content: messageInput.trim(), messageType: "text" };
    if (currentChatUser)
      socket.emit("sendDirectMessage", {
        ...payload,
        to: currentChatUser.username,
        toRole: currentChatUser.role,
        from: username,
        fromRole: role,
      });
    else if (currentRoom)
      socket.emit("sendMessage", { ...payload, roomId: currentRoom });
    setMessageInput("");
    if (socket && currentRoom)
      socket.emit("stopTyping", { roomId: currentRoom });
  };

  const onEmojiClick = (emojiData) =>
    setMessageInput((prev) => prev + emojiData.emoji);
  const sendImage = async (file) => {
    if (!file || !socket) return;
    const formData = new FormData();
    formData.append("chatImage", file);
    try {
      const res = await fetch(`${API_BASE_URL}/chat/upload-image`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        const payload = { imageUrl: data.imageUrl, messageType: "image" };
        if (currentChatUser)
          socket.emit("sendDirectMessage", {
            ...payload,
            to: currentChatUser.username,
            toRole: currentChatUser.role,
            from: username,
            fromRole: role,
          });
        else if (currentRoom)
          socket.emit("sendImage", { ...payload, roomId: currentRoom });
      }
    } catch (e) {
      console.error("Error uploading image:", e);
    }
  };
  const handleTyping = () => {
    if (!socket || !currentRoom) return;
    socket.emit("typing", { roomId: currentRoom });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(
      () => socket.emit("stopTyping", { roomId: currentRoom }),
      1000
    );
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  const handleFileInput = (e) => {
    if (e.target.files[0]) {
      sendImage(e.target.files[0]);
      e.target.value = "";
    }
  };
  const closeMobileChat = () => {
    setShowSidebar(true);
    setCurrentRoom(null);
    setCurrentChatUser(null);
    setMessages([]);
  };

  const handleSummarizeChat = async () => {
    if (messages.length === 0)
      return alert("There's nothing to summarize yet!");
    setIsSummarizing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/chat/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });
      const data = await res.json();
      if (data.success) {
        setSummaryContent(data.summary);
        setShowSummaryModal(true);
      } else alert(data.message || "Failed to get summary.");
    } catch (e) {
      alert("An error occurred while generating the summary.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const filteredRooms = rooms.filter((room) =>
    room.roomName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredUsers = onlineUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
      ((role === "teacher" && user.role === "student") ||
        (role === "student" && user.role === "teacher"))
  );

  return (
    <div className="h-screen w-full bg-gray-50 flex overflow-hidden">
      <div
        className={`${showSidebar ? "flex" : "hidden"} ${
          isMobile ? "w-full absolute inset-0 z-10" : "w-80"
        } md:flex flex-col bg-white border-r border-orange-200 shadow-lg`}
      >
        <div className="p-4 border-b border-orange-200 bg-orange-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold shadow-md bg-gradient-to-br ${getRoleColor(
                  role
                )}`}
              >
                {username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">{username}</h3>
                <span className="text-xs flex items-center gap-1 text-orange-100">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isConnected ? "bg-green-400" : "bg-red-400"
                    }`}
                  ></div>
                  {role} • {isConnected ? "Online" : "Offline"}
                </span>
              </div>
            </div>
            {role === "teacher" && (
              <button
                onClick={() => setShowCreateRoom(true)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors text-white"
                title="Create Group"
              >
                <Plus size={20} />
              </button>
            )}
          </div>
          <div className="relative">
            <Search
              className="absolute left-3 top-2.5 text-orange-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-white border-opacity-30 rounded-lg bg-white bg-opacity-20 text-white placeholder-orange-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            />
          </div>
          <div className="flex mt-4 bg-white bg-opacity-20 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("groups")}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                activeTab === "groups"
                  ? "bg-white text-orange-500 shadow-sm"
                  : "text-orange-500"
              }`}
            >
              Groups
            </button>
            <button
              onClick={() => setActiveTab("direct")}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                activeTab === "direct"
                  ? "bg-white text-orange-500 shadow-sm"
                  : "text-orange-500"
              }`}
            >
              {role === "teacher" ? "Students" : "Teachers"}
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {activeTab === "groups" ? (
            <div className="p-2">
              {filteredRooms.length > 0 ? (
                filteredRooms.map((room) => (
                  <motion.div
                    key={room._id}
                    whileHover={{ backgroundColor: "#fff7ed" }}
                    className={`p-3 rounded-lg cursor-pointer mb-1 ${
                      currentRoom === room._id
                        ? "bg-orange-50 border-l-4 border-orange-500"
                        : ""
                    }`}
                    onClick={() => joinRoom(room._id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                        <Users size={20} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate text-gray-800">
                          {room.roomName}
                        </h4>
                        <p className="text-sm text-orange-600 truncate">
                          {room.participants?.length || 0} participants
                        </p>
                      </div>
                      <div className="text-xs text-orange-400">
                        {new Date(room.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-orange-500">
                  <Users size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No groups found</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-2">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <motion.div
                    key={`${user.username}-${index}`}
                    whileHover={{ backgroundColor: "#fff7ed" }}
                    className={`p-3 rounded-lg cursor-pointer mb-1 ${
                      currentChatUser?.username === user.username
                        ? "bg-orange-50 border-l-4 border-orange-500"
                        : ""
                    }`}
                    onClick={() => startDirectChat(user)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold bg-gradient-to-br ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate text-gray-800">
                          {user.username}
                        </h4>
                        <p className="text-sm truncate">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${getRoleBadge(
                              user.role
                            )}`}
                          >
                            {user.role}
                          </span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-orange-500">
                  <Users size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No users online</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div
        className={`${
          !showSidebar || !isMobile ? "flex" : "hidden"
        } flex-1 flex-col min-w-0`}
      >
        {currentRoom || currentChatUser ? (
          <>
            <div className="bg-white border-b border-orange-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isMobile && (
                    <button
                      onClick={closeMobileChat}
                      className="p-2 hover:bg-orange-100 rounded-full mr-2"
                    >
                      <ArrowLeft size={20} />
                    </button>
                  )}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                      currentChatUser
                        ? `bg-gradient-to-br ${getRoleColor(
                            currentChatUser.role
                          )}`
                        : "bg-gradient-to-r from-orange-500 to-orange-600"
                    }`}
                  >
                    {currentChatUser ? (
                      currentChatUser.username.charAt(0).toUpperCase()
                    ) : (
                      <Users size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {currentChatUser
                        ? currentChatUser.username
                        : rooms.find((r) => r._id === currentRoom)?.roomName}
                    </h3>
                    <p className="text-sm text-orange-600 flex items-center gap-1">
                      {currentChatUser ? (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          {currentChatUser.role} • Online
                        </>
                      ) : (
                        `${participants.length} participants`
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSummarizeChat}
                    disabled={isSummarizing}
                    className="p-2 hover:bg-orange-100 rounded-full text-orange-600 disabled:opacity-50"
                    title="Summarize Chat"
                  >
                    {isSummarizing ? (
                      <LoaderCircle size={20} className="animate-spin" />
                    ) : (
                      <Sparkles size={20} />
                    )}
                  </button>
                  <button className="p-2 hover:bg-orange-100 rounded-full">
                    <MoreVertical size={20} className="text-orange-600" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-orange-50 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      message.sender === username
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md ${
                        message.sender === username ? "ml-auto" : "mr-auto"
                      }`}
                    >
                      {message.sender !== username && !currentChatUser && (
                        <div className="flex items-center gap-2 mb-1 px-1">
                          <span className="font-semibold text-sm text-gray-700">
                            {message.sender}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadge(
                              message.senderRole
                            )}`}
                          >
                            {message.senderRole}
                          </span>
                        </div>
                      )}
                      <div
                        className={`rounded-2xl p-3 shadow-sm ${
                          message.sender === username
                            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-md"
                            : "bg-white text-gray-800 rounded-bl-md border border-orange-200"
                        }`}
                      >
                        {message.messageType === "text" && (
                          <p className="break-words">{message.content}</p>
                        )}
                        {message.messageType === "image" && (
                          <img
                            src={`http://localhost:8080${message.imageUrl}`}
                            alt="Shared"
                            className="max-w-full h-auto rounded-lg"
                          />
                        )}
                        <div
                          className={`text-xs mt-2 flex items-center gap-1 ${
                            message.sender === username
                              ? "text-orange-100 justify-end"
                              : "text-orange-500"
                          }`}
                        >
                          <span>{formatTime(message.timestamp)}</span>
                          {message.sender === username && (
                            <CheckCheck size={14} className="text-orange-200" />
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {typingUsers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-orange-500 text-sm flex items-center gap-2"
                >
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span>
                    {typingUsers.join(", ")}{" "}
                    {typingUsers.length === 1 ? "is" : "are"} typing...
                  </span>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="bg-white border-t border-orange-200 p-4 shadow-lg">
              <div className="flex items-end gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-orange-600 p-2 hover:bg-orange-100 rounded-full"
                  title="Upload Image"
                >
                  <Image size={20} />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="text-orange-600 p-2 hover:bg-orange-100 rounded-full"
                    title="Add Emoji"
                  >
                    <Smile size={20} />
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute bottom-12 left-0 z-50">
                      <EmojiPicker
                        onEmojiClick={onEmojiClick}
                        width={300}
                        height={400}
                        theme="light"
                        lazyLoadEmojis={true}
                        previewConfig={{ showPreview: false }}
                      />
                    </div>
                  )}
                </div>
                <div className="flex-1 relative">
                  <textarea
                    value={messageInput}
                    onChange={(e) => {
                      setMessageInput(e.target.value);
                      handleTyping();
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="w-full border border-orange-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none min-h-[40px] max-h-32"
                    rows="1"
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!messageInput.trim()}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-2 rounded-full disabled:bg-gray-300"
                  title="Send"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              accept="image/*"
              className="hidden"
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md p-8">
              <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={40} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Welcome to EduWorld Chat
              </h3>
              <p className="text-orange-600 mb-6">
                Select a conversation to begin messaging.
              </p>
            </div>
          </div>
        )}
      </div>
      <AnimatePresence>
        {showCreateRoom && role === "teacher" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Create New Group
                </h3>
                <button
                  onClick={() => setShowCreateRoom(false)}
                  className="p-1 hover:bg-orange-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              <input
                type="text"
                placeholder="Enter group name..."
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && createRoom()}
                className="w-full border border-orange-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={createRoom}
                  disabled={!newRoomName.trim()}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 rounded-lg disabled:bg-gray-300"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreateRoom(false)}
                  className="flex-1 bg-orange-100 text-orange-700 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSummaryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSummaryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Sparkles className="text-orange-500" />
                  AI Chat Summary
                </h3>
                <button
                  onClick={() => setShowSummaryModal(false)}
                  className="p-1 hover:bg-orange-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto pr-2">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {summaryContent}
                </p>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowSummaryModal(false)}
                  className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chat;
