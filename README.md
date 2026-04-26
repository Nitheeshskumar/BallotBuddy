# 🗳️ BallotBuddy: Interactive Election Navigator

**BallotBuddy** is a full-stack web application designed to simplify and gamify the U.S. election process, making it accessible, transparent, and educational for every citizen.

---

## 🎯 Hackathon Details
- **Chosen Vertical:** Election Process Education
- **Mission:** To bridge the information gap in the democratic process by providing real-time, non-partisan data and interactive practice tools.

---

## 🛠️ How It Works (Features)

### 1. **Interactive Election Roadmap**
Powered by the **Google Civic Information API**, users can enter their full US address to see upcoming elections, polling locations, and registration deadlines.
- **Logic:** The backend proxies requests to ensure API key security and implements a robust fallback strategy. If a default election is unknown, it dynamically fetches the list of all active elections and matches the user's state to provide the most relevant data.

### 2. **Ballot Simulator**
A "flight simulator for voting." Users can practice the mechanics of casting a vote using a drag-and-drop interface.
- **Goal:** Reduce "ballot anxiety" and familiarize voters with common ballot structures.
- **Implementation:** Built using `@hello-pangea/dnd` for smooth, accessible interactive elements.

### 3. **Myth-Buster AI Chat**
A dedicated sidebar powered by **Google Gemini (gemini-1.5-flash)** that acts as an objective, non-partisan assistant.
- **Functionality:** Answers questions about voting rules, deadlines, and requirements while debunking common election myths.
- **Safety:** Implements a strict system prompt to ensure responses remain objective and redirect users to official government sources (like vote.gov) for critical legal advice.

### 4. **Civic Quest (Gamification)**
Uses a "Democracy Level" progress bar to reward users for exploring different sections of the app.
- **Implementation:** Progress is persisted in `localStorage`, giving users a sense of accomplishment without requiring account creation (lowering the barrier to entry).

---

## 🏗️ Technical Architecture & Approach

### **Monolithic Strategy for Deployment**
The application uses a monolithic structure where the **Node.js (Express)** backend serves the **React (Vite)** frontend as static assets.
- **Why:** This minimizes latency, simplifies deployment on a single Cloud Run service, and reduces the complexity of cross-origin resource sharing (CORS).

### **Google Services Integration**
- **Google Cloud Run:** Orchestrates the multi-stage Docker build and hosts the application with auto-scaling capabilities.
- **Google Civic Information API:** Provides the authoritative data backbone for polling and election info.
- **Google Gemini API:** Provides the intelligence for the Myth-Buster AI Chat.
- **Google Secret Manager:** Securely handles API keys for both Gemini and Civic Info, ensuring zero exposure in the source code or build logs.

### **Design Principles**
- **Code Quality:** Modular React components, clean separation of API routes, and comprehensive error handling (especially for API fallbacks).
- **Security:** Secret Manager integration, URL encoding of user inputs, and strict non-partisan AI system prompts.
- **Efficiency:** Multi-stage Docker builds ensure the production image contains only the necessary runtime files (Alpine-based Node.js), keeping the image size small and startup times fast.
- **Accessibility:** Semantic HTML5, ARIA labels for drag-and-drop elements, and a high-contrast Tailwind UI designed to meet WCAG 2.1 standards.

---

## 🧠 Assumptions & Fallbacks
1. **API Data Availability:** It is assumed that the Google Civic API data may be sparse during "off-seasons." To mitigate this, the app includes a fallback mechanism that queries the broader election list when a specific address search returns an "Election Unknown" error.
2. **Local Storage:** The app assumes users are using a single device for their "Civic Quest" progress.
3. **Regional Focus:** Currently optimized for the U.S. election cycle as per Google Civic API coverage.

---

## 🚀 Setup & Deployment
1. **Clone the repository.**
2. **Environment Variables:** Create a `.env` in the root based on `.env.example`.
3. **Local Run:** 
   - Backend: `cd backend && npm start`
   - Frontend: `cd frontend && npm run dev`
4. **Cloud Deployment:**
   ```bash
   gcloud run deploy ballotbuddy-service --source . --region us-central1 --allow-unauthenticated
   ```
