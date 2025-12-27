# 🎓 EduWorld

**EduWorld** is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application designed for seamless interaction between teachers and students. It features real-time communication, document generation, intelligent chat, and a rich educational ecosystem powered by modern technologies.

---


## 🚀 Tech Stack

### 🧩 Frontend
- **React.js**
- **Material UI (MUI)** + **Tailwind CSS**
- **GSAP** (Animations)

### 🔧 Backend
- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**

### 📦 APIs & Libraries
- **Gemini API** (Google AI)
- **Hugging Face** (AI/NLP/Image)
- **Twilio** (WhatsApp/SMS)
- **Cloudinary** (File/Image Storage)
- **Multer** (File Uploads)
- **jsPDF** (PDF Generation)

---

## 👥 User Roles

### 👨‍🏫 Teacher Panel
- Upload notes using Multer and Cloudinary
- Mark/update shared event calendar
- Conduct video meetings with:
  - Screen share
  - Audio/video
  - Inbuilt chat
- Fully responsive interface

### 👨‍🎓 Student Panel
- 📄 **Railway Concession Form Generator**:
  - Generates PDF using jspdf
- 🧠 **AI Chatbot**:
  - Text-based Q&A
  - Image recognition
  - Image generation
- 📚 **Notes Viewer**:
  - View and download notes uploaded by teachers
- 🍱 **Online Canteen**:
  - Order food
  - Generate bill (PDF)
  - Get WhatsApp confirmation using Twilio
- 📅 **Event Calendar**:
  - View events and announcements from teachers
- 💻 **Code Editor**:
  - Write, debug, and detect errors in code

---

## 🧩 Features Summary

| Feature                  | Student Side ✅ | Teacher Side ✅ |
|--------------------------|----------------|-----------------|
| Railway Concession PDF   | ✅              | ❌              |
| AI Chatbot (Text/Image)  | ✅              | ❌              |
| Notes Upload/View        | ✅ (view)       | ✅ (upload)     |
| Online Canteen + Billing | ✅              | ❌              |
| Event Calendar           | ✅ (view only)  | ✅ (add/edit)   |
| Code Editor              | ✅              | ❌              |
| Video Calling            | ✅              | ✅              |

---
## 📽️ Demo

https://github.com/user-attachments/assets/b81ca59d-f86c-4735-a1f9-23b3d53a5322

## Version 2

# EduWorld – AI-Powered Digital Campus

EduWorld is an AI-first digital campus platform that unifies key academic and campus workflows into a single dashboard – railway concessions, notes, AI tools, calendar, code editor, canteen, chat, video classes, analytics, attendance, resume builder, and more.[page:3][page:4]

---

## 🚀 Features

### 1. Railway Concession PDF Generator
- Digital railway concession form where students fill details like ID, name, class, route, etc.
- Generates a well-formatted concession PDF using **jsPDF** for download/print.
- Minimizes manual paperwork and speeds up concession processing.

### 2. Notes Uploader & Viewer
- Teachers upload notes (PDFs) organized by subject/class.
- Students can:
  - View notes inside the platform.
  - Download notes for offline usage.

### 3. AI PDF Summarizer & Chat with PDF
- AI summarizer creates concise summaries of uploaded/selected PDFs.
- Students can **chat with the contents of a PDF**:
  - All answers are grounded strictly in that PDF.
  - Responses are powered by **Google Gemini**.

### 4. Smart Academic Calendar
- Teachers can create events with date, time, title, and description.
- Full **CRUD** access for teachers (create, update, delete events).
- Students can only view events so they stay updated on tests, deadlines, and activities.

### 5. Multi-language UI (Google Translate)
- Google Translate widget integrated into the UI.
- Makes the interface **multilingual** (e.g., Hindi, Marathi, Arabic, French, German, Spanish, etc.) so language is not a barrier to learning.[page:3]

### 6. AI-Powered Code Editor
- In-browser code editor supporting:
  - C, C++, Java, Python, JavaScript.
- Code can be executed from the editor.
- On **AI Review**:
  - Code is sent to **Gemini**.
  - Gemini detects bugs and logical issues and suggests fixes and improvements.

### 7. Digital Canteen with Payments
- Students add food items to a cart.
- On confirming the order:
  - **Razorpay** payment gateway opens for secure payment.
  - After successful payment:
    - WhatsApp confirmation is sent to the student.
    - A PDF bill is generated via **jsPDF** and shared/downloaded.

### 8. AI Chatbot (Study Assistant)
- Gemini-based chatbot to help with:
  - General study queries.
  - Concept explanations.
  - Doubt solving while revising or doing homework.
- Supports normal chat as well as academic Q&A.

### 9. AI Image Tools
- Image generation using **ZB Tech** (or similar) image generation API.
- Image recognition to analyze uploaded images and respond contextually.
- Normal text chat flows handled via Gemini.

### 10. Video Lectures Module
- Teachers upload lecture videos.
- Videos are tagged by:
  - Subject.
  - Class/semester/branch.
- Students can filter and watch relevant videos anytime.

### 11. Real-time Chat Application
- Group chat for classes/batches.
- Direct 1:1 chat between:
  - Teacher ↔ Student.
  - Student ↔ Student (optional based on configuration).
- **AI Chat Summarizer**:
  - Uses Gemini to summarize long chat histories.
  - Helps students quickly catch up on missed discussions.

### 12. AI Resume Builder
- AI-based resume builder for students.
- Generates **ATS-friendly** resumes in **PDF** format.
- Uses Gemini to:
  - Structure sections (Education, Projects, Skills, Experience, etc.).
  - Improve bullet points.
  - Tailor profiles for internships and placements.

### 13. Analytics – Upload Marks (Excel)
- Teacher uploads an Excel/CSV file containing:
  - Student identifiers (Roll No, Name, etc.).
  - Subject-wise marks, totals.
  - Remarks or comments.
- Gemini analyzes the sheet and generates:
  - Student-wise performance analytics.
  - Subjects where a student can score better.
  - Personalized improvement suggestions.[page:4]

### 14. Meet (Live Classes with ZegoCloud)
- Teacher can host live online classes using **ZegoCloud SDK**.
- Features include:
  - Audio/video conferencing.
  - Screen sharing for slides, code, or demos.
  - In-built chat during the meet.
- Designed to mimic a normal online classroom experience.

### 15. ML-based Face Recognition Attendance
- **Upload Attendance** module uses ML/face recognition.
- Teacher uploads/captures class images/video frames.
- System detects students’ faces and marks attendance automatically.
- Reduces manual roll calls and improves accuracy.

---

## 🧩 Tech Stack (Example – Update as Needed)

- **Frontend:** React + Vite, Tailwind CSS.
- **Backend:** Node.js / Express.
- **Database:** MongoDB .
- **AI:** Google Gemini API for chat, code review, PDF QA, analytics, resume, summarization.
- **Payments:** Razorpay.
- **PDF Handling:** jsPDF.
- **Real-time Chat & Meet:** Socket.io / ZegoCloud SDK / WebSockets.
- **Storage:** Cloud storage (e.g., Cloudinary/S3) or local server storage.
- **Translations:** Google Translate widget.


---



## 👤 Roles & Permissions

### Student
- View/download notes.
- View calendar events.
- Use AI PDF summarizer & chat with PDF.
- Use code editor and AI review.
- Order from canteen and make payments.
- Join live meets.
- Use AI chatbot, image tools, and video library.
- Chat (group + direct) and view AI chat summaries.
- Generate resumes via AI.
- View analytics generated for them (if exposed in UI).

### Teacher
- Upload notes and lecture videos.
- Manage calendar events (CRUD).
- Upload marks Excel for analytics.
- Create and host meets using ZegoCloud.
- Use attendance module with ML-based face recognition.
- Participate in chats and manage academic communication.

---

## 🧠 AI Modules Overview

- **Gemini** used for:
  - General chatbot.
  - Chat with PDF.
  - Code review and debugging.
  - Chat summarization.
  - Resume generation.
  - Analytics from Excel marks.
- **Image API (ZB Tech)** used for:
  - Image generation.
  - Image recognition/understanding.

---



Version 2

https://github.com/user-attachments/assets/b2e87bf2-b533-4dac-9170-add400a8bdde

