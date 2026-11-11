# ResumeSaathi User Flow Diagram

```mermaid
flowchart TD
  classDef start fill:#1e3a8a,stroke:#3b82f6,stroke-width:2px,color:#ffffff,rx:20,ry:20
  classDef view fill:#0369a1,stroke:#0284c7,stroke-width:2px,color:#ffffff,rx:8,ry:8
  classDef decision fill:#78350f,stroke:#f59e0b,stroke-width:2px,color:#ffffff,rx:8,ry:8
  classDef action fill:#4f46e5,stroke:#6366f1,stroke-width:2px,color:#ffffff,rx:8,ry:8
  classDef ai fill:#be185d,stroke:#fe3e91,stroke-width:2px,color:#ffffff,rx:10,ry:10
  classDef endnode fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#ffffff,rx:20,ry:20

  Start(["🚀 Start Session"]):::start
  Landing["🏠 Landing Page<br/>Features & Portal Overview"]:::view
  AuthCheck{"🔐 Logged In?"}:::decision
  
  subgraph AuthPhase["🔑 Authentication Journey"]
    AuthPages["📄 Auth Portal<br/>Login / Signup / Reset"]:::view
    VerifyAuth["✅ Verify Email or Complete OAuth<br/>Google / LinkedIn"]:::action
  end

  Dashboard[["📊 Unified Dashboard<br/>Core Copilot Workspace"]]:::action

  subgraph ResumePhase["📄 Resume Intelligence Workflow"]
    R1["Upload PDF Resume"]:::action
    R2[["⚡ PDF Text Extraction & Parsing"]]:::action
    R3[["🤖 Gemini AI ATS Analysis<br/>Score & Bullet Feedback"]]:::ai
    R4["📈 Review ATS Score & Recommendations"]:::view
  end

  subgraph JobPhase["💼 Job Description Matcher"]
    J1["Submit Target Job Description"]:::action
    J2[["🤖 AI Resume vs JD Comparison"]]:::ai
    J3["🎯 Match Score & Missing Keywords"]:::view
  end

  subgraph CareerPhase["🌐 Career Openings & Live ATS Explorer"]
    C0["Explore Verified Openings"]:::action
    C1[["🏢 Direct ATS Connectors<br/>Greenhouse, Lever, Ashby, LinkedIn"]]:::action
    C2[["🛡️ Live Requisition Verification Probe"]]:::ai
    C3["📋 Track Application Status"]:::view
  end

  subgraph ChatPhase["💬 Resume-Aware AI Assistant"]
    CH1["Ask Career & Resume Questions"]:::action
    CH2[["🤖 Gemini Context-Aware Assistant"]]:::ai
    CH3["💡 Actionable Career Coaching Answers"]:::view
  end

  subgraph AccountPhase["⚙️ Security & Session Controls"]
    S1["Manage Active Sessions & Devices"]:::action
    Logout(["🚪 Logout Session"]):::endnode
  end

  Start --> Landing
  Landing --> AuthCheck
  AuthCheck -->|No| AuthPages
  AuthPages --> VerifyAuth
  VerifyAuth --> Dashboard
  AuthCheck -->|Yes| Dashboard

  Dashboard --> R1
  R1 --> R2 --> R3 --> R4

  Dashboard --> J1
  J1 --> J2 --> J3

  Dashboard --> C0
  C0 --> C1 --> C2 --> C3

  Dashboard --> CH1
  CH1 --> CH2 --> CH3

  Dashboard --> S1
  S1 --> Logout
  Logout --> Landing
```

## Summary

This diagram shows the main user journey from landing on the site to authentication, resume analysis, job matching, chat, settings, and logout.