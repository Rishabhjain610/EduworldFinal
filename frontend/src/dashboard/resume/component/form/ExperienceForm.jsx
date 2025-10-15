
import React from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { useContext, useEffect, useState } from "react";
import { ResumeContext } from "../../../../context/ResumeContext";
import { LoaderCircle, Brain, Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import RichTextEditor from "../RichTextEditor";
import { app } from "../../../../utils/firebase_config";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { AIchatSession } from "../../../../../services/AiModel";

// Prompt for generating a new summary
const PROMPT_GENERATE =
  'Job Title: {positionTitle}. Based on this job title, provide 4-5 ATS-friendly bullet points for a resume. Each bullet point should describe a key achievement or responsibility. Return the result as an HTML unordered list (<ul><li>...</li></ul>).';

// Prompt for modifying an existing summary
const PROMPT_MODIFY =
  'Job Title: {positionTitle}. Based on this title, review and improve the following resume bullet points for ATS-friendliness, clarity, and impact. Ensure the output is an HTML unordered list (<ul><li>...</li></ul>). \n\n{existingSummary}';

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

  // AI Generation logic
  const GenerateSummaryFromAI = async (index) => {
    if (!experienceList[index]?.title) {
      toast.error("Please add a Position Title first.");
      return;
    }
    setAiLoadingIndex(index);

    const existingSummary = experienceList[index].workSummary;
    let finalPrompt;
    const hasContent = existingSummary && existingSummary.trim().replace(/<[^>]*>?/gm, '').length > 0;

    if (hasContent) {
      // If there is content, modify it
      finalPrompt = PROMPT_MODIFY
        .replace('{positionTitle}', experienceList[index].title)
        .replace('{existingSummary}', existingSummary);
    } else {
      // If there is no content, generate from scratch
      finalPrompt = PROMPT_GENERATE.replace('{positionTitle}', experienceList[index].title);
    }

    try {
      const result = await AIchatSession.sendMessage(finalPrompt);
      let resp = (await result.response.text())
        .replace('```html', '')
        .replace('```', '')
        .trim();

      resp = resp.replace(/\*/g, '');

      if (!resp.startsWith('<ul>')) {
        const lines = resp
          .split('\n')
          .map(line => line.replace(/^[-*]\s*/, '').trim())
          .filter(line => line.length > 0);
        resp = `<ul>${lines.map(line => `<li>${line}</li>`).join('')}</ul>`;
      }

      const newEntries = [...experienceList];
      newEntries[index].workSummary = resp;
      setExperienceList(newEntries);
      toast.success("AI summary updated!");
    } catch (error) {
      toast.error("AI generation failed.");
      console.error(error);
    } finally {
      setAiLoadingIndex(null);
    }
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-xl border-t-4 border-orange-400 mt-10 bg-white">
        <h2 className="font-bold text-lg text-orange-500">Professional Experience</h2>
        <p className="text-orange-400">Add your previous job experience</p>
        <div>
          {experienceList.map((item, index) => {
            const hasContent = item.workSummary && item.workSummary.trim().replace(/<[^>]*>?/gm, '').length > 0;
            return (
              <div key={index}>
                <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-xl border-orange-200 bg-white">
                  <div>
                    <label className="text-xs text-orange-500">Position Title</label>
                    <Input name="title" onChange={(event) => handleChange(index, event)} value={item?.title || ''} className="border-orange-300 focus:border-orange-500 focus:ring-orange-200 bg-white" />
                  </div>
                  <div>
                    <label className="text-xs text-orange-500">Company Name</label>
                    <Input name="companyName" onChange={(event) => handleChange(index, event)} value={item?.companyName || ''} className="border-orange-300 focus:border-orange-500 focus:ring-orange-200 bg-white" />
                  </div>
                  <div>
                    <label className="text-xs text-orange-500">City</label>
                    <Input name="city" onChange={(event) => handleChange(index, event)} value={item?.city || ''} className="border-orange-300 focus:border-orange-500 focus:ring-orange-200 bg-white" />
                  </div>
                  <div>
                    <label className="text-xs text-orange-500">State</label>
                    <Input name="state" onChange={(event) => handleChange(index, event)} value={item?.state || ''} className="border-orange-300 focus:border-orange-500 focus:ring-orange-200 bg-white" />
                  </div>
                  <div>
                    <label className="text-xs text-orange-500">Start Date</label>
                    <Input type="date" name="startDate" onChange={(event) => handleChange(index, event)} value={item?.startDate || ''} className="border-orange-300 focus:border-orange-500 focus:ring-orange-200 bg-white" />
                  </div>
                  <div>
                    <label className="text-xs text-orange-500">End Date</label>
                    <Input type="date" name="endDate" onChange={(event) => handleChange(index, event)} value={item?.endDate || ''} className="border-orange-300 focus:border-orange-500 focus:ring-orange-200 bg-white" />
                  </div>
                  <div className="col-span-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs text-orange-500">Work Summary</label>
                      <Button
                        variant="outline" size="sm" type="button"
                        onClick={() => GenerateSummaryFromAI(index)}
                        disabled={aiLoadingIndex === index}
                        className="flex gap-2 border-orange-400 text-orange-500"
                      >
                        {aiLoadingIndex === index ? (
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : hasContent ? (
                          <><Sparkles className="h-4 w-4" /> Improve with AI</>
                        ) : (
                          <><Brain className="h-4 w-4" /> Generate from AI</>
                        )}
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
            )
          })}
        </div>
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={AddNewExperience} className="text-orange-500 border-orange-400">+ Add More Experience</Button>
            <Button variant="outline" onClick={RemoveExperience} className="text-orange-500 border-orange-400">- Remove</Button>
          </div>
          <Button disabled={loading} onClick={onSave} className="bg-orange-500 text-white hover:bg-orange-600">
            {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceForm;