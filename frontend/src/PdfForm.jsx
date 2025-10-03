import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Paper,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  PictureAsPdf as PdfIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";

export default function PdfForm({ username }) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("comps"); // default branch option
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Define subject lists for each year
  const subjectsByYear = {
    FE: [
      "Engineering Physics - I",
      "Engineering Physics - II",
      "Engineering Chemistry-I",
      "Engineering Chemistry-II",
      "Engineeing Mechanics",
      "Basic Electrical Engineering",
      "Engineering Mathematics I",
      "Engineering Mathematics II",
      "Engineering Graphics",
      "Professional Communication-I",
    ],
    SE: [
      "Engineering Mathematics-III",
      "DSGT",
      "DS",
      "DLCA",
      "Computer Graphics",
      "Engineering Mathematics-IV",
      "AOA",
      "MP",
      "OS",
      "DBMS",
    ],
    TE: [
      "Microprocessors",
      "Microcontrollers",
      "Control Systems",
      "Signals and Systems",
      "Thermodynamics",
      "Fluid Mechanics",
    ],
    BE: [
      "Advanced Engineering Mathematics",
      "Structural Analysis",
      "Design of Machine Elements",
      "Electrical Machines",
      "Fluid Mechanics",
      "Heat Transfer",
    ],
  };

  // Update subjectOptions when year changes
  useEffect(() => {
    if (year in subjectsByYear) {
      setSubjectOptions(subjectsByYear[year]);
      // Optionally clear subject if current value is not in new list
      setSubject("");
    } else {
      setSubjectOptions([]);
    }
  }, [year]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setErrorMessage("Please upload a PDF file");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      // Auto-fill file name (without extension)
      const nameWithoutExtension = selectedFile.name.replace(/\.pdf$/, "");
      setFileName(nameWithoutExtension);
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage("Please select a PDF file");
      return;
    }
    if (!fileName.trim()) {
      setErrorMessage("Please enter a file name");
      return;
    }
    if (!subject.trim()) {
      setErrorMessage("Please select a subject");
      return;
    }
    if (!year) {
      setErrorMessage("Please select a year");
      return;
    }
    if (!branch) {
      setErrorMessage("Please select a branch");
      return;
    }

    setIsUploading(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    formData.append("subject", subject);
    formData.append("year", year);
    formData.append("branch", branch);
    formData.append("uploadedBy", username);

    try {
      const result = await axios.post(
        "http://localhost:8080/api/pdf/upload-files",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(result.data);
      setUploadStatus("success");
      setFile(null);
      setFileName("");
      setSubject("");
      setYear("");
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMessage("Error uploading file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="my-[10%]" sx={{ maxWidth: 500, mx: "auto", boxShadow: 3 }}>
      <CardHeader
        title="Upload PDF Document"
        subheader="Upload your PDF file with relevant information"
        sx={{ pb: 0 }}
      />
      <CardContent sx={{ pt: 2 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ "& > :not(style)": { mb: 3 } }}
        >
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Choose File
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                height: 100,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                borderStyle: "dashed",
                p: 2,
                textAlign: "center",
              }}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              {file ? (
                <>
                  <PdfIcon
                    sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                    sx={{ maxWidth: "100%" }}
                  >
                    {file.name}
                  </Typography>
                </>
              ) : (
                <>
                  <UploadIcon sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="body2">Click to select PDF</Typography>
                </>
              )}
            </Paper>
            <input
              id="file-upload"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </Box>

          <TextField
            fullWidth
            label="Name of the File"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter file name"
            variant="outlined"
          />

          <FormControl fullWidth variant="outlined">
            <InputLabel id="year-label">Year</InputLabel>
            <Select
              labelId="year-label"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              label="Year"
            >
              <MenuItem value={"FE"}>FE</MenuItem>
              <MenuItem value={"SE"}>SE</MenuItem>
              <MenuItem value={"TE"}>TE</MenuItem>
              <MenuItem value={"BE"}>BE</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel id="subject-label">Subject</InputLabel>
            <Select
              labelId="subject-label"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              label="Subject"
            >
              {subjectOptions.map((subj, index) => (
                <MenuItem key={index} value={subj}>
                  {subj}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel id="branch-label">Branch</InputLabel>
            <Select
              labelId="branch-label"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              label="Branch"
            >
              <MenuItem value="comps">Comps</MenuItem>
              {/* If needed, add more branches here */}
            </Select>
          </FormControl>

          {errorMessage && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "error.main",
              }}
            >
              <ErrorIcon fontSize="small" />
              <Typography variant="body2">{errorMessage}</Typography>
            </Box>
          )}

          {uploadStatus === "success" && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "success.main",
              }}
            >
              <CheckCircleIcon fontSize="small" />
              <Typography variant="body2">
                File uploaded successfully!
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          disabled={isUploading || uploadStatus === "success"}
          onClick={handleSubmit}
          style={{ backgroundColor: "#FB923C" }}
        >
          {isUploading ? "Uploading..." : "Upload PDF"}
        </Button>
      </CardActions>
    </Card>
  );
}
