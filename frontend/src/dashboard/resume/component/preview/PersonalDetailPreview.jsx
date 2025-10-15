import React from "react";
const PersonalDetailPreview = ({ resumeInfo }) => {
  const personal = resumeInfo?.personalDetail || {};

  return (
    <div className="mb-6">
      <h1 className="text-center font-bold text-2xl mb-1 text-black">
        {personal.firstName || ""} {personal.lastName || ""}
      </h1>
      <h2 className="text-center font-semibold text-lg mb-1 text-black">
        {personal.jobTitle || ""}
      </h2>
      <div className="text-center text-sm text-gray-700 mb-1">
        {personal.address || ""}
      </div>
      <div className="flex justify-between text-xs text-gray-700 mb-2">
        <span>{personal.phone || ""}</span>
        <span>{personal.email || ""}</span>
      </div>
      <hr className="border-[1.5px] my-2" style={{ borderColor: resumeInfo?.themeColor || "#fb8500" }} />
    </div>
  );
};

export default PersonalDetailPreview;