import React from "react";
import { Link } from "react-router-dom";
import { Routes, Route, useNavigate, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  FileText,
  Users,
  Award,
  BarChart,
  VideoIcon,
  Sparkles,
  NotebookPen,
  FileSpreadsheet,
} from "lucide-react";
import TeacherHome from "./TeacherHome";
import PdfForm from "./PdfForm";
import Language from "./Language.jsx";
import AttendanceSystem from "./Attendance.jsx";

export default function TeacherLandingPage({ username, onLogout }) {
  console.log(username);

  return (
    <>
      <header className="flex items-center justify-between px-4 py-4 mx-auto shadow-md my-1 mx-1 w-full ">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <img
            src="../src/assets/navbarLogo.jpeg"
            alt="Logo"
            className="h-10 w-14 object-cover"
          />
          <span className="font-bold text-2xl">EduWorld</span>
        </Link>
        <nav className="hidden md:flex text-sm items-center space-x-6">
          {/* <Link
            to="attendance"
            className="flex gap-1 relative group text-gray-700 hover:text-black text-sm"
          >
            <NotebookPen />
            Upload Attendance
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-black transform scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100" />
          </Link> */}
          <Link
            to="pdfForm"
            className="flex gap-1 relative group text-gray-700 hover:text-black text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="inline lucide lucide-file-text"
            >
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" />
              <path d="M10 9H8" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
            </svg>
            Upload Notes
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-black transform scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100" />
          </Link>
          {/* <Link
            to="calendar"
            className="relative flex gap-1 group text-gray-700 hover:text-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="inline lucide lucide-calendar"
            >
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <path d="M3 10h18" />
            </svg>
            Calendar
            <span className="absolute  -bottom-1 left-0 w-full h-0.5 bg-black transform scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100" />
          </Link> */}
          {/* <Link
            to="gradingSystem"
            className="flex gap-1 relative group text-gray-700 hover:text-black text-sm"
          >
            <BarChart />
            Grading System
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-black transform scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100" />
          </Link> */}
          {/* <Link
            to="/videocall"
            className="flex gap-1 relative group text-gray-700 hover:text-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="inline lucide lucide-video-icon lucide-video"
            >
              <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
              <rect x="2" y="6" width="14" height="12" rx="2" />
            </svg>
            Meet
            <span className="absolute  -bottom-1 left-0 w-full h-0.5 bg-black transform scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100" />
          </Link> */}
          {/* <Link
            to="videoLectures"
            className="relative flex gap-1 group text-gray-700 hover:text-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="inline lucide lucide-play-circle"
            >
              <circle cx="12" cy="12" r="10" />
              <polygon points="10,8 16,12 10,16 10,8" />
            </svg>
            Video Lectures
            <span className="absolute  -bottom-1 left-0 w-full h-0.5 bg-black transform scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100" />
          </Link> */}
          <Link
            to="chat"
            className="relative flex gap-1 group text-gray-700 hover:text-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="inline lucide lucide-message-circle"
            >
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
            </svg>
            Chat Room
            <span className="absolute  -bottom-1 left-0 w-full h-0.5 bg-black transform scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100" />
          </Link>
          <Link
            to="excelUpload"
            className="flex gap-1 items-center group text-gray-700 hover:text-orange-600 font-medium"
          >
            <FileSpreadsheet className="inline mr-1" size={20} />
            Upload Marks
          </Link>
          <Language />
        </nav>
        {username ? (
          <button
            className="rounded-full px-6 py-2 bg-white text-black border border-gray-300 hover:bg-gray-100 transition-colors"
            onClick={onLogout}
          >
            Logout
          </button>
        ) : (
          <button className="rounded-full px-6 py-2 bg-white text-black border border-gray-300 hover:bg-gray-100 transition-colors">
            Sign in
          </button>
        )}
      </header>

      <Outlet />

      <motion.footer
        className="py-12 border-t px-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="grid md:grid-cols-4 gap-8 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            staggerChildren: 0.1,
            delayChildren: 0.3,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="font-bold text-2xl mb-4">EduTeach.</div>
            <p className="text-gray-600 mb-4">
              Empowering educators with digital tools to enhance teaching and
              learning experiences.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-bold text-lg mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link to="pdfForm" className="text-gray-600 hover:text-black">
                  Upload Notes
                </Link>
              </li>
              <li>
                <Link
                  to="videoLectures"
                  className="text-gray-600 hover:text-black"
                >
                  Video Lectures
                </Link>
              </li>
              <li>
                <Link to="calendar" className="text-gray-600 hover:text-black">
                  E-Calendar
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black">
                  Assignment Management
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black">
                  Virtual Classroom
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-black">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black">
                  Blog
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">Email: info@eduteach.edu</li>
              <li className="text-gray-600">Phone: +1 (123) 456-7890</li>
              <li className="text-gray-600">
                Address: 123 Education Drive, University City
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          className="border-t pt-8 text-center text-gray-600"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p>
            &copy; {new Date().getFullYear()} EduTeach. All rights reserved.
          </p>
        </motion.div>
      </motion.footer>
    </>
  );
}
