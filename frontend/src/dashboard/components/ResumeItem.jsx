import React from "react";
import {
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "../../components/ui/AlertDialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/DropdownMenu";
import { Loader2Icon, MoreVertical } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ResumeItem = ({ resume, refreshData }) => {
  const navigate = useNavigate();
  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  // Hardcoded email for the user
  const userEmail = "testuser@example.com";

  const onDelete = async () => {
    setLoading(true);

    try {
      toast.success("Resume Deleted!");
      refreshData(); // Mocking refresh
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast.error("Failed to delete resume.");
    } finally {
      setLoading(false);
      setOpenAlert(false);
    }
  };

  // Download handler: open the view page and trigger print
  const handleDownload = () => {
    const url = `/dashboard/resume/${userEmail}/${resume.resumeId}/view`;
    const win = window.open(url, "_blank");
  };

  return (
    <div>
      <Link to={`/dashboard/resume/${userEmail}/${resume.resumeId}/view`}>
        <div
          className="p-14 bg-gradient-to-bl from-orange-100 to-white h-[280px] rounded-t-xl border-t-4 border-orange-400"
        >
          <div className="flex items-center justify-center h-[180px]">
            <img
              src="https://cdn-icons-png.flaticon.com/512/5988/5988999.png"
              className="hover:rotate-6 hover:scale-125 transition-all"
              alt="Resume"
            />
          </div>
        </div>
      </Link>
      <div
        className="border border-orange-200 p-3 flex justify-between text-orange-700 rounded-b-xl shadow-lg bg-white"
      >
        <h2 className="text-sm font-semibold">Resume ID: {resume.resumeId}</h2>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical className="h-4 w-4 cursor-pointer text-orange-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() =>
                navigate(`/dashboard/resume/${userEmail}/${resume.resumeId}/edit`)
              }
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                navigate(`/dashboard/resume/${userEmail}/${resume.resumeId}/view`)
              }
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownload}>
              Download
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenAlert(true)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={openAlert}>
          <AlertDialogContent className="bg-white border border-orange-200 rounded-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-orange-500">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-orange-400">
                This action cannot be undone. This will permanently delete your
                resume and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpenAlert(false)} className="text-orange-400">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} disabled={loading} className="bg-orange-500 text-white hover:bg-orange-600">
                {loading ? <Loader2Icon className="animate-spin" /> : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ResumeItem;