# Unified Campus Intelligence Dashboard

"One place for everything happening on campus."

## 📌 Project Overview
College campuses have data scattered everywhere—from legacy library portals to PDFs for cafeteria menus. This project unifies them by building a dashboard featuring an embedded **Intelligence Agent**. Instead of building a massive centralized database, the system implements independent MCP-style services for each domain. The AI dynamically queries these services in real time based on user requests.

## 🏗 Architecture Diagram
```
Student
   │
   ▼
Next.js Dashboard
   │
   ▼
FastAPI Intelligence Agent (Routing & Conversation Persistence via SQLite/SQLAlchemy)
   │
   ▼
Gemini 2.5 Flash Router (Tool Calling)
   │
   ▼
┌────────────────┬────────────────┬────────────────┬────────────────┐
│  Library MCP   │ Cafeteria MCP  │   Events MCP   │ Academics MCP  │
│  (FastAPI)     │  (FastAPI)     │  (FastAPI)     │  (FastAPI)     │
│  Port: 3001    │  Port: 3002    │  Port: 3003    │  Port: 3004    │
└────────────────┴────────────────┴────────────────┴────────────────┘
```

## ✨ Features
*   **Unified Dashboard:** Aggregates Library, Cafeteria, Events, Academics, and Timetable data.
*   **Soft Minimal UI:** Built with Tailwind CSS using a pastel color palette.
*   **Intelligence Agent:** Uses Gemini 2.5 Flash to understand user intent and execute multi-tool reasoning.
*   **Decentralized Data:** 4 independent FastAPI microservices acting as data providers.
*   **Explainability Panel:** Real-time visibility into the AI's reasoning and tool execution steps.
*   **Graceful Fallbacks:** Handles Gemini API downtime or MCP service unavailability seamlessly.

## 🛠 Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| **Intelligence Agent** | FastAPI (Python), Gemini 2.5 Flash, SQLAlchemy, SQLite |
| **MCP Services** | FastAPI (Python) |
| **Deployment** | Vercel (Frontend), Railway (Backend Services) |

## 🚀 Local Setup Instructions

### Prerequisites
*   Node.js & npm
*   Python 3.9+
*   A Gemini API Key

### 1. Environment Variables
Create `.env` file in `apps/intelligence-agent`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=sqlite:///./chat_history.db
```

### 2. Running the MCP Services
Open 4 separate terminal tabs, and for each service (Library, Cafeteria, Events, Academics):
```bash
cd packages/library-mcp
pip install -r requirements.txt
python main.py
```

### 3. Running the Intelligence Agent
Open a new terminal tab:
```bash
cd apps/intelligence-agent
pip install -r requirements.txt
python main.py
```
*Runs on `http://localhost:8000`*

### 4. Running the Frontend
Open a new terminal tab:
```bash
cd apps/frontend
npm install
npm run dev
```
*Runs on `http://localhost:3000`*

## 📸 Screenshots Placeholder
*(Add screenshots of the Dashboard and AI Drawer here)*

## 🎥 Demo Video Placeholder
*(Add a link to the demo video here)*
