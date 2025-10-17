import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
// Add this import at the top of StudentLandingPage.jsx
 // Add this line
// Material UI Imports
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Language from "./Language.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Sparkles,BarChart3 } from "lucide-react";
export default function StudentLandingPage({ username, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  // List of mobile navigation links
  const mobileNavLinks = [
    { to: "railway", label: "Rail Concession" },
    { to: "getPdfs", label: "Notes" },
    { to: "calendar", label: "Calendar" },
    { to: "codeEditor", label: "Code Editor" },
    { to: "canteen", label: "Canteen" },
    { to: "chatbot", label: "ChatBot" },
    { to: "videoLectures", label: "Video Lectures" },
    { to: "chat", label: "Chat Room" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white flex items-center justify-between px-3 py-4 mx-auto w-full shadow-lg mt-1 mx-2 ">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <img
            src="../src/assets/navbarLogo.jpeg"
            alt="Logo"
            className="h-6 w-9 md:h-10 md:w-14 object-cover"
          />
          <span className="font-bold text-lg md:text-2xl">EduWorld</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center text-md space-x-4 bg-white">
          <Link
            to="railway"
            className="relative flex gap-1 group text-gray-700 hover:text-black text-sm"
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
              className="inline lucide lucide-train-front"
            >
              <path d="M8 3.1V7a4 4 0 0 0 8 0V3.1" />
              <path d="m9 15-1-1" />
              <path d="m15 15 1-1" />
              <path d="M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z" />
              <path d="m8 19-2 3" />
              <path d="m16 19 2 3" />
            </svg>
            Rail Concession
            <span className="absolute  -bottom-1 left-0 w-full h-0.5 bg-black transform scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100" />
          </Link>
          <Link
            to="getPdfs"
            className="relative flex gap-1 text-sm group text-gray-700 hover:text-black"
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
            Notes
            <span className="absolute  -bottom-1 left-0 w-full h-0.5 bg-black transform scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100" />
          </Link>
          <Link
            to="calendar"
            className="relative flex gap-1 text-sm group text-gray-700 hover:text-black"
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
          </Link>
          <Link
            to="codeEditor"
            className="relative flex gap-1 text-sm group text-gray-700 hover:text-black"
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
              className="inline lucide lucide-code"
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            Code Editor
            <span className="absolute  -bottom-1 left-0 w-full h-0.5 bg-black transform scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100" />
          </Link>
          <Link
            to="canteen"
            className="relative flex gap-1 text-sm group text-gray-700 hover:text-black"
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
              className="inline lucide lucide-utensils-icon lucide-utensils"
            >
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
              <path d="M7 2v20" />
              <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
            </svg>
            Canteen
            <span className="absolute  -bottom-1 left-0 w-full h-0.5 bg-black transform scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100" />
          </Link>
          <Link
            to="chatbot"
            className="relative flex gap-1 text-sm group text-gray-700 hover:text-black"
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
              className="lucide lucide-bot-icon lucide-bot"
            >
              <path d="M12 8V4H8" />
              <rect width="16" height="12" x="4" y="8" rx="2" />
              <path d="M2 14h2" />
              <path d="M20 14h2" />
              <path d="M15 13v2" />
              <path d="M9 13v2" />
            </svg>
            Chatbot
            <span className="absolute  -bottom-1 left-0 w-full h-0.5 bg-black transform scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100" />
          </Link>
          <Link
            to="videoLectures"
            className="relative flex gap-1 text-sm group text-gray-700 hover:text-black"
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
            Video
            <span className="absolute  -bottom-1 left-0 w-full h-0.5 bg-black transform scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100" />
          </Link>
          <Link
            to="chat"
            className="relative flex gap-1 text-sm   group text-gray-700 hover:text-black"
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
            Chat
            <span className="absolute  -bottom-1 left-0 w-full h-0.5 bg-black transform scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100" />
          </Link>
          <Link
            to="resume"
            className="relative flex gap-1 text-sm group text-gray-700 hover:text-black"
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
              className="inline"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            Resume
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-black transform scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100" />
          </Link>
          <Link
            to="analytics"
            className="relative flex gap-1 text-sm group text-gray-700 hover:text-black"
          >
            <Sparkles className="inline mr-1" size={20} />
            Analytics
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-black transform scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100" />
          </Link>
          <Link>
            <Language />
          </Link>
        </nav>

        {/* Mobile Hamburger Icon */}
        <div className="md:hidden">
          <IconButton onClick={() => setIsOpen(true)} aria-label="menu">
            <MenuIcon />
          </IconButton>
        </div>

        {!username ? (
          <button className="rounded-full px-6 py-2 bg-white text-black border border-gray-300 hover:bg-gray-100 transition-colors">
            Sign up
          </button>
        ) : (
          ""
        )}
        {username ? (
          <button
            className="hidden md:inline rounded-full px-6 py-2 bg-white text-black border border-gray-300 hover:bg-gray-100 transition-colors"
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

      {/* Material UI Side Drawer for Mobile */}
      <Drawer anchor="right" open={isOpen} onClose={() => setIsOpen(false)}>
        <List sx={{ width: 250 }}>
          {mobileNavLinks.map((link, index) => (
            <ListItem button key={index} onClick={() => setIsOpen(false)}>
              <Link to={link.to} className="block w-full">
                <ListItemText primary={link.label} />
              </Link>
            </ListItem>
          ))}
          {/* Include Logout button in side drawer if user is logged in */}
          {username && (
            <ListItem
              button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
            >
              <ListItemText primary="Logout" />
            </ListItem>
          )}
        </List>
      </Drawer>

      <Outlet></Outlet>

      <motion.footer
        className="py-12 border-t px-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12"
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
            <div className="font-bold text-2xl mb-4">EduWorld.</div>
            <p className="text-gray-600 mb-4">
              Making campus life simpler and more efficient with integrated
              digital tools.
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
                <Link to="railway" className="text-gray-600 hover:text-black">
                  Railway Concession
                </Link>
              </li>
              <li>
                <Link to="getPdfs" className="text-gray-600 hover:text-black">
                  Notes App
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
                <Link
                  to="codeEditor"
                  className="text-gray-600 hover:text-black"
                >
                  Code Editor
                </Link>
              </li>
              <li>
                <Link to="canteen" className="text-gray-600 hover:text-black">
                  Digital Canteen
                </Link>
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
              <li className="text-gray-600">Email: info@EduWorld.edu</li>
              <li className="text-gray-600">Phone: +1 (123) 456-7890</li>
              <li className="text-gray-600">
                Address: 123 Campus Drive, University City
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
            &copy; {new Date().getFullYear()} EduWorld. All rights reserved.
          </p>
        </motion.div>
      </motion.footer>
    </>
  );
}
