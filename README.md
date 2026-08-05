# 🚀 DevLens AI – Intelligent Codebase Analysis & Architecture Platform

[![Live Application](https://img.shields.io/badge/🌐_Live_Demo-Vercel_Deployment-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://devlens-ai-pied.vercel.app)
[![API Server](https://img.shields.io/badge/⚙️_API_Backend-Render_Live-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://devlens-ai-85mz.onrender.com/api/health)

> **DevLens AI** is an end-to-end repository intelligence platform designed to eliminate codebase onboarding friction, automate software auditing, and provide deep architectural insights into complex software projects.

---

## 🎯 Main Motive & Vision

Navigating large, unfamiliar, or legacy codebases is one of the most time-consuming challenges software engineers and engineering managers face. 

**DevLens AI** was created to solve this problem by transforming any repository archive (`.zip`) or public GitHub repository into:
- 💡 **Instant Domain Clarity**: Understand what a project actually does, what problem it solves, and its core capabilities in seconds.
- 📂 **VS Code-Style Inspection**: Browse directory structures with expandable file trees, live syntax previews, and line-by-line file summaries.
- 🤖 **Deep AI Code Intelligence**: Chat with your codebase using multi-provider LLMs that read actual source code snippets, package manifests, and route definitions.
- 📄 **Executive Health & PDF Export**: Generate printable PDF reports covering project purpose, technical capabilities, quality scores (e.g. 92/100), codebase strengths, and actionable recommendations.

---

## ⚡ How DevLens AI Works (Step-by-Step Architecture)

```
                       +-------------------------------+
                       |  ZIP Upload / GitHub Import   |
                       +---------------+---------------+
                                       |
                                       v
                       +---------------+---------------+
                       |   FileScanner & Extractor     |
                       |  (adm-zip / simple-git)       |
                       +---------------+---------------+
                                       |
                                       v
                       +---------------+---------------+
                       |  PostgreSQL Database Storage  |
                       |  (Repositories & File Index)  |
                       +---------------+---------------+
                                       |
                                       v
                       +---------------+---------------+
                       |    Metrics & AST Analyzer     |
                       | (Languages, Scale, Framework) |
                       +---------------+---------------+
                                       |
                                       v
                       +---------------+---------------+
                       | Multi-Provider AI LLM Engine  |
                       | (Gemini / OpenRouter / OpenAI)|
                       +---------------+---------------+
                                       |
        +------------------------------+------------------------------+
        |                              |                              |
        v                              v                              v
+-------+-------+              +-------+-------+              +-------+-------+
|  VS Code Tree |              | Unified AI    |              | Printable PDF |
|  & Inspector  |              | Chat Engine   |              | Report Center |
+---------------+              +---------------+              +---------------+
```

### 1. Ingestion & Extraction
Users upload `.zip` project archives or input public GitHub repository URLs. 
- ZIP files are uncompressed securely into structured directories using `ZipService` (`adm-zip`).
- GitHub repositories are cloned via `GithubService` (`simple-git`).

### 2. Directory Indexing & Metrics Calculation
`FileScanner` recursively traverses the repository directory tree, automatically filtering noise directories (`node_modules`, `.git`, `dist`, `build`, `.next`).
- Maps file extensions to programming languages (`JavaScript`, `TypeScript`, `Python`, `Java`, `C++`, etc.).
- Computes health metrics, total file/folder counts, and language distribution via `MetricsService` and `ProjectAnalyzer`.
- Indexes file metadata into PostgreSQL relational tables (`repositories` & `repository_files`).

### 3. Codebase-Aware AI Context Builder
When generating reports or answering user queries in AI Chat, `AIService` reads:
- `fileTreeList`: Full directory tree representation of the uploaded codebase.
- `keyCodeSnippets`: Real source code content from package manifests (`package.json`), documentation (`README.md`), entry points (`app.js`, `index.js`, `server.js`, `main.py`, etc.), and files matching user query keywords.

### 4. Universal Multi-Provider LLM Integration
The AI engine supports multiple AI providers with automatic fallback:
- **Google Gemini**: `gemini-2.0-flash`, `gemini-1.5-flash`, `gemini-1.5-pro`
- **OpenRouter**: Auto-routing model selection (`openrouter/auto`) for `sk-or-v1-` keys
- **OpenAI**: `gpt-4o-mini`
- **Groq**: `llama-3.3-70b-versatile`

---

## 🛠️ Languages & Technologies Used

### 🌐 Frontend (Client)
- **Primary Language**: JavaScript (ES6+), React JSX, Vanilla CSS3
- **Framework**: React.js Single Page Application (SPA)
- **Routing**: React Router v6
- **Icons & Styling**: `react-icons` (Feather Icons), CSS Modules (Glassmorphism design system)
- **HTTP Client**: `axios`

### ⚙️ Backend (Server)
- **Primary Language**: JavaScript (Node.js runtime environment)
- **Framework**: Express.js REST API
- **Database**: PostgreSQL (`pg` pool client)
- **File Management & Extraction**: `adm-zip`, `multer`, `simple-git`
- **Authentication & Security**: JSON Web Tokens (`jsonwebtoken`), Password Hashing (`bcryptjs`), `cors`, `dotenv`
- **AI Integrations**: `@google/generative-ai`, `axios` (OpenRouter / OpenAI REST endpoints)

---

## 🌟 Key Features

| Feature | Description |
| :--- | :--- |
| **🔐 Auth & Security** | Secure user registration, password encryption with `bcryptjs`, and JWT token authentication. |
| **📂 ZIP Archive Scanner** | Upload project ZIPs with instant file tree scanning and database indexing. |
| **📥 GitHub One-Click Import** | Clone public GitHub repos directly into the system for inspection. |
| **💻 VS Code-Style Explorer** | Interactive file tree with language badges, live source code previews, and copy actions. |
| **🤖 Unified AI Chat** | Ask questions about architecture, entry points, or specific functions with code context. |
| **📊 Purpose & Capability Reports** | AI reports highlighting **What the Project Does**, **Core Capabilities**, Quality Ratings, and Recommendations. |
| **📄 Exportable PDF Reports** | Printable PDF executive summary reports formatted for A4 page dimensions. |

---

## 📁 Repository Directory Structure

```text
devlens-ai/
├── client/                     # React Frontend SPA
│   ├── src/
│   │   ├── api/                # Axios API Instance Configuration
│   │   ├── components/         # Reusable Components
│   │   │   ├── Repository/     # EmbeddedAIChat, FileTree, FileDetails
│   │   │   ├── Navbar/         # Main Navigation Header
│   │   │   ├── Sidebar/        # Workspace Navigation Sidebar
│   │   │   └── Background/     # Animated Background Accents
│   │   ├── layouts/            # MainLayout Container
│   │   ├── pages/              # Application Views
│   │   │   ├── Dashboard/      # Main Dashboard Overview
│   │   │   ├── Repository/     # Repository Code Explorer & Inspector
│   │   │   ├── RepositoryList/ # Repositories Grid
│   │   │   ├── AIAnalysis/     # Detailed AI Report & Capabilities Page
│   │   │   ├── AIChat/         # Standalone AI Chat View
│   │   │   ├── Reports/        # Export Center & PDF Modal
│   │   │   ├── Upload/         # ZIP Upload Zone
│   │   │   └── GithubImport/   # GitHub Clone Importer
│   │   ├── routes/             # AppRoutes Router Configuration
│   │   └── services/           # Repository & Auth API Connectors
│   └── package.json
│
└── server/                     # Express REST API Backend
    ├── src/
    │   ├── config/             # Database Connection (db.js)
    │   ├── controllers/        # Route Handlers (repository.controller.js, auth.controller.js)
    │   ├── database/           # PostgreSQL Schema (schema.sql)
    │   ├── middleware/         # Auth & Multer Upload Middlewares
    │   ├── models/             # Relational Database Models (repository.model.js, etc.)
    │   ├── routes/             # API Route Definitions
    │   └── services/           # AIService, ZipService, FileScanner, MetricsService, ProjectAnalyzer
    └── package.json
```

---

## 🚦 Local Installation & Quickstart

### Prerequisites
- **Node.js**: `v16.x` or higher
- **npm**: `v8.x` or higher
- **PostgreSQL**: Running instance on port `5432`

---

### 1. Database Setup
Create a PostgreSQL database named `devlens_ai`:
```sql
CREATE DATABASE devlens_ai;
```
Import the schema table definitions from `server/src/database/schema.sql` into `devlens_ai`.

---

### 2. Backend Setup
```bash
cd server
cp .env.example .env
npm install
npm run dev
```
By default, the server will start on `http://localhost:5000`.

#### Server Environment Variables (`server/.env`)
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=devlens_ai
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_jwt_secret_key
OPENROUTER_API_KEY=sk-or-v1-your_openrouter_key
GEMINI_API_KEY=your_gemini_key
```

---

### 3. Frontend Setup
In a new terminal window:
```bash
cd client
cp .env.example .env
npm install
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License
Distributed under the **MIT License**. See `LICENSE` for more information.
