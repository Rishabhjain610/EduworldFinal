/* eslint-disable react/prop-types */
const EducationalPreview = ({ resumeInfo }) => {
  const education = resumeInfo?.education || [];

  if (education.length === 0) {
    return (
      <div className="text-center text-gray-500 text-sm font-medium py-4">
        No educational data added.
      </div>
    );
  }

  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-base mb-2"
        style={{ color: resumeInfo?.themeColor || "#4c87ff" }}
      >
        Education
      </h2>
      <hr
        className="border-[1.5px] my-2"
        style={{ borderColor: resumeInfo?.themeColor || "rgb(107 114 128)" }}
      />

      {education.map((item, index) => (
        <div key={index} className="my-5">
          <h2 className="text-sm font-bold text-gray-800">
            {item?.universityName || "University Not Specified"}
          </h2>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>
              {item?.degree || "Degree not specified"}
              {item?.major ? ` in ${item.major}` : ""}
            </span>
            <span>
              {item?.startDate
                ? `${item.startDate} - ${item.endDate || "Present"}`
                : "Date not specified"}
            </span>
          </div>
          {/* AI-fetched courses list */}
          {item?.description && (
            <div className="text-xs text-gray-700 my-1">
              <span className="font-semibold">Courses:</span>{" "}
              {item.description.split(",").map((course, i) => (
                <span
                  key={i}
                  className="inline-block bg-blue-50 text-blue-700 rounded px-2 py-0.5 mr-1 mb-1"
                >
                  {course.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EducationalPreview;