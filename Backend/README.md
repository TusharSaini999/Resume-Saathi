# Backend README

This service powers Resume Saathi APIs for authentication, resume analysis, job matching, and chat.

## Technology

- Node.js
- Express.js
- MongoDB with Mongoose
- Passport (Google and LinkedIn OAuth)
- Multer and Cloudinary

## Prerequisites

- Node.js 20 or later
- npm 10 or later
- MongoDB instance

## Installation

```bash
npm install
```

## Environment Configuration

Create a local environment file from the sample:

```bash
copy .env.sample .env
```

Important variables:

- NODE_ENV
- HOST
- PORT
- HOST_SERVER
- FRONTEND_URL
- CLIENT_URLS
- MONGODB_URI
- JWT_SECRET_KEY
- GROQ_API_KEY
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- LINKEDIN_CLIENT_ID
- LINKEDIN_CLIENT_SECRET
- MAIL_HOST
- MAIL_PORT
- MAIL_USER
- MAIL_PASS
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- IPWHO_API_KEY

## Run the Server

```bash
npm start
```

Default local URL: http://localhost:5000

## Available Scripts

- npm start
- npm run format

## API Base Path

- /api/v1

## Production Notes

- Do not commit the .env file.
- Use strong secrets for JWT and third-party credentials.
- Restrict allowed origins in CLIENT_URLS.
