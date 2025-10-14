
const SummaryDetails = ({ resumeInfo }) => {
  const summary = resumeInfo?.summary || "";

  if (!summary) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="text-black text-base text-center mb-2">
        {summary}
      </div>
      <hr className="border-[1.5px] my-2" style={{ borderColor: resumeInfo?.themeColor || "#fb8500" }} />
    </div>
  );
};

export default SummaryDetails;