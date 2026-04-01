# Frontend README 🎨

This application is the user interface for Resume Saathi. It includes authentication flows, resume upload and analysis views, job matching pages, chat features, and user settings.

## Technology ⚙️

- React
- Vite
- Redux Toolkit
- Tailwind CSS
- Axios

## Prerequisites ✅

- Node.js 20 or later
- npm 10 or later
- Running backend service

## Installation 📦

```bash
npm install
```

## Environment Configuration 🔧

Create a local environment file from the sample:

```bash
copy .env.example .env
```

Set the backend API base URL:

```env
VITE_SERVER_URL=http://localhost:5000/api/v1
```

## Run the App 🚀

```bash
npm run dev
```

Default local URL: http://localhost:5173 🌐

## Build for Production 🏗️

```bash
npm run build
```

Build output directory: dist

## Available Scripts 📜

- npm run dev
- npm run build
- npm run preview
- npm run lint

## Troubleshooting 🛠️

- Ensure VITE_SERVER_URL points to the backend API base path.
- If API requests fail, verify that backend CORS includes the frontend origin.
