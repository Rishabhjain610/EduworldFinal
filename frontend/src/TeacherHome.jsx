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
  FileSpreadsheet,
  MessageCircle,
} from "lucide-react";
import "./TeacherHome.css";

export default function TeacherHome({ username, onLogout }) {
  console.log(username);

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
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 rounded-full text-orange-600 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Smart Teaching Platform
            </div>

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
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center">
                  Start Teaching Smarter
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 border-2 border-orange-300 text-orange-600 rounded-2xl font-semibold hover:bg-orange-50 transition-all duration-300">
                  Watch Demo
                </button>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-orange-600">5k+</div>
                <div className="text-sm text-gray-600">Teachers</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-orange-600">6+</div>
                <div className="text-sm text-gray-600">AI Tools</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-orange-600">98%</div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="relative flex justify-center lg:justify-end">
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

            {/* Simple Floating Cards */}
            <div className="hidden lg:block absolute top-16 -left-12 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-orange-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">85% Higher</div>
                  <div className="text-sm text-gray-600">Engagement</div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block absolute bottom-16 -right-12 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-orange-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">5k+</div>
                  <div className="text-sm text-gray-600">Happy Teachers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Simplified */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              AI-Powered Teaching
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"> Ecosystem</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Streamline your teaching process with intelligent tools designed for modern educators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards - Clean and Simple */}
            {[
              {
                icon: FileText,
                title: "AI Upload Notes",
                description: "Intelligently upload, organize, and categorize lecture notes with AI-powered tagging and search capabilities for easy access.",
                link: "pdfForm"
              },
              {
                icon: Calendar,
                title: "Smart E-Calendar", 
                description: "Intelligent scheduling with CRUD operations, automated reminders, and seamless integration with your teaching workflow.",
                link: "calendar"
              },
              {
                icon: Video,
                title: "Video Calls & Meetings",
                description: "Enhanced video conferencing with features like chat, screen sharing, and real-time collaboration tools for virtual classrooms.",
                link: "/videocall"
              },
              {
                icon: Play,
                title: "Smart Video Lectures",
                description: "Upload and manage video lectures with AI transcription, automatic chapters, and intelligent content recommendations.",
                link: "videoLectures"
              },
              {
                icon: MessageCircle,
                title: "Chat Room",
                description: "Real-time communication platform with group chat features for seamless teacher-student interaction and collaboration.",
                link: "chat"
              },
              {
                icon: FileSpreadsheet,
                title: "Upload Marks & Analytics",
                description: "AI-powered student performance tracking with Excel upload, automated grading, and comprehensive analytics dashboard.",
                link: "excelUpload"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-orange-50 p-8 rounded-3xl border border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-200 transition-colors duration-300">
                  <feature.icon className="w-8 h-8 text-orange-600" />
                </div>
                
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
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-orange-100 to-transparent rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8 text-center lg:text-left">
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
                <div
                  key={index}
                  className="flex items-start space-x-4 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-100 hover:bg-white/80 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-white to-orange-50 p-8 rounded-3xl shadow-2xl border border-orange-100 relative overflow-hidden">
              {/* Simple placeholder for teacher analytics */}
              <div className="w-full h-64 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <BarChart className="w-16 h-16 text-orange-500 mx-auto" />
                  <h3 className="text-xl font-bold text-gray-900">AI Teaching Analytics</h3>
                  <p className="text-gray-600">Real-time insights and performance metrics</p>
                </div>
              </div>
              
              {/* Simple floating metrics */}
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-lg p-4 border border-orange-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">+85%</div>
                    <div className="text-sm text-gray-600">AI Engagement</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg p-4 border border-orange-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">10+ hrs</div>
                    <div className="text-sm text-gray-600">AI Time Saved</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Ready to transform your
              <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent"> AI-powered teaching experience?</span>
            </h2>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Join thousands of educators who are already using our AI-powered platform to enhance their teaching and student engagement.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <button className="group px-10 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 flex items-center">
                Start Teaching Smarter
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="px-10 py-5 border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300">
                Book AI Demo
              </button>
            </div>

            {/* Trust indicators */}
            <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "5k+", label: "AI-Assisted Teachers" },
                { number: "100+", label: "Smart Institutions" },
                { number: "98%", label: "AI Satisfaction Rate" },
                { number: "24/7", label: "AI Support Available" }
              ].map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-3xl font-bold text-white">{stat.number}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Institutions */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Trusted by Leading AI-Forward Educational Institutions
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join the growing community of schools and universities that have chosen our AI-powered platform for their teaching transformation.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="w-32 h-16 bg-gradient-to-r from-orange-100 to-orange-50 rounded-lg flex items-center justify-center border border-orange-200 hover:opacity-100 hover:scale-105 transition-all duration-300"
              >
                <span className="text-orange-600 font-medium">University {index}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}