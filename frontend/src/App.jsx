import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import PdfForm from "./PdfForm";
import GetPdfs from "./GetPdfs";
import StudentLandingPage from "./StudentLandingPage";
import TeacherLandingPage from "./TeacherLandingPage";
import TeacherHome from "./TeacherHome";
import StudentHome from "./StudentHome";
import CodeEditor from "./CodeEditor";
import UserAuth from "./UserAuth";
import Calendar from "./Calendar";
import Canteen from "./Canteen";
import Railway from "./Railway";
import HomeChat from "./HomeChat";
import VideoCallHome from "./VideoCallHome";
import VideocallRoom from "./VideocallRoom";
import VideoLectures from "./videopart/VideoLectures";
import TeacherChatPage from "./ChatSocket/TeacherChatPage";
import StudentChatPage from "./ChatSocket/StudentChatPage";
import "./App.css";

function App() {
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyCookie = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8080/auth/verify-cookie",
          { withCredentials: true }
        );
        console.log("API response:", data);
        if (data.status) {
          setRole(data.role);
          setUsername(data.user);

          console.log(data);
          /*Agar hum dashboard pe nahi honge tohi dashboard pe navigate karo, kyuki agar already dashboard pe honge and ab dashboard se nested routing pe jana honga toh iske karan hum forcefully dashboard pe hi atke padenge */
          if (
            !location.pathname.startsWith("/dashboard") &&
            !location.pathname.startsWith("/videocall") &&
            !location.pathname.startsWith("/videocall/room/")
          ) {
            navigate("/dashboard");
          }
        } else {
          if (
            !location.pathname.startsWith("/auth") &&
            !location.pathname.startsWith("/videocall/room/")
          ) {
            navigate("/auth");
          }
        }
      } catch (err) {
        console.error("Error verifying cookie:", err);
        if (
          !location.pathname.startsWith("/auth") &&
          !location.pathname.startsWith("/videocall/room/")
        ) {
          navigate("/auth");
        }
      }
      setLoading(false);
    };

    verifyCookie();
  }, [navigate]);

  const Logout = async () => {
    try {
      await axios.post(
        "http://localhost:8080/auth/logout",
        {},
        { withCredentials: true }
      );
      setRole(null);
      setUsername(null);
      navigate("/auth");
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/auth" element={<UserAuth />} />
      <Route path="/videocall/room/:id" element={<VideocallRoom />} />
      <Route path="/videocall" element={<VideoCallHome />} />
      {role === "teacher" ? (
        <>
          <Route
            path="/dashboard"
            element={
              <TeacherLandingPage username={username} onLogout={Logout} />
            }
          >
            <Route
              index
              element={<TeacherHome username={username} onLogout={Logout} />}
            />
            <Route path="pdfForm" element={<PdfForm username={username} />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="videoLectures" element={<VideoLectures />} />
            <Route path="chat" element={<TeacherChatPage username={username} />} />
          </Route>
        </>
      ) : role === "student" ? (
        <>
          <Route
            path="/dashboard"
            element={
              <StudentLandingPage username={username} onLogout={Logout} />
            }
          >
            <Route
              index
              element={<StudentHome username={username} onLogout={Logout} />}
            />
            <Route path="getPdfs" element={<GetPdfs />} />
            <Route path="codeEditor" element={<CodeEditor />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="canteen" element={<Canteen />} />
            <Route path="railway" element={<Railway />} />
            <Route path="chatbot" element={<HomeChat />} />
            <Route path="videoLectures" element={<VideoLectures />} />
            <Route path="chat" element={<StudentChatPage username={username} />} />
          </Route>
        </>
      ) : null}
    </Routes>
  );
}

export default App;