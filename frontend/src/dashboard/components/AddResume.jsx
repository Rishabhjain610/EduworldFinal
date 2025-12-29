import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/Dialog";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Loader2, PlusSquare } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddResume = ({ onResumeCreated }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userEmail = "demo@example.com"; // Replace with actual user email if available

  const onCreate = () => {
    setLoading(true);
    const newResumeId = uuidv4();

    setTimeout(() => {
      toast.success("Resume Created Successfully!");

      if (onResumeCreated) {
        onResumeCreated({ resumeId: newResumeId, title: resumeTitle });
      }

      setLoading(false);
      setOpenDialog(false);

      navigate(`/dashboard/resume/edit`);
    }, 1000);
  };

  return (
    <div>
      <div
        className="p-14 py-24 border-2 border-orange-300 items-center flex justify-center bg-white rounded-xl h-[280px] hover:scale-105 transition-all hover:shadow-lg cursor-pointer border-dashed"
        onClick={() => setOpenDialog(true)}
      >
        <PlusSquare className="text-orange-500" size={48} />
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-white rounded-xl border border-orange-200">
          <DialogHeader>
            <DialogTitle className="text-orange-500">Create New Resume</DialogTitle>
            <DialogDescription className="text-orange-400">
              Add a title for your new resume
              <Input
                className="my-2 border-orange-300 focus:border-orange-500 focus:ring-orange-200"
                placeholder="Ex. Full Stack Developer"
                onChange={(e) => setResumeTitle(e.target.value)}
                value={resumeTitle}
              />
            </DialogDescription>
            <div className="flex justify-end gap-5 mt-2">
              <Button onClick={() => setOpenDialog(false)} variant="ghost" className="text-orange-400">
                Cancel
              </Button>
              <Button
                disabled={!resumeTitle || loading}
                onClick={onCreate}
                className="bg-orange-500 text-white hover:bg-orange-600"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Create"}
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddResume;