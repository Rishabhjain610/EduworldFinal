import React from "react";
import { ResumeContext } from "../../../../context/ResumeContext";
import { useEffect, useState } from "react";
import FormSection from "../../component/FormSection";
import ResumePreview from "../../component/ResumePreview";

const EditResume = () => {
  const [resumeInfo, setResumeInfo] = useState({
    personalDetail: {},
    summary: '',
    experience: [],
    education: [],
    skills: [],
    themeColor: '#4c87ff'
  });

  return (
    <ResumeContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div className="grid grid-cols-1 md:grid-cols-2 p-10 gap-10">
        {/* Form Section */}
        <FormSection />
        {/* Resume Preview */}
        <ResumePreview />
      </div>
    </ResumeContext.Provider>
  );
};

export default EditResume;
