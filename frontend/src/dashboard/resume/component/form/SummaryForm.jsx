import { Button } from "../../../../components/ui/button";
import { Textarea } from "../../../../components/ui/textarea";
import { ResumeContext } from "../../../../context/ResumeContext";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Brain, Loader2 } from "lucide-react";
import { AIchatSession } from "../../../../../services/AiModel";
import { app } from "../../../../utils/firebase_config";
import { getFirestore, setDoc, doc } from "firebase/firestore";

const prompt = `Given the job title "{jobTitle}", provide three job summary suggestions for a resume. Each suggestion should be in JSON format with fields "experience_level" (values can be "Fresher", "Mid-level", "Experienced") and "summary" (a brief summary). Output an array of JSON objects.`;

const SummaryForm = ({ resumeId, email, enableNext }) => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeContext);
  const [summary, setSummary] = useState(resumeInfo?.summary || "");
  const [loading, setLoading] = useState(false);
  const [aiGeneratedSummeryList, setAiGenerateSummeryList] = useState([]);

  useEffect(() => {
    if (summary) {
      setResumeInfo((prev) => ({
        ...prev,
        summary,
      }));
    }
  }, [summary, setResumeInfo]);

  const generateSummary = async () => {
    setLoading(true);
    try {
      const PROMPT = prompt.replace("{jobTitle}", resumeInfo?.personalDetail?.jobTitle || "Software Developer");
      const result = await AIchatSession.sendMessage(PROMPT);
      const rawResponse = await result.response.text();
      
      try {
        const parsedResponse = JSON.parse(rawResponse);
        setAiGenerateSummeryList(Array.isArray(parsedResponse) ? parsedResponse : [parsedResponse]);
      } catch {
        // Fallback mock data
        const mockData = [
          { experience_level: "Fresher", summary: "Motivated professional eager to start career in " + (resumeInfo?.personalDetail?.jobTitle || "technology") + " with strong foundation in programming and problem-solving." },
          { experience_level: "Mid-level", summary: "Experienced professional with 3-5 years in " + (resumeInfo?.personalDetail?.jobTitle || "technology") + " with proven track record of successful project delivery." },
          { experience_level: "Experienced", summary: "Senior professional with 5+ years expertise in " + (resumeInfo?.personalDetail?.jobTitle || "technology") + " leading teams and driving innovation." }
        ];
        setAiGenerateSummeryList(mockData);
      }
    } catch (error) {
      console.error("Error generating summaries:", error);
      toast.error("AI generation failed, showing sample suggestions");
    } finally {
      setLoading(false);
    }
  };

 
  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const db = getFirestore(app);
      const resumeRef = doc(
        db,
        `usersByEmail/${email}/resumes`,
        `resume-${resumeId}`
      );
      await setDoc(resumeRef, { summary }, { merge: true });
      enableNext(true);
      toast.success("Details Updated");
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Failed to update details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-4 border-t-blue-500 mt-10">
        <h2 className="font-bold text-lg">Summary Detail</h2>
        <p>Add Summary for your job title</p>
        <form className="mt-7" onSubmit={onSave}>
          <div className="flex justify-between items-end">
            <label>Add Summary</label>
            <Button
              size="sm"
              variant="outline"
              className="border-blue-500 text-blue-500 flex gap-2"
              type="button"
              onClick={generateSummary}
              disabled={loading}
            >
              <Brain className="h-4 w-4" />
              {loading ? "Generating..." : "Generate from AI"}
            </Button>
          </div>
          <Textarea
            className="mt-5"
            required
            onChange={(e) => setSummary(e.target.value)}
            value={summary}
            placeholder="Write your job summary here..."
          />
          <div className="mt-2 flex justify-end">
            <Button disabled={loading} type="submit">
              {loading ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
          </div>
        </form>
      </div>
      {aiGeneratedSummeryList.length > 0 && (
        <div className="my-5">
          <h2 className="font-bold text-lg">AI Suggestions</h2>
          {aiGeneratedSummeryList.map((item, index) => (
            <div
              key={index}
              className="p-5 shadow-lg my-4 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors border"
              onClick={() => setSummary(item.summary)}
            >
              <h2 className="font-bold my-1 text-blue-500">
                Level: <span className="text-red-500">{item.experience_level}</span>
              </h2>
              <p className="text-gray-700">{item.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SummaryForm;