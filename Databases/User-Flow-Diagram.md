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
  Landing_Page --> Authentication: Select Password or OAuth (Google/LinkedIn)
  Authentication --> Verify_Account: Unverified Email
  Verify_Account --> Dashboard: Email Verified
  Authentication --> Dashboard: OAuth / Login Verified
  
  Dashboard --> Resume_Intelligence: Upload & Score Resume
  Dashboard --> Job_Matching: Compare Against Job Description
  Dashboard --> Career_Explorer: Live ATS Discovery
  Dashboard --> AI_Assistant: Resume-Aware Chat
  Dashboard --> Account_Settings: Security & Active Sessions
  
  Resume_Intelligence --> Dashboard: Analysis Saved
  Job_Matching --> Dashboard: Match Report Saved
  Career_Explorer --> Dashboard: Jobs Tracked
  AI_Assistant --> Dashboard: Chat History Persisted
  Account_Settings --> Dashboard: Preferences Updated
  
  Dashboard --> Logout: Revoke Session
  Logout --> Landing_Page
```

---

## Summary

This diagram shows the main user journey from landing on the site to authentication, resume analysis, job matching, chat, settings, and logout.