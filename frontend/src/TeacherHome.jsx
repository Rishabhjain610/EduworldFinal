import React from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  FileText,
  Video,
  Users,
  Award,
  BarChart,
  Play,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Clock,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import "./TeacherHome.css";
import { ChatBubble } from "@mui/icons-material";

export default function TeacherHome({ username, onLogout }) {
  console.log(username);

  // Animation variants
  const fadeInLeft = {
    hidden: { x: -60, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.2 }
    }
  };

  const fadeInRight = {
    hidden: { x: 60, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.4 }
    }
  };

  const fadeInUp = {
    hidden: { y: 40, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const staggerItem = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-4 sm:px-6 lg:px-8 py-12">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-48 h-48 md:w-72 md:h-72 bg-orange-200 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 md:w-96 md:h-96 bg-orange-300 rounded-full blur-3xl opacity-15"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Content */}
          <motion.div 
            className="space-y-8 text-center lg:text-left"
            variants={fadeInLeft}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center px-4 py-2 bg-orange-100 rounded-full text-orange-600 text-sm font-medium"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Smart Teaching Platform
            </motion.div>

            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  Empower
                </span>
                <br />
                <span className="text-gray-900">your teaching</span>
                <br />
                <span className="text-gray-800">with AI tools</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Revolutionize education with our AI-powered suite of teaching tools designed to enhance student engagement and streamline your workflow.
              </p>
            </div>

            {!username && (
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button 
                  className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Teaching Smarter
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button 
                  className="px-8 py-4 border-2 border-orange-300 text-orange-600 rounded-2xl font-semibold hover:bg-orange-50 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Watch Demo
                </motion.button>
              </motion.div>
            )}

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-8 pt-8 max-w-md mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-orange-600">5k+</div>
                <div className="text-sm text-gray-600">Teachers</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-orange-600">4+</div>
                <div className="text-sm text-gray-600">AI Tools</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-orange-600">98%</div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image Section */}
          <motion.div
            className="relative flex justify-center lg:justify-end"
            variants={fadeInRight}
            initial="hidden"
            animate="visible"
          >
            {/* Animated background circle with rotating text */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px] opacity-30">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path
                    id="textPath"
                    d="M 20,50 a 30,30 0 1,1 60,0 a 30,30 0 1,1 -60,0"
                    fill="none"
                  />
                  <text className="text-[2px] uppercase tracking-widest fill-orange-400 font-medium">
                    <textPath href="#textPath">
                      • AI Upload Notes • Smart E-Calendar • Student Analytics • Video Lectures • AI Grading • Progress Reports • Teaching Tools •
                    </textPath>
                  </text>
                </svg>
              </div>
            </motion.div>

            {/* Smaller Orange Background Circle */}
            <div className="absolute -z-10 right-0 bottom-0 w-[280px] h-[280px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] bg-gradient-to-r from-orange-400 to-orange-500 rounded-full opacity-80"></div>

            {/* Main Image */}
            <div className="relative z-10">
              <img
                src="../src/assets/teacherHero.png"
                alt="Teacher"
                className="relative w-full max-w-lg lg:max-w-xl h-auto object-contain hidden md:block"
              />
              <img
                src="../src/assets/teacherHero.png"
                alt="Teacher"
                className="relative w-full max-w-md h-auto object-contain md:hidden"
              />
            </div>

            {/* Floating Cards */}
            <motion.div 
              className="hidden lg:block absolute top-16 -left-12 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-orange-200"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">85% Higher</div>
                  <div className="text-sm text-gray-600">Engagement</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="hidden lg:block absolute bottom-16 -right-12 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-orange-200"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">5k+</div>
                  <div className="text-sm text-gray-600">Happy Teachers</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-16 space-y-4" variants={staggerItem}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              AI-Powered Teaching
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"> Ecosystem</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Streamline your teaching process with intelligent tools designed for modern educators
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
          >
            {/* Feature Cards */}
            {[
              {
                icon: FileText,
                title: "AI Upload Notes",
                description: "Intelligently upload, organize, and categorize lecture notes with AI-powered tagging and search capabilities for easy access.",
                bgColor: "bg-orange-50",
                iconBg: "bg-orange-100",
                iconColor: "text-orange-600",
                link: "pdfForm"
              },
              {
                icon: Play,
                title: "Smart Video Lectures", 
                description: "Upload and manage video lectures with AI transcription, automatic chapters, and intelligent content recommendations.",
                bgColor: "bg-orange-50",
                iconBg: "bg-orange-100",
                iconColor: "text-orange-600",
                link: "videoLectures"
              },
              {
                icon: Calendar,
                title: " E-Calendar",
                description: "Smart scheduling with CRUD operations",
                bgColor: "bg-orange-50",
                iconBg: "bg-orange-100",
                iconColor: "text-orange-600",
                link: "calendar"
              },
              {
                icon: Video,
                title: "Video Calls",
                description: "Enhanced video conferencing with features like chat screen share",
                bgColor: "bg-orange-50",
                iconBg: "bg-orange-100",
                iconColor: "text-orange-600",
                link: "/videocall"
              },{
                icon: ChatBubble,
                title: " Chat App",
                description: "Chat application for real-time communication with group chat features.",
                bgColor: "bg-orange-50",
                iconBg: "bg-orange-100",
                iconColor: "text-orange-600",
                link: "chatbot"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`group ${feature.bgColor} p-8 rounded-3xl border border-orange-100 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden`}
                variants={staggerItem}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/20 to-transparent rounded-full blur-2xl"></div>
                
                <div className="relative z-10">
                  <motion.div 
                    className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <Link
                    to={feature.link}
                    className="inline-flex items-center text-orange-600 font-semibold group-hover:text-orange-700 transition-colors"
                  >
                    Explore Now
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </Link>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-orange-100 to-transparent rounded-full blur-3xl"></div>
        
        <motion.div 
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div 
            className="space-y-8 text-center lg:text-left"
            variants={fadeInLeft}
          >
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Experience the AI workflow
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"> smart teachers</span> love
              </h2>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Transform your teaching methodology with our AI-powered platform that enhances student engagement and optimizes educational outcomes.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: CheckCircle,
                  title: "AI-Powered Integration",
                  description: "All teaching tools work seamlessly with AI assistance, creating an intelligent ecosystem for enhanced educational delivery."
                },
                {
                  icon: Clock,
                  title: "Smart Automation",
                  description: "AI automates grading, attendance tracking, and administrative tasks, giving you more time for actual teaching and mentoring."
                },
                {
                  icon: TrendingUp,
                  title: "Intelligent Analytics",
                  description: "AI-driven insights into student performance help you identify learning patterns and adapt your teaching strategies effectively."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-4 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-100 hover:bg-white/80 transition-all duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative"
            variants={fadeInRight}
          >
            <div className="bg-gradient-to-br from-white to-orange-50 p-8 rounded-3xl shadow-2xl border border-orange-100 relative overflow-hidden">
              {/* Placeholder for teacher analytics animation */}
              <div className="w-full h-64 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <BarChart className="w-16 h-16 text-orange-500 mx-auto" />
                  <h3 className="text-xl font-bold text-gray-900">AI Teaching Analytics</h3>
                  <p className="text-gray-600">Real-time insights and performance metrics</p>
                </div>
              </div>
              
              {/* Floating metrics */}
              <motion.div 
                className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-lg p-4 border border-orange-100"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">+85%</div>
                    <div className="text-sm text-gray-600">AI Engagement</div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg p-4 border border-orange-100"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">10+ hrs</div>
                    <div className="text-sm text-gray-600">AI Time Saved</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10"></div>
        
        <motion.div 
          className="max-w-4xl mx-auto text-center relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Ready to transform your
              <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent"> AI-powered teaching experience?</span>
            </h2>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Join thousands of educators who are already using our AI-powered platform to enhance their teaching and student engagement.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <motion.button 
                className="group px-10 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 flex items-center"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Teaching Smarter
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button 
                className="px-10 py-5 border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Book AI Demo
              </motion.button>
            </div>

            {/* Trust indicators */}
            <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "5k+", label: "AI-Assisted Teachers" },
                { number: "100+", label: "Smart Institutions" },
                { number: "98%", label: "AI Satisfaction Rate" },
                { number: "24/7", label: "AI Support Available" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="text-3xl font-bold text-white">{stat.number}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trusted Institutions */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-12" variants={staggerItem}>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Trusted by Leading AI-Forward Educational Institutions
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join the growing community of schools and universities that have chosen our AI-powered platform for their teaching transformation.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60"
            variants={staggerContainer}
          >
            {[1, 2, 3, 4].map((index) => (
              <motion.div
                key={index}
                className="w-32 h-16 bg-gradient-to-r from-orange-100 to-orange-50 rounded-lg flex items-center justify-center border border-orange-200"
                variants={staggerItem}
                whileHover={{ opacity: 1, scale: 1.05 }}
              >
                <span className="text-orange-600 font-medium">University {index}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}