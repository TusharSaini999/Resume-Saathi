# Changelog

All notable changes to this project are documented in this file.

## [2.1.0] - 2026-10-18

### Added
- **Live Career Openings & ATS Discovery Engine**:
  - Direct ATS portal integration with Greenhouse, Lever, SmartRecruiters, and TCS iON.
  - Tokenless LinkedIn verified company requisitions engine.
  - Inferred Roles and Tech Stacks matcher (e.g. MERN, Python/Django, Java Spring) with unified "All Inferred" search.
  - Live portal prober verifying 200 OK status on job apply URLs.
  - Universal External Link Inspector and instant JD extractor.
  - Application Pipeline Tracker for managing job application stages.
  - Standardized AI scoring exclusively using Google Gemini 3.5 Flash Lite (`gemini-3.5-flash-lite`).
- **Welcome / Landing Page Updates**:
  - Live ATS discovery statistics and direct "Explore Live Openings" action in [Hero.jsx](file:///c:/Project/Resume-Saathi/Frontend/src/components/landing/Hero.jsx).
  - New "Live ATS Job Discovery & Verification" and "Inferred Roles & Tech Stacks Matching" feature cards in [Features.jsx](file:///c:/Project/Resume-Saathi/Frontend/src/components/landing/Features.jsx).
  - 4-step job pipeline workflow in [HowItWorks.jsx](file:///c:/Project/Resume-Saathi/Frontend/src/components/landing/HowItWorks.jsx).
  - Direct "Careers" navbar navigation in [Header.jsx](file:///c:/Project/Resume-Saathi/Frontend/src/components/layout/Header.jsx).
- **Documentation**:
  - Added comprehensive feature guide [Docs/CAREER_OPENINGS_AND_ATS_FEATURE_GUIDE.md](file:///c:/Project/Resume-Saathi/Docs/CAREER_OPENINGS_AND_ATS_FEATURE_GUIDE.md).
  - Generated [Docs/Resume-Saathi_Career_Openings_and_ATS_Discovery_Guide.docx](file:///c:/Project/Resume-Saathi/Docs/Resume-Saathi_Career_Openings_and_ATS_Discovery_Guide.docx).

## [1.0.0] - Initial Release

### Added
- Core ATS Resume Analysis & scoring.
- AI Chat assistant & JD comparison.
- CODE_OF_CONDUCT.md, CONTRIBUTING.md, SECURITY.md, SUPPORT.md.
