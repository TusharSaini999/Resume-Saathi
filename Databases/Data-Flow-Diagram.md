# ResumeSaathi Data Flow Diagram

## Level 0 Overview

```mermaid
flowchart LR
  U["👤 User / Candidate"]
  FE["🎨 Frontend (React / Vite)"]
  API["⚙️ Backend API (Express)"]
  DB[("🍃 MongoDB Atlas")]
  AI["🤖 Gemini 3.5 AI"]
  CL["☁️ Cloudinary Storage"]
  EM["📧 SMTP Email"]
  OAuth["🔐 Google & LinkedIn OAuth"]

  U <-->|HTTP / HTTPS| FE
  FE <-->|REST API / JWT| API
  API <--> DB
  API <--> AI
  API <--> CL
  API --> EM
  API <--> OAuth
```

## Database Schema & Entity Relationship Diagram (ERD)

```mermaid
erDiagram
  USER ||--o{ SESSION : "owns"
  USER ||--o{ RESUME : "uploads"
  USER ||--o{ JOB_DESCRIPTION : "analyzes"
  USER ||--o{ CHAT_SESSION : "initiates"
  USER ||--o{ TOKEN : "has"
  RESUME ||--|| RESUME_ANALYSIS : "yields"
  CHAT_SESSION ||--o{ CHAT_MESSAGE : "contains"

  USER {
    ObjectId _id PK
    string name
    string email UK
    string password
    string role
    boolean isVerified
    date createdAt
  }
  SESSION {
    ObjectId _id PK
    ObjectId userId FK
    string token
    string ipAddress
    string userAgent
    string location
    date expiresAt
  }
  RESUME {
    ObjectId _id PK
    ObjectId userId FK
    string fileName
    string fileUrl
    string rawText
    date uploadedAt
  }
  RESUME_ANALYSIS {
    ObjectId _id PK
    ObjectId resumeId FK
    int atsScore
    json strengths
    json weaknesses
    json recommendations
  }
  JOB_DESCRIPTION {
    ObjectId _id PK
    ObjectId userId FK
    string title
    string company
    string jdText
    int matchScore
  }
  CHAT_SESSION {
    ObjectId _id PK
    ObjectId userId FK
    string title
    date createdAt
  }
  CHAT_MESSAGE {
    ObjectId _id PK
    ObjectId sessionId FK
    string sender
    string message
    date timestamp
  }
  TOKEN {
    ObjectId _id PK
    ObjectId userId FK
    string token
    string type
    date expiresAt
  }
```

---

## Main User Journeys

1. Landing and auth: the user opens the React frontend, signs up or logs in, and the backend creates a session cookie plus profile data.
2. Resume upload: the dashboard uploads a PDF resume, the backend parses it, stores the file and extracted data, sends it to Gemini for analysis, then saves the analysis in MongoDB.
3. Job description analysis: the user submits a JD, the backend compares it with the stored resume and saves the match results for later viewing.
4. Chat assistant: the user chats from the dashboard, and the backend combines the current message, prior chat history, and resume text to generate a resume-aware AI response.
5. Sessions and settings: the user can list or revoke sessions, change passwords, and manage account state through authenticated user routes.