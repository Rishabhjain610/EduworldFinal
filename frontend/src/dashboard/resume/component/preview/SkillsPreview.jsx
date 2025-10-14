
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
      <div className="flex flex-wrap gap-2 justify-center">
        {skills.map((item, index) => (
          <span
            key={index}
            className="inline-block bg-orange-50 text-black rounded px-2 py-0.5"
          >
            {item.name} {item.rating ? `(${item.rating}/5)` : ""}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillsPreview;