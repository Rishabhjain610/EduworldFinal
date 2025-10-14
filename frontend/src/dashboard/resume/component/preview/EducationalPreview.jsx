
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
        style={{ color: "#222" }} // black
      >
        Education
      </h2>
      <hr
        className="border-[1.5px] my-2"
        style={{ borderColor: "#fb8500" }}
      />

      {education.map((item, index) => (
        <div key={index} className="my-5">
          <h2 className="text-sm font-bold text-gray-800">
            {item?.school || "University Not Specified"}
          </h2>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>
              {item?.degree || "Degree not specified"}
              {item?.major ? ` in ${item.major}` : ""}
            </span>
            <span>
              {item?.graduationDate
                ? item.graduationDate
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
                  className="inline-block bg-orange-50 text-black rounded px-2 py-0.5 mr-1 mb-1"
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