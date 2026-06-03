# MediGenius

MediGenius is an advanced, AI-powered medical consultation assistant. It combines a modular, agentic LangGraph workflow on the backend with a sleek, responsive dark-themed React SPA on the frontend. The system processes medical documents (RAG) and uses search tools (like Tavily and Wikipedia) to generate precise, database-backed medical consultation advice.

---

## Folder Structure

The project is structured into two main components: `backend` and `frontend`.

```
MYMediGenius/
├── backend/                  # Python FastAPI Backend
│   ├── app/
│   │   ├── agents/          # LangGraph agentic workflow nodes
│   │   ├── api/             # API routing (health, chat, sessions)
│   │   ├── core/            # Logging and configuration
│   │   ├── db/              # SQLAlchemy session setup
│   │   ├── models/          # SQLAlchemy Database ORM models
│   │   ├── schemas/         # Pydantic request/response validation schemas
│   │   ├── services/        # Database and Chat logic services
│   │   ├── tools/           # PDF parsers, vector store interfaces, LLM clients
│   │   └── main.py          # Backend application entrypoint
│   ├── data/                # Reference PDF documents (e.g. medical_book.pdf)
│   ├── storage/             # Persistent SQLite and Vector Store files
│   └── requirements.txt     # Python backend dependencies
│
├── frontend/                 # Vite + React + TypeScript Frontend
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── assets/          # Images/Icons
│   │   ├── App.tsx          # Main layout and Sidebar navigation
│   │   ├── ChatContext.tsx  # Global state provider for session management
│   │   ├── ChatWindow.tsx   # Message logs and message components
│   │   ├── Footer.tsx       # Bottom footer layout
│   │   ├── Header.tsx       # App header
│   │   ├── MessageInput.tsx # User input area, actions, and prompt chips
│   │   ├── ThemeProvider.tsx# Dark/Light theme toggle
│   │   ├── index.css        # Tailwind/CSS custom stylesheet
│   │   └── main.tsx         # Frontend React entry point
│   ├── package.json         # Frontend package config and scripts
│   └── vite.config.js       # Vite bundler configuration
│
├── .env.example              # Sample environment configuration
├── run.py                    # Unified one-click setup and start script
└── README.md                 # Project documentation (this file)
```

---

## Local Setup & Quick Start

Follow these steps to configure and run MediGenius on your local system.

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

### Step 1: Environment Variables
Create a `.env` file in the root directory and add your API keys:
```bash
cp .env.example .env
```
Open the `.env` file and set the required variables:
- `GROQ_API_KEY`: Your Groq API key for LLM execution.
- `TAVILY_API_KEY`: Your Tavily search engine API key.

---

### Step 2: Running the Application

You can start both the backend and frontend using the unified runner script or launch them manually.

#### Option A: Unified One-Click Launch (Recommended)
From the project root directory, execute:
```bash
python run.py
```
This script will automatically:
1. Initialize a Python virtual environment (`.venv`) if one doesn't exist.
2. Install backend Python dependencies listed in `backend/requirements.txt`.
3. Install frontend Node modules if they are not already installed.
4. Process and index the reference PDF (`backend/data/medical_book.pdf`) into the vector store.
5. Spin up the backend API server on `http://localhost:8000`.
6. Once the backend is verified healthy, boot up the React frontend on **`http://localhost:5173`**.

---

#### Option B: Manual Setup and Run

##### 1. Start the Backend
Navigate to the `backend` directory:
```bash
cd backend
```
Create and activate your Python virtual environment:
```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# Mac/Linux
python3 -m venv .venv
source .venv/bin/activate
```
Install the required dependencies:
```bash
pip install -r requirements.txt
```
Run the FastAPI development server:
```bash
# Return to the root folder or set PYTHONPATH
cd ..
python -m uvicorn backend.app.main:app --port 8000
```

##### 2. Start the Frontend
In a new terminal window, navigate to the `frontend` directory:
```bash
cd frontend
```
Install the Node.js packages:
```bash
npm install
```
Start the Vite development server:
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser to interact with MediGenius.
