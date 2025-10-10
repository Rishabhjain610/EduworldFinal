










import { Link } from "react-router-dom";
import { useState } from "react";
import { BookOpen, Calendar, Code, Train, Coffee, Bot, Play } from "lucide-react";
import studentImg from "../src/assets/student.png";
import studentMobileImg from "../src/assets/studentMobile.png";
import "./StudentHome.css";
import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { motion } from "framer-motion";

export default function StudentHome({ username, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  // Animation variants
  const fadeInLeft = {
    hidden: { x: -100, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 1, ease: "easeOut", delay: 1 }
    }
  };

  const fadeInRight = {
    hidden: { x: 100, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.9, ease: "easeOut", delay: 1.3 }
    }
  };

  const fadeInUp = {
    hidden: { y: 32, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const staggerItem = {
    hidden: { y: 32, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const slideInLeft = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const slideInRight = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.2 }
    }
  };

  return (
    <div className="container-fluid flex flex-col min-h-screen w-full bg-white">
      <div className="w-full px-2 md:px-6">
        <main className="w-full px-1">
          <section className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <motion.div 
                className="z-10 order-2 md:order-1"
                variants={fadeInLeft}
                initial="hidden"
                animate="visible"
              >
                <h2 className="text-gray-600 mb-2 text-sm">Smart digital campus</h2>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-2 text-orange-400">
                  Become
                  <br />
                  a better student
                  <br />
                  <span className="text-black">with digital tools.</span>
                </h1>
                {!username ? (
                  <div className="flex flex-wrap gap-3">
                    <motion.button 
                      className="rounded-full px-6 py-4 bg-black text-white hover:bg-gray-800 transition-colors text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Get started
                    </motion.button>
                    <motion.button 
                      className="rounded-full px-6 py-4 border border-black text-black hover:bg-gray-100 transition-colors text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Learn more
                    </motion.button>
                  </div>
                ) : null}
              </motion.div>

              {/* Right Side: Student Image with Background Elements */}
              <motion.div
                className="relative z-10 mx-auto w-full order-1 md:order-2 md:max-w-2xl lg:max-w-3xl"
                variants={fadeInRight}
                initial="hidden"
                animate="visible"
              >
                {/* Circular Animated Text behind the student image - reduced size */}
                <div className="absolute inset-0 flex items-center justify-center -z-20">
                  <motion.div 
                    className="w-[250px] h-[250px] md:w-[550px] md:h-[550px]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <path
                        id="textPath"
                        d="M 20,50 a 30,30 0 1,1 60,0 a 30,30 0 1,1 -60,0"
                        fill="none"
                      />
                      <text className="text-[2.5px] uppercase tracking-widest fill-gray-400">
                        <textPath href="#textPath">
                          • Railway Concession • Notes App • E-Calendar • Code
                          Editor • Digital Canteen • Smart Campus • Railway
                          Concession • Notes App • E-Calendar • Code Editor •
                          Digital Canteen • Smart Campus
                        </textPath>
                      </text>
                    </svg>
                  </motion.div>
                </div>

                {/* Orange circle behind the student image - reduced size */}
                <div className="absolute -z-10 right-0 bottom-0 w-[350px] h-[350px] bg-orange-400 rounded-full"></div>
                
                {/* Student Image with custom larger height - reduced height */}
                <img
                  src={studentImg}
                  alt="Student image"
                  className="relative z-20 object-cover w-full h-[600px] hidden md:block"
                />
                <img
                  src={studentMobileImg}
                  alt="Student image"
                  className="relative z-20 object-cover w-full h-[550px] block md:hidden"
                />

                {/* Floating Student Chart - reduced size */}
                <motion.div 
                  className="hidden md:inline absolute top-20 right-0 bg-white rounded-xl shadow-lg p-3 z-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2.5, duration: 0.6 }}
                >
                  <div className="text-xs text-gray-500">Student Chart</div>
                  <div className="flex items-end h-12 gap-1 mt-2">
                    {[8, 12, 6, 10, 14, 7].map((height, index) => (
                      <motion.div
                        key={index}
                        className="w-3 bg-orange-400 rounded-sm"
                        initial={{ height: 0 }}
                        animate={{ height: `${height * 3}px` }}
                        transition={{ delay: 3 + index * 0.1, duration: 0.5 }}
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Floating 15k+ Total Students Box - reduced size */}
                <motion.div 
                  className="absolute bottom-20 right-10 bg-white rounded-xl shadow-lg p-3 z-20 Students15k"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2.2, duration: 0.6 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-orange-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <motion.p 
                        className="font-bold text-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.8, duration: 0.5 }}
                      >
                        15k+
                      </motion.p>
                      <p className="text-xs text-gray-500">Total Students</p>
                    </div>
                  </div>
                </motion.div>

                {/* Black Box with Stats - reduced size */}
                <motion.div 
                  className="absolute bottom-0 left-0 bg-black text-white p-4 rounded-tr-3xl z-20 digital5"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.4, duration: 0.6 }}
                >
                  <div className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center mb-2">
                    <span className="font-bold text-sm">7+</span>
                  </div>
                  <p className="font-medium text-sm">Your Digital Tools</p>
                </motion.div>
              </motion.div>
            </div>

            {/* Orange Wave at Bottom - reduced height */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-orange-400 -z-10"></div>
          </section>

          {/* Digital Campus Tools Section */}
          <motion.section 
            className="py-20 featuresSection"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.div className="text-center mb-12" variants={staggerItem}>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Our Digital Campus Tools
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm">
                Simplify your campus life with our integrated digital tools
                designed specifically for students.
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
            >
              {/* Railway Concession Feature */}
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transition-shadow"
                variants={staggerItem}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Train className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Railway Concession</h3>
                <p className="text-gray-600 mb-3 text-sm">
                  Quick access to pass applications. Submit and track your
                  railway concession requests digitally without paperwork.
                </p>
                <Link
                  to="railway"
                  className="text-black font-medium flex items-center text-sm"
                >
                  Learn more
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </motion.div>

              {/* Notes App Feature */}
              <motion.div 
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl transition-shadow"
                variants={staggerItem}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Notes App</h3>
                <p className="text-gray-600 mb-3 text-sm">
                  Upload and download study materials instantly. Organize your
                  notes by subject and access them anywhere.
                </p>
                <Link
                  to="getPdfs"
                  className="text-black font-medium flex items-center text-sm"
                >
                  Learn more
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </motion.div>

              {/* ADD: Video Lectures Feature */}
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transition-shadow"
                variants={staggerItem}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Play className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Video Lectures</h3>
                <p className="text-gray-600 mb-3 text-sm">
                  Access video lectures from your teachers. Watch, learn, and 
                  study at your own pace with our comprehensive video library.
                </p>
                <Link
                  to="videoLectures"
                  className="text-black font-medium flex items-center text-sm"
                >
                  Learn more
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </motion.div>

              {/* E-Calendar Feature */}
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transition-shadow"
                variants={staggerItem}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">E-Calendar</h3>
                <p className="text-gray-600 mb-3 text-sm">
                  Important event and test tracking.
                </p>
                <Link
                  to="calendar"
                  className="text-black font-medium flex items-center text-sm"
                >
                  Learn more
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </motion.div>

              {/* Code Editor Feature */}
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transition-shadow"
                variants={staggerItem}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Code Editor</h3>
                <p className="text-gray-600 mb-3 text-sm">
                  AI-powered code reviews and improvement suggestions. Perfect
                  your programming skills with intelligent feedback.
                </p>
                <Link
                  to="codeEditor"
                  className="text-black font-medium flex items-center text-sm"
                >
                  Learn more
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </motion.div>

              {/* Digital Canteen Feature */}
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transition-shadow"
                variants={staggerItem}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Coffee className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Digital Canteen</h3>
                <p className="text-gray-600 mb-3 text-sm">
                  Order food in advance, skip the lines. Browse menus, pay
                  online, and get notified when your order is ready.
                </p>
                <Link
                  to="canteen"
                  className="text-black font-medium flex items-center text-sm"
                >
                  Learn more
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </motion.div>

              {/* Support Feature */}
              <motion.div 
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl transition-shadow"
                variants={staggerItem}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Chat Bot</h3>
                <p className="text-gray-600 mb-3 text-sm">
                  Experience 24/7 assistance with our smart Chatbot, designed to
                  solve doubts, generate images, and tackle problems
                  effortlessly.
                </p>
                <Link
                  to="chatbot"
                  className="text-black font-medium flex items-center text-sm"
                >
                  Learn more
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          </motion.section>

          {/* Experience the Workflow Section - reduced padding */}
          <motion.section 
            className="py-12 relative px-2 overflow-hidden productivitySec"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="absolute -z-10 right-0 top-0 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-orange-400 rounded-full opacity-10"></div>
            <div className="absolute -z-10 left-0 bottom-0  w-[200px] h-[200px] md:w-[350px] md:h-[350px] bg-purple-600 rounded-full opacity-10"></div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div 
                className="order-2 md:order-1"
                variants={slideInLeft}
              >
                <h2 className="text-3xl font-bold mb-4">
                  Experience the workflow smart students love
                </h2>
                <p className="text-gray-600 mb-6 text-sm">
                  Let your campus life be more organized and efficient with our
                  integrated digital tools. Focus on learning and growing while
                  we handle the rest.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-100 p-2 rounded-full mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-orange-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-base mb-1">
                        Seamless Integration
                      </h3>
                      <p className="text-gray-600 text-sm">
                        All tools work together in one platform, no need to
                        switch between apps.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-full mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-purple-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-base mb-1">Time-Saving</h3>
                      <p className="text-gray-600 text-sm">
                        Automate routine tasks and focus on what matters most -
                        your education.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-100 p-2 rounded-full mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-orange-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-base mb-1">
                        Mobile-Friendly
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Access all features on any device, anytime, anywhere on
                        campus.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                className="invisible md:visible order-1 md:order-2 relative"
                variants={slideInRight}
              >
                <div className="border rounded-3xl shadow-lg mx-8">
                  <DotLottieReact
                    src="https://lottie.host/e196c9c3-2d8f-4808-9b66-28a71500c060/qVNS98ACCW.lottie"
                    loop
                    autoplay
                  />
                </div>

                <motion.div 
                  className="invisible md:visible absolute -top-8 -left-8 bg-white rounded-xl shadow-lg p-3 z-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-orange-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <div className="">
                      <p className="font-bold text-sm">Productivity</p>
                      <p className="text-xs text-gray-500">Increased by 40%</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="invisible md:visible absolute -bottom-8 -right-0 bg-white rounded-xl shadow-lg p-3 z-50"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-purple-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-sm">Time Saved</p>
                      <p className="text-xs text-gray-500">5+ hours weekly</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.section>

          {/* Call-to-Action Section - reduced padding */}
          <motion.section
            className="py-20 bg-black text-white rounded-3xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to transform your campus experience?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-sm">
                Join thousands of students who are already enjoying the benefits
                of our digital campus platform.
              </p>
              <motion.button 
                className="rounded-full px-6 py-4 bg-orange-400 hover:bg-orange-500 text-black font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get started now
              </motion.button>
            </div>
          </motion.section>

          <motion.section 
            className="py-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-3">
                Trusted by Leading Institutions
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm">
                Join the community of educational institutions that trust our
                platform.
              </p>
            </div>
            <motion.div 
              className="flex flex-wrap justify-center items-center gap-8 md:gap-16"
              variants={staggerContainer}
            >
              {[
                "../src/assets/univ1.jpg",
                "../src/assets/univ2.jpg", 
                "../src/assets/univ3.jpg",
                "../src/assets/univ4.jpg"
              ].map((src, index) => (
                <motion.img
                  key={index}
                  src={`${src}?height=40&width=120`}
                  alt="University logo"
                  width={120}
                  height={40}
                  className="opacity-60 hover:opacity-100 transition-opacity"
                  variants={staggerItem}
                  whileHover={{ scale: 1.1 }}
                />
              ))}
            </motion.div>
          </motion.section>
        </main>
      </div>
    </div>
  );
}





