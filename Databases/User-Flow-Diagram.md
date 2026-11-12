# ResumeSaathi User Flow Diagram

```mermaid
flowchart TD
  Start(["Start Journey"]) --> Landing["Landing Page"]
  Landing --> AuthCheck{"Authenticated Session?"}
  
  AuthCheck -->|No| AuthPages["Authentication Pages<br/>Login and Signup"]
  AuthPages --> Verify["Email Verification<br/>or OAuth Callback"]
  Verify --> Dashboard["Candidate Dashboard"]
  AuthCheck -->|Yes| Dashboard

  Dashboard --> Resume["Resume Intelligence<br/>Upload PDF and ATS Analysis"]
  Dashboard --> Jobs["Job Matcher<br/>Compare Resume vs Job Description"]
  Dashboard --> Career["Career Openings<br/>Live ATS Discovery Engine"]
  Dashboard --> Chat["AI Assistant<br/>Resume-Aware Contextual Chat"]
  Dashboard --> Settings["User Settings<br/>Security and Session Management"]
  
  Settings --> Logout(["Terminate Session<br/>Logout"])
  Logout --> Landing
```

## Application State Machine & User Progression

```mermaid
stateDiagram-v2
  [*] --> Landing_Page: Open Application
  
  state Authentication_Flow {
    [*] --> Auth_Gateway
    Auth_Gateway --> Local_Login: Password Authentication
    Auth_Gateway --> OAuth_Provider: Google or LinkedIn OAuth
    Local_Login --> Email_Verification: Unverified Account
    Email_Verification --> Authenticated_Session: Token Verified
    OAuth_Provider --> Authenticated_Session: OAuth Token Verified
  }

  Landing_Page --> Authentication_Flow: Click Sign In or Join
  Authentication_Flow --> Dashboard: Session Cookie Established

  state Dashboard_Hub {
    [*] --> Overview
    Overview --> Resume_Intelligence: Upload and Score Resume
    Overview --> Job_Matching: Compare Against Job Description
    Overview --> Career_Explorer: Live ATS Discovery
    Overview --> AI_Assistant: Resume-Aware Chat
    Overview --> Account_Settings: Security and Active Sessions
    
    Resume_Intelligence --> Parse_PDF_Text
    Parse_PDF_Text --> Gemini_Analysis
    Gemini_Analysis --> ATS_Scorecard_View
    
    Job_Matching --> Extract_JD_Skills
    Extract_JD_Skills --> Gemini_Fit_Score
    
    Career_Explorer --> Query_Greenhouse_Lever
    Query_Greenhouse_Lever --> Probe_Live_Status
    Probe_Live_Status --> Pipeline_Tracker
    
    AI_Assistant --> Contextual_Prompting
    Contextual_Prompting --> Stream_AI_Response
  }

  Dashboard --> Logout: Revoke Session
  Logout --> Landing_Page
```

---

## Summary

This diagram shows the main user journey from landing on the site to authentication, resume analysis, job matching, chat, settings, and logout.