# Resume Saathi 🚀

Resume Saathi is an AI-powered ATS resume analysis platform. It helps users upload resumes, receive structured feedback, compare resumes against job descriptions, and improve quality with AI-driven suggestions.

## Technology Stack ⚙️

- Frontend: React, Vite, Redux Toolkit, Tailwind CSS
- Backend: Node.js, Express, MongoDB (Mongoose)
- AI integration: Groq SDK
- Authentication: JWT, Google OAuth, LinkedIn OAuth
- File services: Multer, Cloudinary

## Repository Structure 🗂️

```
Resume-Saathi/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
├── Backend/
│   └── README.md
├── Frontend/
│   └── README.md
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

- Backend guide: Backend/README.md
- Frontend guide: Frontend/README.md
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
