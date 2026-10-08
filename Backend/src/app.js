import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { PARAMETER_LIMIT, SIZE_LIMIT, URL_LIMIT } from './constants.js';
import passport from './config/passport_config.js';
const app = express();

// Safe handling if CLIENT_URLS is not defined
const allowedOrigins = process.env.CLIENT_URLS
  ? process.env.CLIENT_URLS.split(',').map((origin) => origin.trim())
  : [];

// Security headers
app.use(helmet());


// Route logger middleware
app.use((req, res, next) => {
  const time = new Date().toLocaleString();
  console.log(`[${time}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);


// Body parsers
app.use(express.json({ limit: SIZE_LIMIT }));

app.use(
  express.urlencoded({
    extended: true,
    limit: URL_LIMIT,
    parameterLimit: PARAMETER_LIMIT,
  })
);

// Static folder
app.use(express.static('public'));

// Cookie parser
app.use(cookieParser());

// Trust exactly ONE proxy hop (the Nginx reverse proxy on the same host).
// This makes req.ip, req.protocol, and secure cookies work correctly
// when traffic arrives via X-Forwarded-For / X-Forwarded-Proto headers.
app.set('trust proxy', 1);

app.use(passport.initialize());

import testRoute from './router/test.route.js';
import userRouter from './router/user.router.js';
import resumeRouter from './router/resume.router.js';
import jobRouter from './router/job.router.js';
import chatRouter from './router/chat.router.js';
import authRoutes from './router/auth.router.js';
import contactRouter from './router/contact.router.js';

app.get('/', (req, res) => res.status(200).json({ message: 'ok', status: '200' }));
app.get('/api/v1/healthcheck', (req, res) => res.status(200).json({ status: 'ok', time: new Date().toISOString() }));
app.use('/api/v1', testRoute);
app.use('/api/v1/jobs', jobRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/resumes', resumeRouter);
app.use('/api/v1/chating', chatRouter);
app.use("/api/v1/auth", authRoutes);
app.use('/api/v1/contact', contactRouter);

export default app;
