# 🧠 BrainBuddy AI

**BrainBuddy AI** is a premium, hyper-optimized study planning ecosystem designed for maximum cognitive efficiency. Featuring a sleek **Glassmorphism** aesthetic, it combines narrative productivity with deep-logic AI to help you master complex subjects.

![BrainBuddy AI Preview](file:///C:/Users/nivri/.gemini/antigravity/brain/1641de99-abf3-4cec-9f6f-91ca27e74eee/brainbuddy_ai_preview_1776927237945.png)

---


## ✨ Key Features

### 💎 Premium Visual Experience
*   **Glassmorphism UI**: High-fidelity dark mode with deep blurs, neon accents, and smooth Framer Motion animations.
*   **Dynamic Design System**: Custom color tokens and utility classes for a cohesive, premium feel.

### 📅 AI-Driven Study Planner
*   **Hyper-Optimized Scheduling**: Generates study plans based on your available hours, mood, and subject difficulty.
*   **Reality Mode**: A global toggle that activates a high-intensity coaching protocol and synchronizes with the AI assistant.
*   **Custom Start Times**: Plan your study day precisely by specifying your starting moment.

### 📚 Knowledge Management
*   **Academic Roadmap**: Full CRUD support for subjects and topics with custom time-allocation limits.
*   **Study Notes**: Take and save persistent insights directly within the integrated Knowledge Library.
*   **Deep Analytics**: Track your focus efficiency, mood impact, and academic streaks.

### 🤖 Neural Link (Chatbot)
*   **Context-Aware Assistant**: The chatbot knows your current focus blocks and roadmap, providing real-time coaching.

---

## 🛠️ Tech Stack

### Frontend
*   **React** (Vite)
*   **Tailwind CSS** (Premium Styling)
*   **Framer Motion** (Animations)
*   **Lucide React** (Icons)
*   **Axios** (API Management)

### Backend
*   **Node.js & Express**
*   **MongoDB** (Persistent & In-Memory modes)
*   **OpenAI/Gemini** (Contextual AI Engine)

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/Nivrithi206/brainbuddy-ai.git
cd brainbuddy-ai
```

### 2. Setup Backend
```bash
cd backend
npm install
# Add your API keys to .env (OPENAI_API_KEY)
npm run dev
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```

---

## 🔗 Access Links
*   **Local Preview**: [http://localhost:5174/](http://localhost:5174/)
*   **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
*   **Project Roadmap**: [http://localhost:5174/subjects](http://localhost:5174/subjects)

---


## ☁️ Deployment

### Backend (Render)
1. Set root directory to `backend`.
2. Start command: `npm start`.
3. Set environment variable `MONGO_URI`.

### Frontend (Vercel)
1. Set root directory to `frontend`.
2. Set environment variable `VITE_API_URL` to your backend URL + `/api`.

---

## 📄 License
MIT License. Created by [Nivrithi](https://github.com/Nivrithi206).
