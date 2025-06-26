import { Link } from "react-router-dom";
import { gsap } from 'gsap';
import { useEffect, useRef, useState } from "react";
import { BookOpen, Calendar, Code, Train, Coffee, Bot } from "lucide-react";
import studentImg from "../src/assets/student.png";
import studentMobileImg from "../src/assets/studentMobile.png";
import './StudentHome.css';
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function StudentHome({ username, onLogout }) {
    const [isOpen, setIsOpen] = useState(false);

    const leftColRef = useRef(null);
    const rightColRef = useRef(null);

    const ready = useRef(null);

    const prodLeft = useRef(null);
    const prodRight = useRef(null);

    const trust = useRef(null);
    //ye mulitple cheezo ko select karne mai kaam nahi aega, ek specific ko point karnekeliye nahi isliye class selector use karo
    //const features = useRef(null);
    const featuresSection = useRef(null);


    useGSAP(() => {

        gsap.registerPlugin(ScrollTrigger);

        const tl = gsap.timeline({
            delay: 1,
        });


        // normal animations inside timeline
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
        }, '-=0.7');


        gsap.from(".features", {
            scrollTrigger: {
                scroller: "body",
                trigger: ".featuresSection",
                start: "top 45%",
                end: "top 0%",
                scrub: true,
            },
            y: 32,
            opacity: 0,
            duration: 3.5,
            ease: 'power.in',
            stagger: 0.7,
        });

        gsap.from(prodLeft.current, {
            scrollTrigger: {
                scroller: "body",
                trigger: ".productivitySec",
                start: "top 48%",
                end: "top 0%",
                scrub: true,
            },
            x: -100,
            opacity: 0,
            duration: 3.8,
            ease: 'power.in',
        });

        gsap.from(prodRight.current, {
            scrollTrigger: {
                scroller: "body",
                trigger: ".productivitySec",
                start: "top 48%",
                end: "top 0%",
                scrub: true,
            },
            x: 100,
            opacity: 0,
            delay: 0.2,
            duration: 2,
            ease: 'power.in',
        });

        gsap.from(ready.current, {
            scrollTrigger: {
                scroller: "body",
                trigger: ready.current,
                start: "top 42%",
                end: "top 0%",
                scrub: true,
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
            },
            y: 32,
            opacity: 0,
            duration: 1,
            ease: 'power.in',
        });

        ScrollTrigger.refresh();

    }, []);


    return (
        <div className="container-fluid flex flex-col min-h-screen w-full bg-white">
            <div className="w-full px-2 md:px-6">
                <main className="w-full px-1">
                    <section className="relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                            <div className="z-10 order-2 md:order-1" ref={leftColRef}>
                                <h2 className="text-gray-600 mb-2">Smart digital campus</h2>
                                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-2 text-orange-400">
                                    Become
                                    <br />
                                    a better student
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
                            {/* Right Side: Student Image with Background Elements */}
                            <div className="relative z-10 mx-auto w-full order-1 md:order-2 md:max-w-2xl lg:max-w-3xl" ref={rightColRef}>
                                {/* Circular Animated Text behind the student image */}
                                <div className="absolute inset-0 flex items-center justify-center -z-20">
                                    <div className="w-[300px] h-[300px] md:w-[650px] md:h-[650px] animate-[spin_20s_linear_infinite]">
                                        <svg viewBox="0 0 100 100" className="w-full h-full">
                                            <path
                                                id="textPath"
                                                d="M 20,50 a 30,30 0 1,1 60,0 a 30,30 0 1,1 -60,0"
                                                fill="none"
                                            />
                                            <text className="text-[3px] uppercase tracking-widest fill-gray-400">
                                                <textPath href="#textPath">
                                                    • Railway Concession • Notes App • E-Calendar • Code Editor • Digital
                                                    Canteen • Smart Campus • Railway Concession • Notes App • E-Calendar • Code
                                                    Editor • Digital Canteen • Smart Campus
                                                </textPath>
                                            </text>
                                        </svg>
                                    </div>
                                </div>
                                {/* Orange circle behind the student image */}
                                <div className="absolute -z-10 right-0 bottom-0 w-[400px] h-[400px] bg-orange-400 rounded-full"></div>
                                {/* Student Image with custom larger height */}
                                <img
                                    src={studentImg}
                                    alt="Student image"
                                    className="relative z-20 object-cover w-full h-[700px] hidden md:block"
                                />
                                <img
                                    src={studentMobileImg}
                                    alt="Student image"
                                    className="relative z-20 object-cover w-full h-[600px] block md:hidden"
                                />
                                {/* Floating Student Chart */}
                                <div className="hidden md:inline absolute top-20 right-0 bg-white rounded-xl shadow-lg p-4 z-20">
                                    <div className="text-sm text-gray-500">Student Chart</div>
                                    <div className="flex items-end h-16 gap-1 mt-2">
                                        <div className="w-4 h-8 bg-orange-400 rounded-sm"></div>
                                        <div className="w-4 h-12 bg-orange-400 rounded-sm"></div>
                                        <div className="w-4 h-6 bg-orange-400 rounded-sm"></div>
                                        <div className="w-4 h-10 bg-orange-400 rounded-sm"></div>
                                        <div className="w-4 h-14 bg-orange-400 rounded-sm"></div>
                                        <div className="w-4 h-7 bg-orange-400 rounded-sm"></div>
                                    </div>
                                </div>
                                {/* Floating 15k+ Total Students Box */}
                                <div className="absolute bottom-20 right-10 bg-white rounded-xl shadow-lg p-4 z-20 Students15k">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-orange-100 p-2 rounded-full">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 text-orange-600"
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
                                            <p className="font-bold text-2xl">15k+</p>
                                            <p className="text-sm text-gray-500">Total Students</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Black Box with Stats */}
                                <div className="absolute bottom-0 left-0 bg-black text-white p-6 rounded-tr-3xl z-20 digital5">
                                    <div className="bg-white text-black rounded-full w-16 h-16 flex items-center justify-center mb-3">
                                        <span className="font-bold">3+</span>
                                    </div>
                                    <p className="font-medium">Your Digital Tools</p>
                                </div>
                            </div>
                        </div>

                        {/* Orange Wave at Bottom */}
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-orange-400 -z-10"></div>
                    </section>

                    {/* Digital Campus Tools Section */}
                    <section className="py-24 featuresSection">
                        <div className="text-center mb-16 features" >
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Digital Campus Tools</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Simplify your campus life with our integrated digital tools designed specifically for
                                students.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Railway Concession Feature */}
                            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-2xl transition-shadow features">
                                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                    <Train className="h-8 w-8 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Railway Concession</h3>
                                <p className="text-gray-600 mb-4">
                                    Quick access to pass applications. Submit and track your railway concession requests
                                    digitally without paperwork.
                                </p>
                                <Link to="railway" className="text-black font-medium flex items-center">
                                    Learn more
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 ml-1"
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
                            </div>
                            {/* Notes App Feature */}
                            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-shadow features">
                                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                    <BookOpen className="h-8 w-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Notes App</h3>
                                <p className="text-gray-600 mb-4">
                                    Upload and download study materials instantly. Organize your notes by subject and access
                                    them anywhere.
                                </p>
                                <Link to="getPdfs" className="text-black font-medium flex items-center">
                                    Learn more
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 ml-1"
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
                            </div>
                            {/* E-Calendar Feature */}
                            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-2xl transition-shadow features">
                                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                    <Calendar className="h-8 w-8 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">E-Calendar</h3>
                                <p className="text-gray-600 mb-4">Important event and test tracking.</p>
                                <Link to="calendar" className="text-black font-medium flex items-center">
                                    Learn more
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 ml-1"
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
                            </div>
                            {/* Code Editor Feature */}
                            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-2xl transition-shadow features">
                                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                    <Code className="h-8 w-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Code Editor</h3>
                                <p className="text-gray-600 mb-4">
                                    AI-powered code reviews and improvement suggestions. Perfect your programming skills with
                                    intelligent feedback.
                                </p>
                                <Link to="codeEditor" className="text-black font-medium flex items-center">
                                    Learn more
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 ml-1"
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
                            </div>
                            {/* Digital Canteen Feature */}
                            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-2xl transition-shadow features">
                                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                    <Coffee className="h-8 w-8 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Digital Canteen</h3>
                                <p className="text-gray-600 mb-4">
                                    Order food in advance, skip the lines. Browse menus, pay online, and get notified when your
                                    order is ready.
                                </p>
                                <Link to="canteen" className="text-black font-medium flex items-center">
                                    Learn more
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 ml-1"
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
                            </div>
                            {/* Support Feature */}
                            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-shadow features">
                                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                    <Bot className="h-8 w-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Chat Bot</h3>
                                <p className="text-gray-600 mb-4">
                                    Experience 24/7 assistance with our smart Chatbot, designed to solve doubts, generate images, and tackle problems effortlessly.
                                </p>
                                <Link to="chatbot" className="text-black font-medium flex items-center">
                                    Learn more
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 ml-1"
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
                            </div>
                        </div>
                    </section>
                    {/* Experience the Workflow Section */}
                    <section className="py-15 relative px-2 overflow-hidden productivitySec">
                        <div className="absolute -z-10 right-0 top-0 w-[250px] h-[250px] md:w-[600px] md:h-[600px] bg-orange-400 rounded-full opacity-10"></div>
                        <div className="absolute -z-10 left-0 bottom-0  w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-purple-600 rounded-full opacity-10"></div>

                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div className="order-2 md:order-1" ref={prodLeft}>
                                <h2 className="text-4xl font-bold mb-6">
                                    Experience the workflow smart students love
                                </h2>
                                <p className="text-gray-600 mb-8">
                                    Let your campus life be more organized and efficient with our integrated digital tools.
                                    Focus on learning and growing while we handle the rest.
                                </p>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-orange-100 p-3 rounded-full mt-1">
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
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">Seamless Integration</h3>
                                            <p className="text-gray-600">
                                                All tools work together in one platform, no need to switch between apps.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-purple-100 p-3 rounded-full mt-1">
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
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">Time-Saving</h3>
                                            <p className="text-gray-600">
                                                Automate routine tasks and focus on what matters most - your education.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-orange-100 p-3 rounded-full mt-1">
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
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">Mobile-Friendly</h3>
                                            <p className="text-gray-600">
                                                Access all features on any device, anytime, anywhere on campus.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="invisible md:visible order-1 md:order-2 relative" ref={prodRight}>
                                <div className="border rounded-3xl shadow-lg mx-10">
                                    <DotLottieReact
                                        src="https://lottie.host/e196c9c3-2d8f-4808-9b66-28a71500c060/qVNS98ACCW.lottie"
                                        loop
                                        autoplay
                                    />
                                </div>

                                <div className="invisible md:visible absolute -top-10 -left-10 bg-white rounded-xl shadow-lg p-4 z-20">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-orange-100 p-2 rounded-full">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 text-orange-600"
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
                                            <p className="font-bold">Productivity</p>
                                            <p className="text-sm text-gray-500">Increased by 40%</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="invisible md:visible absolute -bottom-10 -right-0 bg-white rounded-xl shadow-lg p-4 z-50">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-purple-100 p-2 rounded-full">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 text-purple-600"
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
                                            <p className="font-bold">Time Saved</p>
                                            <p className="text-sm text-gray-500">5+ hours weekly</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* Call-to-Action Section */}
                    <section className="py-24 bg-black text-white rounded-3xl" ref={ready}>
                        <div className="container mx-auto px-4 text-center">
                            <h2 className="text-4xl font-bold mb-6">
                                Ready to transform your campus experience?
                            </h2>
                            <p className="text-gray-300 mb-10 max-w-2xl mx-auto">
                                Join thousands of students who are already enjoying the benefits of our digital campus platform.
                            </p>
                            <button className="rounded-full px-8 py-6 bg-orange-400 hover:bg-orange-500 text-black text-lg font-medium transition-colors">
                                Get started now
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
            </div >
        </div >
    );
}