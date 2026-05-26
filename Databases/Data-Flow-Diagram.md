# ResumeSaathi Data Flow Diagram

## Level 0 Overview

```mermaid
flowchart LR
  U[User] --> FE[Frontend - React/Vite]
  FE --> API[Backend API - Express]
  API --> DB[(MongoDB)]
  API --> AI[Groq AI]
  API --> CL[Cloudinary]
  API --> EM[Email SMTP]
  API --> GX[Google OAuth]
  API --> LX[LinkedIn OAuth]
  API --> IP[IP/Location Services]

  FE <-->|JSON / Cookies / Redirects| API
```

## Level 1 Core Application Flows

```mermaid
flowchart TB
  subgraph Frontend
    L[Landing Page]
    A[Auth Pages\nLogin / Signup / Verify / Forgot Password]
    D[Dashboard Pages\nResume / Job Description / Chat / Settings]
    S[API Client\naxios + credentials + X-Client-Public-IP]
  end

  subgraph Backend[Backend - Express API]
    R1[Auth Routes\n/api/v1/users + /api/v1/auth]
    R2[Resume Routes\n/api/v1/resumes]
    R3[Job Routes\n/api/v1/jobs]
    R4[Chat Routes\n/api/v1/chating]
    R5[Session + Profile Routes\n/api/v1/users/me, /sessions]
    M[JWT Middleware]
    P[Passport OAuth]
  end

  subgraph Processing
    U1[Resume Parser\nPDF text extraction]
    U2[Job Matcher\nResume vs JD analysis]
    U3[Chat Engine\nResume-aware AI assistant]
    U4[Session Generator\nIP, browser, OS, location]
  end

  subgraph Storage[Data Stores]
    M1[(Users)]
    M2[(Sessions)]
    M3[(ResumeAnalysis)]
    M4[(ResumesCollection)]
    M5[(JobDescription)]
    M6[(ChatSession)]
    M7[(ChatMessage)]
    M8[(Token)]
  end

  subgraph External[External Services]
    G1[Groq AI]
    C1[Cloudinary]
    E1[SMTP Email]
    O1[Google OAuth]
    O2[LinkedIn OAuth]
    I1[ipify Public IP]
    I2[ipapi / ipwho Location Lookup]
  end

  L --> FE1[Browse content]
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

  M --> FE2[Response JSON / cookies / redirects]
  FE2 --> D
  FE2 --> A
```

## Main User Journeys

1. Landing and auth: the user opens the React frontend, signs up or logs in, and the backend creates a session cookie plus profile data.
2. Resume upload: the dashboard uploads a PDF resume, the backend parses it, stores the file and extracted data, sends it to Groq for analysis, then saves the analysis in MongoDB.
3. Job description analysis: the user submits a JD, the backend compares it with the stored resume and saves the match results for later viewing.
4. Chat assistant: the user chats from the dashboard, and the backend combines the current message, prior chat history, and resume text to generate a resume-aware AI response.
5. Sessions and settings: the user can list or revoke sessions, change passwords, and manage account state through authenticated user routes.