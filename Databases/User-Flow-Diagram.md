# ResumeSaathi User Flow Diagram

```mermaid
flowchart TD
  Start(["Start"]) --> Landing["Landing Page"]
  Landing --> AuthCheck{"Logged In?"}
  
  AuthCheck -->|No| AuthPages["Auth Pages (Login / Signup)"]
  AuthPages --> Verify["Verify Email / Complete OAuth"]
  Verify --> Dashboard["Dashboard"]
  AuthCheck -->|Yes| Dashboard

  Dashboard --> Resume["📄 Resume Upload & ATS Feedback"]
  Dashboard --> Jobs["💼 Job Matcher (Compare JD)"]
  Dashboard --> Career["🌐 Career Openings & Live ATS"]
  Dashboard --> Chat["💬 Resume-Aware AI Chat"]
  Dashboard --> Settings["⚙️ Session & Account Settings"]
  
  Settings --> Logout(["Logout"])
  Logout --> Landing
```

## Application State Machine & User Progression

```mermaid
stateDiagram-v2
  [*] --> Landing_Page: Open Application
  
  state Authentication_Flow {
    [*] --> Auth_Gateway
    Auth_Gateway --> Local_Login: Password Auth
    Auth_Gateway --> OAuth_Provider: Google / LinkedIn
    Local_Login --> Email_Verification: Unverified Token
    Email_Verification --> Authenticated_Session: Verified OK
    OAuth_Provider --> Authenticated_Session: Token Verified
  }

  Landing_Page --> Authentication_Flow: Click Sign In / Join
  Authentication_Flow --> Dashboard: Session Cookie Established

  state Dashboard_Hub {
    [*] --> Overview
    Overview --> Resume_Intelligence: Upload & Score
    Overview --> Job_Matching: Compare JD
    Overview --> Career_Explorer: Live ATS Discovery
    Overview --> AI_Assistant: Resume-Aware Chat
    Overview --> Account_Settings: Security & Devices
    
    Resume_Intelligence --> Parse_PDF_Text
    Parse_PDF_Text --> Gemini_Analysis
    Gemini_Analysis --> ATS_Scorecard_View
    
    Job_Matching --> Extract_JD_Skills
    Extract_JD_Skills --> Gemini_Fit_Score
    
    Career_Explorer --> Query_Greenhouse_Lever
    Query_Greenhouse_Lever --> Probe_Live_Status
    Probe_Live_Status --> Pipeline_Tracker
    
    AI_Assistant --> Contextual_Prompting
    Contextual_Prompting --> AI_Coaching_Response
    
    Account_Settings --> Inspect_Sessions
    Inspect_Sessions --> Revoke_Session
  }

  Dashboard_Hub --> Landing_Page: Logout / Revoke Active Session
```

---

## Summary

This diagram shows the main user journey from landing on the site to authentication, resume analysis, job matching, chat, settings, and logout.