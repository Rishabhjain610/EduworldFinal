import React from "react";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { LoaderCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ResumeContext } from "../../../../context/ResumeContext";
import { toast } from "react-toastify";
import { app } from "../../../../utils/firebase_config";
import { getFirestore, setDoc, doc } from "firebase/firestore";

const formField = {
  name: "",
  rating: 0,
};

const Skills = ({ resumeId, email, enableNext }) => {
  const [skillsList, setSkillsList] = useState([formField]);
  const { resumeInfo, setResumeInfo } = useContext(ResumeContext);
  const params = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (resumeInfo?.skills?.length > 0) {
      setSkillsList(resumeInfo.skills);
    }
  }, [resumeInfo]);

  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      skills: skillsList,
    });
  }, [skillsList]);

  const handleChange = (index, name, value) => {
    const newEntries = skillsList.slice();
    newEntries[index][name] = value;
    setSkillsList(newEntries);
  };

  const AddNewSkills = () => {
    setSkillsList([...skillsList, { ...formField }]);
  };

  const RemoveSkills = () => {
    setSkillsList((skillsList) => skillsList.slice(0, -1));
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
      await setDoc(
        resumeRef,
        {
          skills: skillsList.map((skill) => ({
            name: skill.name || "",
            rating: skill.rating || 0,
          })),
        },
        { merge: true }
      );
      setLoading(false);
      toast.success("Skills updated successfully!");
      enableNext(true);
    } catch (error) {
      setLoading(false);
      console.error("Error saving to Firestore:", error);
      toast.error("Error updating skills!");
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-xl border-t-4 border-orange-400 mt-10 bg-white">
      <h2 className="font-bold text-lg text-orange-500">Skills</h2>
      <p className="text-orange-400">Add Your top professional key skills</p>

      <div>
        {skillsList.map((item, index) => (
          <div
            className="flex justify-between mb-2 border rounded-xl p-3 border-orange-200 bg-white"
            key={index}
          >
            <div>
              <label className="text-xs text-orange-500">Name</label>
              <Input
                className="w-full border-orange-300 focus:border-orange-500 focus:ring-orange-200 bg-white"
                value={item.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />
            </div>
            <Rating
              style={{ maxWidth: 120 }}
              value={item.rating}
              onChange={(v) => handleChange(index, "rating", v)}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={AddNewSkills}
            className="text-orange-500 border-orange-400"
          >
            + Add More Skill
          </Button>
          <Button
            variant="outline"
            onClick={RemoveSkills}
            className="text-orange-500 border-orange-400"
          >
            - Remove
          </Button>
        </div>
        <Button disabled={loading} onClick={() => onSave()} className="bg-orange-500 text-white hover:bg-orange-600">
          {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default Skills;