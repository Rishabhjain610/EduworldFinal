/* eslint-disable react/prop-types */
const ExperiencePreview = ({ resumeInfo }) => {
  const experience = resumeInfo?.experience || [];

  if (experience.length === 0) {
    return (
      <div className="text-center text-gray-500 text-sm font-medium py-4">
        No job experience data added.
      </div>
    );
  }

  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-base mb-2"
        style={{ color: resumeInfo?.themeColor || "#4c87ff" }}
      >
        Professional Experience
      </h2>
      <hr
        className="border-[1.5px] my-2"
        style={{ borderColor: resumeInfo?.themeColor || "#6b7280" }}
      />
      {experience.map((exp, index) => (
        <div key={index} className="my-5">
          <h2 className="text-sm font-bold text-gray-800">
            {exp?.title || "Position title not provided"}
          </h2>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>
              {(exp?.companyName || "Company not specified") +
                (exp?.city ? `, ${exp.city}` : "") +
                (exp?.state ? `, ${exp.state}` : "")}
            </span>
            <span>
              {(exp?.startDate || "Start date not provided") +
                " - " +
                (exp?.endDate || "Present")}
            </span>
          </div>
          <div
            className="text-xs my-2 text-justify"
            dangerouslySetInnerHTML={{
              __html: exp?.workSummary || "No work summary provided.",
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default ExperiencePreview;