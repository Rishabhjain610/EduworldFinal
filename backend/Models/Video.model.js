const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Semester-Subject mapping
const SEMESTER_SUBJECTS = {
  "1st Sem": [
    "Mathematics-1", 
    "Physics-1", 
    "Chemistry-1", 
    "BEE", // Basic Electrical Engineering
    "Mechanics", 
    "Engineering Graphics"
  ],
  "2nd Sem": [
    "Mathematics-2",
    "Physics-2", 
    "Chemistry-2", 
    "PCE", // Programming for Computer Engineering
    "Programming in C",
    "Engineering Drawing"
  ],
  "3rd Sem": [
    "Mathematics-3",
    "Data Structures",
    "Digital Logic Design",
    "Object Oriented Programming",
    "Discrete Mathematics",
    "Computer Graphics"
    
  ],
  "4th Sem": [
    "Analysis of Algorithms",
    "Database Management Systems",
    "Computer Organization and Architecture",
    "Mathematics-4",
    "Operating Systems",
    
  ],
  "5th Sem": [
    
    "Software Engineering",
    "Computer Networks",
    "Theory of Computation",
    "Internet Programming",
    "Data warehousing and Data Mining",
  ],
  "6th Sem": [
    "Machine Learning",
    "Cloud Computing",
    "Distributed Systems",
    "Human Computer Interaction",
    "Project Management",
    "Elective-1"
  ],
  "7th Sem": [
    "Data Mining",
    "Internet of Things",
    "Blockchain Technology",
    "Digital Image Processing",
    "Network Security",
    "Elective-2"
  ],
  "8th Sem": [
    "Major Project",
    "Industrial Training",
    "Advanced Topics",
    "Research Methodology",
    "Entrepreneurship",
    "Elective-3"
  ]
};

// Get all unique subjects for enum validation
const getAllSubjects = () => {
  const allSubjects = new Set();
  Object.values(SEMESTER_SUBJECTS).forEach(subjects => {
    subjects.forEach(subject => allSubjects.add(subject));
  });
  return Array.from(allSubjects).sort();
};

const videoLectureSchema = new Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 200
  },
  description: { 
    type: String, 
    required: true,
    maxlength: 1000
  },
  subject: { 
    type: String, 
    required: true,
    enum: getAllSubjects()
  },
  semester: { 
    type: String, 
    required: true,
    enum: ["1st Sem", "2nd Sem", "3rd Sem", "4th Sem", "5th Sem", "6th Sem", "7th Sem", "8th Sem"]
  },
  videoUrl: { 
    type: String, 
    required: true
  },
  duration: { 
    type: Number, // Duration in seconds
    default: 0
  },
  fileSize: { 
    type: Number, // File size in bytes
    default: 0
  },
  cloudinaryId: { 
    type: String, 
    required: true
  },
  uploadedBy: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true
});

// Custom validation to ensure subject belongs to selected semester
videoLectureSchema.pre('save', function(next) {
  const semesterSubjects = SEMESTER_SUBJECTS[this.semester];
  if (!semesterSubjects || !semesterSubjects.includes(this.subject)) {
    return next(new Error(`Subject "${this.subject}" is not valid for ${this.semester}`));
  }
  next();
});

// Index for better search performance
videoLectureSchema.index({ title: "text", description: "text" });
videoLectureSchema.index({ subject: 1, semester: 1 });
videoLectureSchema.index({ uploadedBy: 1, createdAt: -1 });

const VideoLecture = model("VideoLecture", videoLectureSchema);

module.exports = { VideoLecture, SEMESTER_SUBJECTS };