import React from "react";
import AddResume from "./components/AddResume";
import { useState } from "react";

const Dashboard = () => {
  const [resumeList, setResumeList] = useState([
    { id: "resume-1", title: "Software Engineer Resume" },
    { id: "resume-2", title: "Full Stack Developer Resume" },
  ]);
  const [loading, setLoading] = useState(false);

  const getResumesList = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center p-10 md:px-20 lg:px-32 bg-white shadow-xl rounded-2xl border border-orange-200">
          <h1 className="font-bold text-4xl text-orange-500 mb-2 tracking-tight">
            My Resume
          </h1>
          <p className="text-orange-400 mt-2 text-lg mb-7">
            Start Creating AI Resume for your next job role
          </p>
          <div className="mt-7">
            <AddResume />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;