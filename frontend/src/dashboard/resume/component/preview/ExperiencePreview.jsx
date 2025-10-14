
const ExperiencePreview = ({ resumeInfo }) => {
  const experience = resumeInfo?.experience || [];

  if (experience.length === 0) {
    return (
      <div className="text-center text-gray-500 text-sm font-medium py-4">
        No experience data added.
      </div>
    );
  }

  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-base mb-2"
        style={{ color: "#222" }} // black
      >
        Professional Experience
      </h2>
      <hr
        className="border-[1.5px] my-2"
        style={{ borderColor: resumeInfo?.themeColor || "#fb8500" }}
      />

      {experience.map((item, index) => (
        <div key={index} className="my-5">
          <h2 className="text-base font-bold text-gray-800">
            {item?.title || "Job Title Not Specified"}
          </h2>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>
              {item?.companyName || "Company Not Specified"}
              {item?.city ? `, ${item.city}` : ""}
              {item?.state ? `, ${item.state}` : ""}
            </span>
            <span>
              {item?.startDate
                ? `${item.startDate} - ${item.endDate || "Present"}`
                : "Date not specified"}
            </span>
          </div>
          {item?.workSummary && (
            <div
              className="text-xs text-black my-1"
              dangerouslySetInnerHTML={{ __html: item.workSummary }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ExperiencePreview;