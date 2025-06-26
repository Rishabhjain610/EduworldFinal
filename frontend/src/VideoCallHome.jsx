import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const VideoCallHome = () => {
  const [roomId, setRoomId] = React.useState("");
  const navigate = useNavigate();
  const handleJoin = () => {
    navigate(`/videocall/room/${roomId}`);
  };
  return (
    <div className="bg-gray-50 text-black min-h-screen flex flex-col items-center justify-center space-y-4">
      <input
        type="text"
        placeholder="Enter Room Id"
        className="p-2 rounded-md border border-black bg-neutral-200 text-black focus:outline-none focus:ring-2 focus:ring-black"
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button className="px-4 py-2 bg-orange-400 text-white rounded-md hover:bg-orange-450 " onClick={handleJoin}>
        Join Now
      </button>
    </div>
  );
};

export default VideoCallHome;
