# Resume Saathi 🚀

Resume Saathi is an AI-powered ATS resume analysis and live job discovery platform. It helps users upload resumes, receive structured feedback, discover live verified requisitions from official ATS portals (Greenhouse, Lever, SmartRecruiters, LinkedIn), infer genuine industry roles and tech stacks, and match against job descriptions using Google Gemini 3.5 Flash Lite.

## Technology Stack ⚙️

- Frontend: React, Vite, Redux Toolkit, Tailwind CSS
- Backend: Node.js, Express, MongoDB (Mongoose)
- AI integration: Google GenAI SDK (Gemini 3.5 Flash Lite)
- Authentication: JWT, Google OAuth, LinkedIn OAuth
- File services: Multer, Cloudinary
- Cloud & DevOps: AWS (CloudFront CDN, EC2,  ACM), Docker, Nginx

## Architecture Flow 📐

```mermaid
flowchart TD
  classDef client fill:#1e3a8a,stroke:#3b82f6,stroke-width:3px,color:#ffffff
  classDef cdn fill:#0369a1,stroke:#38bdf8,stroke-width:3px,color:#ffffff
  classDef shield fill:#78350f,stroke:#f59e0b,stroke-width:3px,color:#ffffff
  classDef origin fill:#312e81,stroke:#818cf8,stroke-width:3px,color:#ffffff
  classDef frontend fill:#831843,stroke:#fe3e91,stroke-width:3px,color:#ffffff
  classDef backend fill:#581c87,stroke:#c084fc,stroke-width:3px,color:#ffffff
  classDef ai fill:#701a75,stroke:#f472b6,stroke-width:3px,color:#ffffff
  classDef db fill:#064e3b,stroke:#34d399,stroke-width:3px,color:#ffffff
  classDef slab fill:#0f172a,stroke:#64748b,stroke-width:2px,color:#94a3b8

  subgraph Tier1[" "]
    Slab1[/ "🌐 3D TIER 1 · CLIENT & EDGE ACCELERATION LAYER" \]:::slab
    Users([ "👥 Global Visitors & Candidate Web App<br/>HTTPS Port 443" ]):::client
    CDN[[ "⚡ AWS CloudFront CDN Edge POPs<br/>DEL51 Edge Cache HIT" ]]:::cdn
    WAF{{ "🛡️ AWS WAF & ACM SSL Certificate<br/>Rate Limiting & Anti-DDoS" }}:::shield
  end

  subgraph Tier2[" "]
    Slab2[/ "🏰 3D TIER 2 · CLOAKED EC2 ORIGIN GATEWAY" \]:::slab
    Nginx[[ "🔀 Host Nginx Reverse Proxy<br/>Let's Encrypt TLSv1.3 & X-Origin-Verify" ]]:::origin
  end

  subgraph Tier3[" "]
    Slab3[/ "⚡ 3D TIER 3 · CONTAINERIZED DOCKER MICROSERVICES" \]:::slab
    FE[[ "🎨 resume-frontend Container<br/>React 19 Vite SPA · Port 3000" ]]:::frontend
    BE[[ "⚙️ resume-backend Container<br/>Node.js 20 Express REST API · Port 5000" ]]:::backend
  end

  subgraph Tier4[" "]
    Slab4[\ "💾 3D TIER 4 · INTELLIGENCE & PERSISTENCE STACK" /]:::slab
    Gemini[[ "🤖 Google Gemini 3.5 Flash Lite<br/>ATS Resume Scoring Engine" ]]:::ai
    ATS[[ "🏢 Live ATS Discovery Crawler<br/>Greenhouse · Lever · Ashby · LinkedIn" ]]:::ai
    DB[( "🍃 MongoDB Atlas Cloud Cluster<br/>Multi-Tenant Document Store" )]::db
    Cloudinary[( "☁️ Cloudinary Storage CDN<br/>Encrypted PDF File Vault" )]::db
  end

  Users ==>|DNS & HTTPS: 443| WAF
  WAF ==>|Filtered Ingress| CDN
  CDN ==>|Port 443 + X-Origin-Verify Secret| Nginx

  Nginx ==>|proxy_pass: 127.0.0.1:3000| FE
  Nginx ==>|proxy_pass: /api/ -> :5000| BE

  BE <==>|Gemini GenAI SDK| Gemini
  BE <==>|Real ATS Requisitions| ATS
  BE <==>|Mongoose TLS Driver| DB
  BE <==>|Signed Uploads| Cloudinary

  style Tier1 fill:#0b132b,stroke:#1e40af,stroke-width:3px,color:#fff
  style Tier2 fill:#160f29,stroke:#4338ca,stroke-width:3px,color:#fff
  style Tier3 fill:#22051e,stroke:#fe3e91,stroke-width:3px,color:#fff
  style Tier4 fill:#051b14,stroke:#059669,stroke-width:3px,color:#fff
```

## Repository Structure 🗂️

```
Resume-Saathi/
├── .github/
├── Backend/
├── Frontend/
├── Databases/
├── Testing/
├── README.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── SUPPORT.md
└── CHANGELOG.md
```

## Prerequisites ✅

- Node.js 20 or later
- npm 10 or later
- MongoDB (local or cloud)

## Quick Start 🚀

### 1. Start the backend

```bash
cd Backend
npm install
copy .env.sample .env
npm start
```

Backend default URL: http://localhost:5000 🌐

### 2. Start the frontend

Create Frontend/.env with:

```env
VITE_SERVER_URL=http://localhost:5000/api/v1
```

Then run:

```bash
cd Frontend
npm install
npm run dev
```

Frontend default URL: http://localhost:5173 🌐

## Project Documentation 📚

- Career Openings & ATS Discovery: [Docs/CAREER_OPENINGS_AND_ATS_FEATURE_GUIDE.md](file:///c:/Project/Resume-Saathi/Docs/CAREER_OPENINGS_AND_ATS_FEATURE_GUIDE.md)
- Career Openings Guide (DOCX): [Docs/Resume-Saathi_Career_Openings_and_ATS_Discovery_Guide.docx](file:///c:/Project/Resume-Saathi/Docs/Resume-Saathi_Career_Openings_and_ATS_Discovery_Guide.docx)
- Backend guide: Backend/README.md
- Frontend guide: Frontend/README.md
- Deployment guide: Docs/DEPLOYMENT_GUIDE.md
- AWS CloudFront & ACM guide: Docs/AWS_CLOUDFRONT_ACM_SETUP_GUIDE.md
- Contributing: CONTRIBUTING.md
- Code of Conduct: CODE_OF_CONDUCT.md
- Security policy: SECURITY.md
- Support: SUPPORT.md
- Changelog: CHANGELOG.md

## GitHub Templates 🧩

- Bug report: .github/ISSUE_TEMPLATE/bug_report.md
- Feature request: .github/ISSUE_TEMPLATE/feature_request.md
- Pull request: .github/pull_request_template.md

## License 📄

This project is licensed under the MIT License. See LICENSE for details.
