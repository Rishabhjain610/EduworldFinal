import React from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { useContext, useEffect, useState, useCallback } from "react";
import RichTextEditor from "../RichTextEditor";
import { ResumeContext } from "../../../../context/ResumeContext";
import { toast } from "react-toastify";
import { LoaderCircle, Brain } from "lucide-react";
import { app } from "../../../../utils/firebase_config";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { AIchatSession } from "../../../../../services/AiModel";

const formField = {
  school: "",
  degree: "",
  city: "",
  state: "",
  fieldOfStudy: "",
  graduationDate: "",
  description: "",
};

const Education = ({ resumeId, email, enableNext }) => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeContext);
  const [educationList, setEducationList] = useState(() => 
    resumeInfo?.education?.length > 0 ? resumeInfo.education : [formField]
  );
  const [loading, setLoading] = useState(false);
  const [shouldUpdateContext, setShouldUpdateContext] = useState(false);
  const [aiLoadingIndex, setAiLoadingIndex] = useState(null);

  useEffect(() => {
    if (shouldUpdateContext) {
      setResumeInfo(prev => ({
        ...prev,
        education: educationList
      }));
      setShouldUpdateContext(false);
    }
  }, [shouldUpdateContext, setResumeInfo, educationList]);

  const handleChange = useCallback((index, event) => {
    const { name, value } = event.target;
    setEducationList(prev => {
      const newEntries = [...prev];
      newEntries[index][name] = value;
      return newEntries;
    });
    setShouldUpdateContext(true);
  }, []);

  const addNewEducation = useCallback(() => {
    setEducationList(prev => [...prev, { ...formField }]);
    setShouldUpdateContext(true);
  }, []);

  const removeEducation = useCallback(() => {
    if (educationList.length > 1) {
      setEducationList(prev => prev.slice(0, -1));
      setShouldUpdateContext(true);
    }
  }, [educationList.length]);

  const handleRichTextEditor = useCallback((e, name, index) => {
    setEducationList(prev => {
      const newEntries = [...prev];
      newEntries[index][name] = e.target.value;
      return newEntries;
    });
    setShouldUpdateContext(true);
  }, []);

  const generateCoursesAI = async (index) => {
    setAiLoadingIndex(index);
    const edu = educationList[index];
    const prompt = `List 3-5 key technical courses completed in the degree "${edu.degree}" with field of study "${edu.fieldOfStudy}" at "${edu.school}". Return only the course names as a comma-separated string, nothing else. Do not include any HTML tags or extra formatting.`;

    try {
      const result = await AIchatSession.sendMessage(prompt);
      const aiText = await result.response.text();
      const newEntries = educationList.slice();
      newEntries[index].description = aiText;
      setEducationList(newEntries);
      setShouldUpdateContext(true);
      toast.success("AI courses generated!");
    } catch (error) {
      toast.error("AI generation failed");
    } finally {
      setAiLoadingIndex(null);
    }
  };

  const onSave = async () => {
    setLoading(true);
    try {
      const db = getFirestore(app);
      const resumeRef = doc(
        db,
        `usersByEmail/${email}/resumes`,
        `resume-${resumeId}`
      );
      await setDoc(resumeRef, { education: educationList }, { merge: true });
      setLoading(false);
      toast.success("Education details updated!");
      enableNext(true);
    } catch (error) {
      setLoading(false);
      console.error("Error saving to Firestore:", error);
      toast.error("Error updating education details!");
    }
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-xl border-t-4 border-orange-400 mt-10 bg-white">
        <h2 className="font-bold text-lg text-orange-500">Education</h2>
        <p className="text-orange-400">Add your educational background</p>
        <div>
          {educationList.map((item, index) => (
            <div key={index}>
              <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-xl border-orange-200 bg-white">
                <div>
                  <label className="text-xs text-orange-500">School/University</label>
                  <Input
                    name="school"
                    value={item.school}
                    onChange={(event) => handleChange(index, event)}
                    className="border-orange-300 focus:border-orange-500 focus:ring-orange-200 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-orange-500">Degree</label>
                  <Input
                    name="degree"
                    value={item.degree}
                    onChange={(event) => handleChange(index, event)}
                    className="border-orange-300 focus:border-orange-500 focus:ring-orange-200 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-orange-500">City</label>
                  <Input
                    name="city"
                    value={item.city}
                    onChange={(event) => handleChange(index, event)}
                    className="border-orange-300 focus:border-orange-500 focus:ring-orange-200 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-orange-500">State</label>
                  <Input
                    name="state"
                    value={item.state}
                    onChange={(event) => handleChange(index, event)}
                    className="border-orange-300 focus:border-orange-500 focus:ring-orange-200 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-orange-500">Field of Study</label>
                  <Input
                    name="fieldOfStudy"
                    value={item.fieldOfStudy}
                    onChange={(event) => handleChange(index, event)}
                    className="border-orange-300 focus:border-orange-500 focus:ring-orange-200 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-orange-500">Graduation Date</label>
                  <Input
                    type="date"
                    name="graduationDate"
                    value={item.graduationDate}
                    onChange={(event) => handleChange(index, event)}
                    className="border-orange-300 focus:border-orange-500 focus:ring-orange-200 bg-white"
                  />
                </div>
                <div className="col-span-2">
                  <div className="flex justify-between items-end">
                    <label className="text-xs text-orange-500">Courses (AI Generated)</label>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-orange-400 text-orange-500 flex gap-2"
                      type="button"
                      disabled={aiLoadingIndex === index}
                      onClick={() => generateCoursesAI(index)}
                    >
                      <Brain className="h-4 w-4" />
                      {aiLoadingIndex === index ? (
                        <LoaderCircle className="animate-spin h-4 w-4" />
                      ) : (
                        "Generate from AI"
                      )}
                    </Button>
                  </div>
                  <RichTextEditor
                    index={index}
                    value={item.description}
                    onRichTextEditorChange={(event) =>
                      handleRichTextEditor(event, "description", index)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={addNewEducation}
              className="text-orange-500 border-orange-400"
            >
              + Add More Education
            </Button>
            <Button
              variant="outline"
              onClick={removeEducation}
              className="text-orange-500 border-orange-400"
            >
              - Remove
            </Button>
          </div>
          <Button disabled={loading} onClick={onSave} className="bg-orange-500 text-white hover:bg-orange-600">
            {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Education;