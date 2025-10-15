
import React from "react";

const SkillsPreview = ({ resumeInfo }) => {
  const skills = resumeInfo?.skills || [];

  if (skills.length === 0) {
    return (
      <div className="text-center text-gray-500 text-sm font-medium py-4">
        No skills data added.
      </div>
    );
  }

  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-base mb-2"
        style={{ color: "#222" }} // black
      >
        Skills
      </h2>
      <hr
        className="border-[1.5px] my-2"
        style={{ borderColor: resumeInfo?.themeColor || "#fb8500" }}
      />
      <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-4">
        {skills.map((skill, index) => (
          <div key={index} className="flex items-center justify-between">
            <h3 className="text-sm font-medium">{skill.name}</h3>
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-xl ${
                    i < skill.rating ? "text-orange-400" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsPreview;