import { Button } from "../../../components/ui/button";
import { ResumeContext } from "../../../context/ResumeContext";
import { Brain, LoaderCircle } from "lucide-react";
import { useContext, useState } from "react";
import {
  BtnBold,
  BtnBulletList,
  BtnClearFormatting,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnRedo,
  BtnStrikeThrough,
  BtnStyles,
  BtnUnderline,
  BtnUndo,
  Editor,
  EditorProvider,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";
import { AIchatSession } from "../../../../services/AiModel";
import { toast } from "react-toastify";

const PROMPT =
  "Provide 4-5 ATS friendly bullet points for {positionTitle} position. Return only the bullet points as HTML li elements, no additional text or formatting.";

const RichTextEditor = ({ onRichTextEditorChange, index, defaultValue }) => {
  const [value, setValue] = useState(defaultValue);
  const { resumeInfo, setResumeInfo } = useContext(ResumeContext);
  const [loading, setLoading] = useState(false);

  // const GenerateSummaryFromAI = async () => {
  //   if (!resumeInfo?.experience?.[index]?.title) {
  //     toast.error("Please add Position Title");
  //     return;
  //   }

  //   setLoading(true);
  //   const prompt = PROMPT.replace('{positionTitle}', resumeInfo?.experience[index]?.title);

  //   try {
  //     const result = await AIchatSession.sendMessage(prompt);
  //     const resp = await result.response.text();
  //     setValue(resp.replace('[', '').replace(']', ''));
  //   } catch (error) {
  //     console.error("AI generation failed:", error);
  //     // Fallback content
  //     const fallbackContent = `
  //       <ul>
  //         <li>Managed and executed ${resumeInfo?.experience[index]?.title} responsibilities effectively</li>
  //         <li>Collaborated with cross-functional teams to achieve project goals</li>
  //         <li>Implemented best practices and improved operational efficiency</li>
  //         <li>Delivered high-quality results within specified timelines</li>
  //       </ul>
  //     `;
  //     setValue(fallbackContent);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const GenerateSummaryFromAI = async () => {
    setLoading(true);
    if (!resumeInfo.experience[index].title) {
      toast.error("Please add position title");
      setLoading(false);
      return;
    }
    const prompt = PROMPT.replace(
      "{positionTitle}",
      resumeInfo?.experience[index]?.title
    );
    try {
      const result = await AIchatSession.sendMessage(prompt);
      const resp = await result.response.text();
      setValue(resp.replace("[", "").replace("]", "").replace(/"/g, ""));
      const updatedExperience = [...resumeInfo.experience];
      updatedExperience[index].workSummary = resp
        .replace("[", "")
        .replace("]", "")
        .replace(/"/g, "");
      setResumeInfo({ ...resumeInfo, experience: updatedExperience });
    } catch (error) {
      toast.error("AI generation failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="flex justify-between my-2">
        <label className="text-xs">Summary</label>
        <Button
          variant="outline"
          size="sm"
          onClick={GenerateSummaryFromAI}
          disabled={loading}
          className="flex gap-2 border-primary text-primary"
        >
          {loading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Brain className="h-4 w-4" /> Generate from AI
            </>
          )}
        </Button>
      </div>
      <EditorProvider>
        <Editor
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onRichTextEditorChange(e);
            const updatedExperience = [...resumeInfo.experience];
            updatedExperience[index].workSummary = e.target.value;
            setResumeInfo({ ...resumeInfo, experience: updatedExperience });
          }}
        >
          <Toolbar>
            <BtnUndo />
            <BtnRedo />
            <Separator />
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
};

export default RichTextEditor;
