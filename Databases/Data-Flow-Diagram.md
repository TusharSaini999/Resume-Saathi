# ResumeSaathi Data Flow Diagram

## Level 0 Overview

```mermaid
flowchart LR
  classDef client fill:#2563eb,stroke:#1d4ed8,stroke-width:2px,color:#ffffff,rx:12,ry:12
  classDef fe fill:#0284c7,stroke:#0369a1,stroke-width:2px,color:#ffffff,rx:10,ry:10
  classDef be fill:#4f46e5,stroke:#4338ca,stroke-width:2px,color:#ffffff,rx:10,ry:10
  classDef db fill:#059669,stroke:#047857,stroke-width:2px,color:#ffffff,rx:8,ry:8
  classDef ai fill:#9333ea,stroke:#7e22ce,stroke-width:2px,color:#ffffff,rx:10,ry:10
  classDef ext fill:#d97706,stroke:#b45309,stroke-width:2px,color:#ffffff,rx:8,ry:8

  subgraph UserTier["👤 Client Tier"]
    U(["Candidate / User"]):::client
  end

  subgraph Presentation["🎨 Presentation Layer"]
    FE[["React 19 / Vite SPA<br/>Tailwind CSS + Redux"]]:::fe
  end

  subgraph Application["⚙️ Application Tier"]
    API[["Express.js REST API<br/>JWT & Session Ingress"]]:::be
  end

  subgraph DataTier["💾 Persistence & Cloud Services"]
    DB[("🍃 MongoDB Atlas<br/>Multi-Tenant Clusters")]:::db
    AI[["🤖 Google Gemini 3.5<br/>Flash Lite Model"]]:::ai
    CL[["☁️ Cloudinary<br/>PDF Storage CDN"]]:::ext
    EM[["📧 SMTP Mailer<br/>Verification & Alerts"]]:::ext
    OAuth[["🔐 OAuth Providers<br/>Google & LinkedIn"]]:::ext
    GEO[["🌍 GeoIP Services<br/>ipify + ipapi"]]:::ext
  end

  U <-->|HTTPS / Interactive UI| FE
  FE <-->|JSON REST / Credentials / Cookies| API
  API <--> DB
  API <--> AI
  API <--> CL
  API --> EM
  API <--> OAuth
  API <--> GEO
```

## Level 1 Core Application Flows

```mermaid
flowchart TB
  classDef fe fill:#0284c7,stroke:#0369a1,stroke-width:2px,color:#ffffff,rx:8,ry:8
  classDef be fill:#4f46e5,stroke:#4338ca,stroke-width:2px,color:#ffffff,rx:8,ry:8
  classDef proc fill:#be185d,stroke:#fe3e91,stroke-width:2px,color:#ffffff,rx:8,ry:8
  classDef store fill:#059669,stroke:#047857,stroke-width:2px,color:#ffffff,rx:8,ry:8
  classDef cloud fill:#d97706,stroke:#b45309,stroke-width:2px,color:#ffffff,rx:8,ry:8

  subgraph Frontend["🎨 Tier 1 · Frontend UI Layer"]
    L["🏠 Landing Page"]:::fe
    A["🔐 Auth Pages<br/>Login / Signup / Verify"]:::fe
    D["📊 Dashboard Pages<br/>Resume / Job / Chat / Settings"]:::fe
    S[["⚡ API Client<br/>Axios + JWT Credentials + IP"]]:::fe
  end

  subgraph Backend["⚙️ Tier 2 · Express API Router & Security Gateway"]
    R1["Auth Routes<br/>/api/v1/users + /auth"]:::be
    R2["Resume Routes<br/>/api/v1/resumes"]:::be
    R3["Job Routes<br/>/api/v1/jobs"]:::be
    R4["Chat Routes<br/>/api/v1/chating"]:::be
    R5["Session & Profile Routes<br/>/users/me, /sessions"]:::be
    M{{"🛡️ JWT Verification Middleware"}}:::be
    P{{"🔑 Passport OAuth Handler"}}:::be
  end

  subgraph Processing["🧠 Tier 3 · Deep Business Intelligence Engine"]
    U1[["📄 PDF Text Parser<br/>Structure & Skill Extraction"]]:::proc
    U2[["🎯 Job Matcher<br/>Resume vs JD Analysis"]]:::proc
    U3[["🤖 Resume-Aware AI Assistant<br/>Gemini 3.5 Context Engine"]]:::proc
    U4[["📍 Session & Device Generator<br/>IP, Browser, OS & Geolocation"]]:::proc
  end

  subgraph Storage["💾 Tier 4 · Database Document Store"]
    M1[("👤 Users Collection")]:::store
    M2[("📱 Sessions Collection")]:::store
    M3[("📈 ResumeAnalysis")]:::store
    M4[("📁 ResumesCollection")]:::store
    M5[("💼 JobDescription")]:::store
    M6[("💬 ChatSession")]:::store
    M7[("✉️ ChatMessage")]:::store
    M8[("🔑 Verification Tokens")]:::store
  end

  subgraph External["☁️ Tier 5 · External Cloud Infrastructure"]
    G1[["🤖 Google Gemini 3.5 Flash Lite"]]:::cloud
    C1[["☁️ Cloudinary Storage CDN"]]:::cloud
    E1[["📧 SMTP Email Dispatcher"]]:::cloud
    O1[["🔐 Google OAuth 2.0"]]:::cloud
    O2[["💼 LinkedIn OAuth 2.0"]]:::cloud
    I1[["🌐 ipify Public IP Resolver"]]:::cloud
    I2[["📍 ipapi Location Service"]]:::cloud
  end

  L --> S
  A --> S
  D --> S

  S --> R1
  S --> R2
  S --> R3
  S --> R4
  S --> R5

  R1 --> M
  R2 --> M
  R3 --> M
  R4 --> M
  R5 --> M

  R1 --> P
  P --> O1
  P --> O2

  R1 --> U4
  U4 --> M1
  U4 --> M2
  U4 --> M8
  U4 --> I1
  U4 --> I2

  R2 --> U1
  U1 --> C1
  U1 --> G1
  U1 --> M4
  U1 --> M3
  U1 --> M1

  R3 --> U2
  U2 --> G1
  U2 --> M5

  R4 --> U3
  U3 --> G1
  U3 --> M6
  U3 --> M7
  U3 --> M4

  R1 --> E1
  R5 --> M1
  R5 --> M2
  R5 --> M5
  R5 --> M3
  R5 --> M6
  R5 --> M7

  M --> FE2[("📦 Response JSON / Secure Cookies")]:::store
  FE2 --> D
  FE2 --> A
```

## Main User Journeys

1. Landing and auth: the user opens the React frontend, signs up or logs in, and the backend creates a session cookie plus profile data.
2. Resume upload: the dashboard uploads a PDF resume, the backend parses it, stores the file and extracted data, sends it to Gemini for analysis, then saves the analysis in MongoDB.
3. Job description analysis: the user submits a JD, the backend compares it with the stored resume and saves the match results for later viewing.
4. Chat assistant: the user chats from the dashboard, and the backend combines the current message, prior chat history, and resume text to generate a resume-aware AI response.
5. Sessions and settings: the user can list or revoke sessions, change passwords, and manage account state through authenticated user routes.