# 🎓 EduWorld – AI-Powered Digital Campus Platform

**EduWorld** is an AI-first, full-stack digital campus ecosystem designed for modern educational institutions. It unifies academic management, real-time collaboration, document processing, intelligent multimodal AI assistance, online canteen payments, and administrative workflows into a role-based dashboard for students and teachers.

---

## 📽️ Project Evolution & Release History (Descending Order)

```
Version 3 (Latest) ──► Version 2 ──► Version 1 (Initial Release)
```

---

## 🚀 Version 3 (Latest Release)

### 📽️ Demo (Version 3)
https://github.com/user-attachments/assets/85e9f5cc-3e66-463c-aba8-f83790d13572

### 🌟 Core Modules & Architecture

---

### 💬 1. Smart Chat Room (With AI Summarizer)
A real-time communication system enhanced with Google Gemini AI capabilities.
- **Multi-user Chat**: Student-to-Teacher and batch-wide discussions.
- **Room & Direct Messaging**: Real-time WebSocket communication via **Socket.io**.
- **Persistence**: Chat history & direct messages stored in **MongoDB**.
- **Live User Tracking**: Active online user presence & typing indicators.
- **AI Chat Summarizer**: One-click meeting & conversation summarizer powered by **Google Gemini (gemini-2.5-flash)** to extract key takeaways, action items, and revision notes.

---

### 🧠 2. AI Learning Assistant (Notes + Q&A + PDF Summarization)
- **Document Upload & Storage**: Upload PDF lecture notes via **Multer** and stream to **Cloudinary CDN**.
- **Text Extraction**: Automatic backend text extraction and indexing using `pdf-parse-new`.
- **Context-Aware Note Q&A**: Strict in-document RAG-style conversational Q&A powered by **Gemini 2.5 Flash** (system-prompted to answer strictly from document context).
- **Concise PDF Summarizer**: Generates 2-paragraph summaries of extensive study material with MongoDB caching.

---

### 📅 3. Smart Academic Calendar
- **Full CRUD Management**: Teacher-exclusive event creation, updates, and deletions for lectures, assignment deadlines, and exam dates.
- **Student View**: Interactive, synchronized calendar view for all class members.
- **FullCalendar Integration**: Visual monthly, weekly, and daily agendas.

---

### 📊 4. AI Marks Analyzer & Performance Insights
- **Excel Ingestion**: Upload spreadsheet marksheets (`.xlsx`, `.csv`) processed by **SheetJS / xlsx**.
- **Automated Grade & Performance Evaluation**: Calculates percentages, subject-level breakdowns, class averages, and grade distributions.
- **AI Personalized Feedback**: Generates automated subject-specific feedback (strengths, improvement areas, recommendations) using **Gemini 1.5 Flash** with rule-based subject fallback.
- **Data Visualization**: Dynamic analytics charts generated via **Chart.js** & **react-chartjs-2**.

---

### 🔎 5. AI Search & Research Agent (Google Search + Gemini AI)
- **Automated Web Research**: Queries Google Custom Search API (`v1/customsearch`) to retrieve top indexed educational articles and snippets.
- **AI Synthesis**: Passes retrieved search context into **Gemini 2.5 Flash-Lite** to synthesize a cohesive, citation-free explanatory research brief.

---

### 📺 6. YouTube Educational Video Hub
- Search and stream curriculum-relevant educational video lectures directly within the platform.
- Clean embedded video player with instant topic search.

---

### 📖 7. E-Library (Google Books API)
- Real-time book discovery powered by **Google Books API**.
- Search by title, author, or ISBN with metadata, synopsis preview, and direct reading/purchase links.

---

### 🍽️ 8. Digital E-Canteen System
- **Interactive Menu & Cart**: Live food item selection, quantity adjustment, and order staging.
- **Payment Gateway**: End-to-end checkout with **Razorpay** (HMAC-SHA256 signature verification).
- **Instant Invoicing**: Downloadable PDF tax invoice generated via **jsPDF** & **jspdf-autotable**.
- **Automated WhatsApp Notifications**: **Twilio WhatsApp API** sends instant "Order Placed" confirmation and automated "Order Ready for Pickup" alerts.

---

### 🚆 9. Railway Concession Form Generator
- Streamlined digital application form for student rail travel concessions.
- Generates official, standardized concession passes in **PDF** format using **jsPDF**.

---

### 💻 10. AI Code Editor & Compiler
- Multi-language in-browser code editor supporting C, C++, Java, Python, and JavaScript.
- **Code Execution**: Powered by the **JDoodle API** compiler backend.
- **AI Code Review**: Automated code inspection, bug detection, time/space complexity analysis, and refactoring tips powered by **Gemini 2.5 Flash**.

---

### 📹 11. Live Virtual Classrooms (ZegoCloud SDK)
- Live interactive audio/video lecture rooms powered by **ZegoCloud WebRTC UIKit**.
- Supports screen sharing, participant grid, and real-time in-meeting chat.

---

### 📝 12. AI-Powered Resume Builder
- Dynamic resume creation wizard with live template preview and PDF export.
- AI generation of professional profile summaries, experience bullet points, and project descriptions powered by **Google Gemini (gemini-2.5-flash)**.

---

### 🎨 13. Multimodal AI Assistant & Image Generation
- **Multimodal Conversational AI**: In-chat AI assistant supporting text and image input powered by **Gemini 2.5 Flash** (`gemini-2.5-flash:generateContent`).
- **Text-to-Image Generation**: Prompt-to-image synthesis powered by **Hugging Face Router (fal-ai/fast-sdxl)**.

---

<br/>

## 🛠️ Version 2

### 📽️ Demo (Version 2)
https://github.com/user-attachments/assets/b2e87bf2-b533-4dac-9170-add400a8bdde

### 🚀 Key Additions in Version 2
- **Expanded AI Capabilities**: Introduction of Gemini API for code review, PDF Q&A, chat summarization, and resume building.
- **Razorpay Integration**: Transitioned canteen payments to online transactions with Razorpay API.
- **Live Video Conferencing**: Added ZegoCloud-powered live classroom streaming with screen sharing.
- **Multilingual Support**: Added Google Translate widget for instant multi-language UI localization (Hindi, Marathi, French, German, Spanish, Arabic).
- **Teacher Video Portal**: Cloudinary video uploads categorized by branch, semester, and subject.
- **Face Recognition Attendance (Prototype)**: Experimental image-based attendance module.

---

<br/>

## 📦 Version 1 (Initial Release)

### 📽️ Demo (Version 1)
https://github.com/user-attachments/assets/b81ca59d-f86c-4735-a1f9-23b3d53a5322

### 💡 Initial Features
- Basic MERN stack foundation with student and teacher panels.
- Railway Concession PDF generation with **jsPDF**.
- Teacher notes upload via **Multer** and **Cloudinary**.
- Online Canteen ordering with Twilio WhatsApp order alerts.
- Academic Event Calendar for lecture tracking.
- Foundational in-browser Code Editor and AI chatbot.

---

## 🤖 AI Models & Generative AI Architecture Breakdown

The table below details the exact model identifiers, SDKs, and integration methods verified directly against the codebase:

| Feature / Capability | Exact Model Identifier | Provider / SDK / Route | Purpose & Prompting |
|---|---|---|---|
| **AI Chat Room Summarizer** | `gemini-2.5-flash` | `@google/generative-ai` (Backend) | Extracts key discussion takeaways, action items, and revision notes from chat transcripts. |
| **Notes Summarization (PDF)** | `gemini-2.5-flash` | `@google/generative-ai` (Backend) | Generates concise 2-paragraph summaries from extracted PDF text (with MongoDB caching). |
| **Chat with Notes (PDF Q&A)** | `gemini-2.5-flash` | `@google/generative-ai` (Backend) | Context-aware strict RAG conversational Q&A constrained strictly to the lecture PDF document. |
| **Marks Analyzer & Insights** | `gemini-1.5-flash` | `@google/generative-ai` (Backend) | Analyzes student marks, percentage, and teacher remarks to generate grades, strengths, improvements & recommendations. |
| **AI Search & Research Agent** | `gemini-2.5-flash-lite` | `@google/generative-ai` (Backend) | Synthesizes Google Custom Search retrieved snippets and knowledge into an academic research brief. |
| **AI Code Review & Quality** | `gemini-2.5-flash` | `@google/genai` (Backend) | Performs automated code review, bug detection, complexity evaluation, and refactoring tips. |
| **AI Resume Builder** | `gemini-2.5-flash` | `@google/generative-ai` (Frontend) | Generates ATS-friendly summaries, experience bullet points, and education details (`AIchatSession`). |
| **Multimodal Chat Assistant** | `gemini-2.5-flash` | Google Generative Language REST API (`v1beta`) | Multimodal prompt & image query resolution with exponential backoff & jitter retry handling. |
| **AI Text-to-Image Generator** | `fal-ai/fast-sdxl` | Hugging Face Router API | Fast Stable Diffusion XL image generation directly from user prompts. |

---

## 💻 Tech Stack Summary

| Layer | Technologies |
|---|---|
| **Frontend** | React.js 18 (Vite), Tailwind CSS 4, Material UI (MUI), Framer Motion, GSAP, Chart.js, FullCalendar |
| **Backend** | Node.js, Express.js, MongoDB (Mongoose), Socket.io, Multer |
| **AI Models & LLMs** | Google Gemini 2.5 Flash (`gemini-2.5-flash`), Gemini 2.5 Flash-Lite (`gemini-2.5-flash-lite`), Gemini 1.5 Flash (`gemini-1.5-flash`), Hugging Face Fast-SDXL (`fal-ai/fast-sdxl`) |
| **Cloud & APIs** | Cloudinary CDN, Razorpay Payments, Twilio WhatsApp API, Google Custom Search API, Google Books API, JDoodle Compiler API, ZegoCloud WebRTC, Firebase Auth |
| **Document Processing** | jsPDF, jspdf-autotable, pdf-parse-new, SheetJS (xlsx), ExcelJS |

---

## 👥 Roles & Permissions Matrix

| Feature / Module | Student Side | Teacher Side |
|---|:---:|:---:|
| Railway Concession PDF Generator | ✅ Fill & Download | ❌ |
| AI Learning Assistant & Chat with Notes | ✅ View & Query | ✅ Upload & Manage |
| Smart Academic Calendar | 👁️ View Only | ✏️ Full CRUD |
| AI Marks Analyzer & Performance Dashboard | 👁️ View Analytics | 📤 Upload Excel & Generate |
| AI Search Agent (Google Search + Gemini) | ✅ Available | ✅ Available |
| E-Library & YouTube Video Search | ✅ Available | ✅ Available |
| Digital Canteen & Razorpay Checkout | ✅ Order & Pay | ❌ |
| Live Video Classes (ZegoCloud) | 👥 Join Meet | 🎙️ Host & Manage |
| Video Lecture Library | 👁️ Stream & Filter | 📤 Upload by Semester |
| AI ATS Resume Builder | ✅ Generate & Export | ❌ |
| AI Code Editor & Compiler | ✅ Write, Run & Review | ❌ |
| Real-Time Socket.io Group & 1:1 Chat | ✅ Available | ✅ Available |

---

## ⚙️ Installation & Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/Rishabhjain610/EduworldFinal.git
cd EduworldFinal
```

### 2. Configure Environment Variables
Create `.env` in `backend/` and `frontend/`:

**`backend/.env`**:
```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
TOKEN_KEY=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
API_KEY=your_gemini_api_key
GOOGLE_API_KEY=your_google_custom_search_api_key
GOOGLE_CX=your_google_search_engine_cx
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_FROM=your_twilio_whatsapp_number
CLIENT_ID_JDOODLE=your_jdoodle_client_id
CLIENT_SECRET_JDOODLE=your_jdoodle_client_secret
```

**`frontend/.env`**:
```env
VITE_SERVER_URL=http://localhost:5000
VITE_GEMINI_API_URL=your_gemini_api_key
VITE_HUGGINGFACE_API_URL=your_huggingface_api_token
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 3. Run Backend
```bash
cd backend
npm install
npm run dev
```

### 4. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
