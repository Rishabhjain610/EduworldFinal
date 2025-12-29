import React from "react";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { ResumeContext } from "../../../../context/ResumeContext";
import { useContext, useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";
import { app } from "../../../../utils/firebase_config";
import { getFirestore, setDoc, doc } from "firebase/firestore";

const PersonalDetailForm = ({ resumeId, email, enableNext }) => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    jobTitle: '',
    address: '',
    phone: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (resumeInfo?.personalDetail) {
      setFormData(resumeInfo.personalDetail);
    }
  }, [resumeInfo]);

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
      await setDoc(resumeRef, { personalDetail: formData }, { merge: true });
      toast.success("Details Updated");
      enableNext(true);
    } catch (error) {
      console.error("Error updating document: ", error);
      toast.error("Failed to update details");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    enableNext(false);
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value
    };
    setFormData(newFormData);
    setResumeInfo(prev => ({
      ...prev,
      personalDetail: newFormData
    }));
  };

  return (
    <div className="p-5 shadow-lg rounded-xl border-t-4 border-orange-400 mt-10 bg-white">
      <h2 className="font-bold text-lg text-orange-500">Personal Detail</h2>
      <p className="text-orange-400">Get Started with the basic information</p>
      <form onSubmit={onSave}>
        <div className="grid grid-cols-2 mt-5 gap-3">
          <div>
            <label className="text-sm text-orange-500">First Name</label>
            <Input
              name="firstName"
              value={formData.firstName}
              required
              onChange={handleInputChange}
              className="border-orange-300 focus:border-orange-500 focus:ring-orange-200 bg-white"
            />
          </div>
          <div>
            <label className="text-sm text-orange-500">Last Name</label>
            <Input
              name="lastName"
              required
              onChange={handleInputChange}
              value={formData.lastName}
              className="border-orange-300 focus:border-orange-500 focus:ring-orange-200 bg-white"
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm text-orange-500">Job Title</label>
            <Input
              name="jobTitle"
              required
              value={formData.jobTitle}
              onChange={handleInputChange}
              className="border-orange-300 focus:border-orange-500 focus:ring-orange-200 bg-white"
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm text-orange-500">Address</label>
            <Input
              name="address"
              required
              value={formData.address}
              onChange={handleInputChange}
              className="border-orange-300 focus:border-orange-500 focus:ring-orange-200 bg-white"
            />
          </div>
          <div>
            <label className="text-sm text-orange-500">Phone</label>
            <Input
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              className="border-orange-300 focus:border-orange-500 focus:ring-orange-200 bg-white"
            />
          </div>
          <div>
            <label className="text-sm text-orange-500">Email</label>
            <Input
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="border-orange-300 focus:border-orange-500 focus:ring-orange-200 bg-white"
            />
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PersonalDetailForm;