import { Link } from "react-router-dom";
import { Routes, Route, useNavigate, Outlet } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import {
  BookOpen,
  Calendar,
  FileText,
  Users,
  Award,
  BarChart,
} from "lucide-react";
import TeacherHome from "./TeacherHome";
import PdfForm from "./PdfForm";

export default function TeacherLandingPage({ username, onLogout }) {
  console.log(username);

  useGSAP(() => {
    gsap.from(".gsapNav", {
      y: -70,
      duration: 0.8,
      stagger: 0.2,
    });
  }, []);

  return (
    <>
      <header className="flex items-center justify-between px-4 py-5 mx-auto shadow-md my-1 mx-1 w-full rounded-4xl">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <img
            src="../src/assets/navbarLogo.jpeg"
            alt="Logo"
            className="h-10 w-14 object-cover"
          />
          <span className="font-bold text-2xl gsapNav">EduWorld</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="pdfForm"
            className="flex gap-2 relative group text-gray-700 hover:text-black gsapNav"
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
          <Link
            to="calendar"
            className="relative flex gap-2 group text-gray-700 hover:text-black gsapNav"
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
            to="/videocall"
            className="flex gap-2 relative group text-gray-700 hover:text-black gsapNav"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="inline lucide lucide-video-icon lucide-video"
            >
              <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
              <rect x="2" y="6" width="14" height="12" rx="2" />
            </svg>
            Meet
            <span className="absolute  -bottom-1 left-0 w-full h-0.5 bg-black transform scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100" />
          </Link>
          {/* <Link href="#" className="text-gray-700 hover:text-black">
                        Assignments
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black transform scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100" />
                    </Link> */}
        </nav>
        {username ? (
          <button
            className="rounded-full px-6 py-2 bg-white text-black border border-gray-300 hover:bg-gray-100 transition-colors gsapNav"
            onClick={onLogout}
          >
            Logout
          </button>
        ) : (
          <button className="rounded-full px-6 py-2 bg-white text-black border border-gray-300 hover:bg-gray-100 transition-colors gsapNav">
            Sign in
          </button>
        )}
      </header>

      <Outlet />

      <footer className="py-12 border-t px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="font-bold text-2xl mb-4">EduTeach.</div>
            <p className="text-gray-600 mb-4">
              Empowering educators with digital tools to enhance teaching and
              learning experiences.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-black">
                  Upload Notes
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black">
                  E-Calendar
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black">
                  Student Progress
                </a>
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
          </div>
          <div>
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
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">Email: info@eduteach.edu</li>
              <li className="text-gray-600">Phone: +1 (123) 456-7890</li>
              <li className="text-gray-600">
                Address: 123 Education Drive, University City
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-8 text-center text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} EduTeach. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
