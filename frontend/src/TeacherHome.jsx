import { Link } from "react-router-dom";
import { BookOpen, Calendar, FileText, Video, Users, Award, BarChart } from "lucide-react"
import { useRef } from "react";
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import './TeacherHome.css';
import { ScrollTrigger } from "gsap/ScrollTrigger";



export default function TeacherHome({ username, onLogout }) {

    const leftColRef = useRef(null);
    const rightColRef = useRef(null);
    const ready = useRef(null);
    const trust = useRef(null);


    useGSAP(() => {
        const tl = gsap.timeline({
            delay: 0.8,
        });

        gsap.registerPlugin(ScrollTrigger);

        tl.from(leftColRef.current, {
            x: -100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
        });

        tl.from(rightColRef.current, {
            x: 100,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
        }, '-=0.4');

        gsap.from(".features", {
            scrollTrigger: {
                scroller: "body",
                trigger: ".featuresSection",
                start: "top 45%",
                end: "top 0%",
                //markers: true,
                scrub: true,
                toggleActions: "play reverse play reverse"
            },
            y: 32,
            opacity: 0,
            duration: 3.5,
            ease: 'power.in',
            stagger: 0.7,
        });

        gsap.from(ready.current, {
            scrollTrigger: {
                scroller: "body",
                trigger: ready.current,
                start: "top 45%",
                end: "top 0%",
                //markers: true,
                scrub: true,
                toggleActions: "play reverse play reverse"
            },
            y: 32,
            opacity: 0,
            duration: 3.5,
            ease: 'power.in',
            stagger: 0.7,
        });

        gsap.from(trust.current, {
            scrollTrigger: {
                scroller: "body",
                trigger: trust.current,
                start: "top 44%",
                end: "top 0%",
                scrub: true,
                toggleActions: "play reverse play reverse"
            },
            y: 32,
            opacity: 0,
            duration: 1,
            ease: 'power.in',

        });

        ScrollTrigger.refresh();

    }, []);

    console.log(username);
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <div className="container mx-auto px-4 max-w-7xl">
                <main>
                    <section className="relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                            <div className="z-10 order-2 md:order-1" ref={leftColRef}>
                                <p className="text-gray-600 mb-2">Teacher portal</p>
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8  text-orange-400">
                                    Empower
                                    <br />
                                    your teaching
                                    <br />
                                    <span className="text-black">with digital tools.</span>
                                </h1>
                                {!username ?
                                    <div className="flex flex-wrap gap-4">
                                        <button className="rounded-full px-8 py-6 bg-black text-white hover:bg-gray-800 transition-colors">
                                            Get started
                                        </button>
                                        <button className="rounded-full px-8 py-6 border border-black text-black hover:bg-gray-100 transition-colors">
                                            Learn more
                                        </button>
                                    </div> : null}
                            </div>

                            <div className="relative order-1 md:order-2" ref={rightColRef}>
                                {/* Circular text */}
                                <div className="absolute w-full h-full flex items-center justify-center circularText">
                                    <div className="w-[450px] h-[450px] animate-[spin_20s_linear_infinite]">
                                        <svg viewBox="0 0 100 100" className="w-full h-full">
                                            <path id="textPath" d="M 20,50 a 30,30 0 1,1 60,0 a 30,30 0 1,1 -60,0" fill="none" />
                                            <text className="text-[3px] uppercase tracking-widest fill-gray-400">
                                                <textPath href="#textPath">
                                                    • Upload Notes • E-Calendar • Student Progress • Assignments • Grading • Analytics • Upload
                                                    Notes • E-Calendar • Student Progress • Assignments • Grading • Analytics
                                                </textPath>
                                            </text>
                                        </svg>
                                    </div>
                                </div>
                                <div className="relative z-10 ml-auto max-w-md">
                                    <div className="absolute -z-10 right-0 bottom-0 w-[400px] h-[400px] bg-orange-400 rounded-full orangeCircle"></div>
                                    <img
                                        src="../src/assets/teacherHero.png"
                                        alt="Teacher image"
                                        className="relative z-20 object-cover w-full h-[750px] hidden md:block"
                                    />
                                    <img
                                        src="../src/assets/teacherHero.png"
                                        alt="Teacher mobile image"
                                        className="relative z-20 object-cover w-full h-[700px] block md:hidden"
                                    />


                                    <div className="absolute top-20 right-0 bg-white rounded-xl shadow-lg p-4 z-20 studentEnag">
                                        <div className="text-sm text-gray-500">Student Engagement</div>
                                        <div className="flex items-end h-16 gap-1 mt-2">
                                            <div className="w-4 bg-orange-400 h-10 rounded-sm"></div>
                                            <div className="w-4 bg-orange-400 h-14 rounded-sm"></div>
                                            <div className="w-4 bg-orange-400 h-12 rounded-sm"></div>
                                            <div className="w-4 bg-orange-400 h-8 rounded-sm"></div>
                                            <div className="w-4 bg-orange-400 h-11 rounded-sm"></div>
                                            <div className="w-4 bg-orange-400 h-9 rounded-sm"></div>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-20 right-10 bg-white rounded-xl shadow-lg p-4 z-20">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-orange-100 p-2 rounded-full">
                                                <FileText className="h-6 w-6 text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-2xl">250+</p>
                                                <p className="text-sm text-gray-500">Resources Shared</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="absolute bottom-0 left-0 bg-black text-white p-6 rounded-tr-3xl z-20 teachingTools">
                                    <div className="bg-white text-black rounded-full w-16 h-16 flex items-center justify-center mb-3">
                                        <span className="font-bold">2+</span>
                                    </div>
                                    <p className="font-medium">Teaching Tools</p>
                                </div>
                            </div>
                        </div>


                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-orange-400 -z-20"></div>
                    </section>

                    <section className="py-24 featuresSection">
                        <div className="text-center mb-16 features">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Streamline Your Teaching Process</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Our digital tools help you focus on what matters most - educating your students.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                            <div className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow features">
                                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                    <FileText className="h-8 w-8 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Upload PDF Notes</h3>
                                <p className="text-gray-600 mb-4">
                                    Easily upload and organize lecture notes, study materials, and resources for your students to access
                                    anytime.
                                </p>
                                <Link to="pdfForm" className="text-black font-medium flex items-center">
                                    Learn more
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 ml-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>


                            <div className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow features">
                                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                    <Calendar className="h-8 w-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">E-Calendar</h3>
                                <p className="text-gray-600 mb-4">
                                    Schedule classes, exams, and important events. Keep students informed with automatic notifications.
                                </p>
                                <Link to="calendar" className="text-black font-medium flex items-center">
                                    Learn more
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 ml-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>



                            <div className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow features">
                                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                    <Video className="h-8 w-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Video Call Feature</h3>
                                <p className="text-gray-600 mb-4">
                                    Connect with your students effortlessly. Our integrated video call feature enables you to hold interactive virtual classes and one-on-one sessions seamlessly.
                                </p>
                                <Link to="videocall" className="text-black font-medium flex items-center">
                                    Learn more
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 ml-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>


                        </div>
                    </section>
                    <section className="py-24 bg-black text-white rounded-3xl" ref={ready}>
                        <div className="container mx-auto px-4 text-center">
                            <h2 className="text-4xl font-bold mb-6">Ready to transform your teaching experience?</h2>
                            <p className="text-gray-300 mb-10 max-w-2xl mx-auto">
                                Join thousands of educators who are already using our platform to enhance their teaching and student
                                engagement.
                            </p>
                            <button className="rounded-full px-8 py-6 bg-orange-400 hover:bg-orange-500 text-black text-lg font-medium transition-colors">
                                Start teaching smarter
                            </button>
                        </div>
                    </section>

                    <section className="py-24" ref={trust}>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">Trusted by Leading Institutions</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Join the community of educational institutions that trust our platform.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
                            <img
                                src="../src/assets/univ1.jpg?height=50&width=150"
                                alt="University logo"
                                width={150}
                                height={50}
                                className="opacity-60 hover:opacity-100 transition-opacity"
                            />
                            <img
                                src="../src/assets/univ2.jpg?height=50&width=150"
                                alt="University logo"
                                width={150}
                                height={50}
                                className="opacity-60 hover:opacity-100 transition-opacity"
                            />
                            <img
                                src="../src/assets/univ3.jpg?height=50&width=150"
                                alt="University logo"
                                width={150}
                                height={50}
                                className="opacity-75 hover:opacity-100 transition-opacity"
                            />
                            <img
                                src="../src/assets/univ4.jpg?height=50&width=150"
                                alt="University logo"
                                width={150}
                                height={50}
                                className="opacity-75 hover:opacity-100 transition-opacity"
                            />
                        </div>
                    </section>
                </main>


            </div>
        </div>
    )
}