







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
} from "lucide-react";
import { motion } from "framer-motion";
import "./TeacherHome.css";

export default function TeacherHome({ username, onLogout }) {
  console.log(username);

  // Animation variants
  const fadeInLeft = {
    hidden: { x: -100, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 1, ease: "easeOut", delay: 0.8 }
    }
  };

  const fadeInRight = {
    hidden: { x: 100, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.9, ease: "easeOut", delay: 1.2 }
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

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <main>
          <section className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <motion.div 
                className="z-10 order-2 md:order-1"
                variants={fadeInLeft}
                initial="hidden"
                animate="visible"
              >
                <p className="text-gray-600 mb-2 text-sm">Teacher portal</p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-orange-400">
                  Empower
                  <br />
                  your teaching
                  <br />
                  <span className="text-black">with digital tools.</span>
                </h1>
                {!username ? (
                  <div className="flex flex-wrap gap-3">
                    <button className="rounded-full px-6 py-4 bg-black text-white hover:bg-gray-800 transition-colors text-sm">
                      Get started
                    </button>
                    <button className="rounded-full px-6 py-4 border border-black text-black hover:bg-gray-100 transition-colors text-sm">
                      Learn more
                    </button>
                  </div>
                ) : null}
              </motion.div>

              <motion.div 
                className="relative order-1 md:order-2"
                variants={fadeInRight}
                initial="hidden"
                animate="visible"
              >
                {/* Circular text - reduced size */}
                <div className="absolute w-full h-full flex items-center justify-center circularText">
                  <motion.div 
                    className="w-[350px] h-[350px]"
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
                          • Upload Notes • E-Calendar • Student Progress •
                          Assignments • Grading • Analytics • Upload Notes •
                          E-Calendar • Student Progress • Assignments • Grading
                          • Analytics
                        </textPath>
                      </text>
                    </svg>
                  </motion.div>
                </div>
                <div className="relative z-10 ml-auto max-w-md">
                  <div className="absolute -z-10 right-0 bottom-0 w-[350px] h-[350px] bg-orange-400 rounded-full orangeCircle"></div>
                  <img
                    src="../src/assets/teacherHero.png"
                    alt="Teacher image"
                    className="relative z-20 object-cover w-full h-[650px] hidden md:block"
                  />
                  <img
                    src="../src/assets/teacherHero.png"
                    alt="Teacher mobile image"
                    className="relative z-20 object-cover w-full h-[600px] block md:hidden"
                  />

                  <motion.div 
                    className="absolute top-20 right-0 bg-white rounded-xl shadow-lg p-3 z-20 studentEnag"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2, duration: 0.6 }}
                  >
                    <div className="text-xs text-gray-500">
                      Student Engagement
                    </div>
                    <div className="flex items-end h-12 gap-1 mt-2">
                      {[10, 14, 12, 8, 11, 9].map((height, index) => (
                        <motion.div
                          key={index}
                          className="w-3 bg-orange-400 rounded-sm"
                          style={{ height: `${height * 3}px` }}
                          initial={{ height: 0 }}
                          animate={{ height: `${height * 3}px` }}
                          transition={{ delay: 2.5 + index * 0.1, duration: 0.5 }}
                        />
                      ))}
                    </div>
                  </motion.div>

                  <motion.div 
                    className="absolute bottom-20 right-10 bg-white rounded-xl shadow-lg p-3 z-20"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.2, duration: 0.6 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-orange-100 p-2 rounded-full">
                        <FileText className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <motion.p 
                          className="font-bold text-xl"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 2.8, duration: 0.5 }}
                        >
                          250+
                        </motion.p>
                        <p className="text-xs text-gray-500">
                          Resources Shared
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <motion.div 
                  className="absolute bottom-0 left-0 bg-black text-white p-4 rounded-tr-3xl z-20 teachingTools"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.4, duration: 0.6 }}
                >
                  <div className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center mb-2">
                    <span className="font-bold text-sm">4+</span>
                  </div>
                  <p className="font-medium text-sm">Teaching Tools</p>
                </motion.div>
              </motion.div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-20 bg-orange-400 -z-20"></div>
          </section>

          <motion.section 
            className="py-20 featuresSection"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.div className="text-center mb-12" variants={staggerItem}>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Streamline Your Teaching Process
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm">
                Our digital tools help you focus on what matters most -
                educating your students.
              </p>
            </motion.div>

            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={staggerContainer}
            >
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow"
                variants={staggerItem}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Upload PDF Notes</h3>
                <p className="text-gray-600 mb-3 text-sm">
                  Easily upload and organize lecture notes, study materials, and
                  resources for your students to access anytime.
                </p>
                <Link
                  to="pdfForm"
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

              <motion.div 
                className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow"
                variants={staggerItem}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Play className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Video Lectures</h3>
                <p className="text-gray-600 mb-3 text-sm">
                  Upload, manage, and share video lectures with your students. 
                  Create engaging content with our integrated video platform.
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

              <motion.div 
                className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow"
                variants={staggerItem}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">E-Calendar</h3>
                <p className="text-gray-600 mb-3 text-sm">
                  Schedule classes, exams, and important events. Keep students
                  informed with automatic notifications.
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

              <motion.div 
                className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow"
                variants={staggerItem}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Video className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Video Call Feature</h3>
                <p className="text-gray-600 mb-3 text-sm">
                  Connect with your students effortlessly. Our integrated video
                  call feature enables you to hold interactive virtual classes
                  and one-on-one sessions seamlessly.
                </p>
                <Link
                  to="/videocall"
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

          <motion.section
            className="py-20 bg-black text-white rounded-3xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to transform your teaching experience?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-sm">
                Join thousands of educators who are already using our platform
                to enhance their teaching and student engagement.
              </p>
              <motion.button 
                className="rounded-full px-6 py-4 bg-orange-400 hover:bg-orange-500 text-black font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start teaching smarter
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