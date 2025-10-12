import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { useContext, useEffect, useState } from "react";
import { ResumeContext } from "../../../../context/ResumeContext";
import { LoaderCircle, Brain } from "lucide-react";
import { toast } from "react-toastify";
import RichTextEditor from "../RichTextEditor";
import { app } from "../../../../utils/firebase_config";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { AIchatSession } from "../../../../../services/AiModel";

// ✅ FIXED: Improved prompt for better formatting
const PROMPT =
  'Job Title: {positionTitle}. Based on this job title, provide 4-5 ATS-friendly bullet points for a resume. Each bullet point should describe a key achievement or responsibility. Return the result as an HTML unordered list (<ul><li>...</li></ul>).';

const formField = {
  title: "",
  companyName: "",
  city: "",
  state: "",
  startDate: "",
  endDate: "",
  workSummary: "",
};

const ExperienceForm = ({ resumeId, email, enableNext }) => {
  const [experienceList, setExperienceList] = useState([formField]);
  const { resumeInfo, setResumeInfo } = useContext(ResumeContext);
  const [loading, setLoading] = useState(false);
  const [aiLoadingIndex, setAiLoadingIndex] = useState(null);

  useEffect(() => {
    if (resumeInfo?.experience?.length > 0) {
      setExperienceList(resumeInfo.experience);
    }
  }, [resumeInfo]);

  useEffect(() => {
    setResumeInfo(prev => ({
      ...prev,
      experience: experienceList
    }));
  }, [experienceList, setResumeInfo]);

  const onSave = async () => {
    setLoading(true);
    try {
      const db = getFirestore(app);
      const resumeRef = doc(db, `usersByEmail/${email}/resumes`, `resume-${resumeId}`);
      await setDoc(resumeRef, { experience: experienceList }, { merge: true });
      toast.success("Details updated!");
      enableNext(true);
    } catch (error) {
      console.error("Error saving to Firestore:", error);
      toast.error("Error updating details!");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index, event) => {
    const newEntries = [...experienceList];
    const { name, value } = event.target;
    newEntries[index][name] = value;
    setExperienceList(newEntries);
  };

  const AddNewExperience = () => {
    setExperienceList([...experienceList, { ...formField }]);
  };

  const RemoveExperience = () => {
    if (experienceList.length > 1) {
      setExperienceList(experienceList.slice(0, -1));
    }
  };

  const handleRichTextEditor = (e, index) => {
    const newEntries = [...experienceList];
    newEntries[index]['workSummary'] = e.target.value;
    setExperienceList(newEntries);
  };

  // ✅ FIXED: AI Generation logic is now correctly placed here
  const GenerateSummaryFromAI = async (index) => {
    if (!experienceList[index]?.title) {
      toast.error("Please add a Position Title first.");
      return;
    }
    setAiLoadingIndex(index);
    const prompt = PROMPT.replace('{positionTitle}', experienceList[index].title);
    try {
      const result = await AIchatSession.sendMessage(prompt);
      const resp = (await result.response.text()).replace('```html', '').replace('```', '');
      const newEntries = [...experienceList];
      newEntries[index].workSummary = resp;
      setExperienceList(newEntries);
      toast.success("AI summary generated!");
    } catch (error) {
      toast.error("AI generation failed.");
      console.error(error);
    } finally {
      setAiLoadingIndex(null);
    }
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Professional Experience</h2>
        <p>Add Your previous Job experience</p>
        <div>
          {experienceList.map((item, index) => (
            <div key={index}>
              <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
                <div>
                  <label className="text-xs">Position Title</label>
                  <Input name="title" onChange={(event) => handleChange(index, event)} value={item?.title || ''} />
                </div>
                <div>
                  <label className="text-xs">Company Name</label>
                  <Input name="companyName" onChange={(event) => handleChange(index, event)} value={item?.companyName || ''} />
                </div>
                <div>
                  <label className="text-xs">City</label>
                  <Input name="city" onChange={(event) => handleChange(index, event)} value={item?.city || ''} />
                </div>
                <div>
                  <label className="text-xs">State</label>
                  <Input name="state" onChange={(event) => handleChange(index, event)} value={item?.state || ''} />
                </div>
                <div>
                  <label className="text-xs">Start Date</label>
                  <Input type="date" name="startDate" onChange={(event) => handleChange(index, event)} value={item?.startDate || ''} />
                </div>
                <div>
                  <label className="text-xs">End Date</label>
                  <Input type="date" name="endDate" onChange={(event) => handleChange(index, event)} value={item?.endDate || ''} />
                </div>
                <div className="col-span-2">
                  {/* ✅ FIXED: AI Button is now here, where it belongs */}
                  <div className="flex justify-between items-center">
                    <label className="text-xs">Work Summary</label>
                    <Button
                      variant="outline" size="sm" type="button"
                      onClick={() => GenerateSummaryFromAI(index)}
                      disabled={aiLoadingIndex === index}
                      className="flex gap-2 border-primary text-primary"
                    >
                      {aiLoadingIndex === index ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <><Brain className="h-4 w-4" /> Generate from AI</>}
                    </Button>
                  </div>
                  <RichTextEditor
                    index={index}
                    value={item.workSummary}
                    onRichTextEditorChange={handleRichTextEditor}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={AddNewExperience} className="text-primary">+ Add More Experience</Button>
            <Button variant="outline" onClick={RemoveExperience} className="text-primary">- Remove</Button>
          </div>
          <Button disabled={loading} onClick={onSave}>
            {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceForm;