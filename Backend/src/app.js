import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { PARAMETER_LIMIT, SIZE_LIMIT, URL_LIMIT } from './constants.js';


const app = express();

// Safe handling if CLIENT_URLS is not defined
const allowedOrigins = process.env.CLIENT_URLS
  ? process.env.CLIENT_URLS.split(',').map((origin) => origin.trim())
  : [];

// Security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
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

app.set('trust proxy', true);

import testRoute from './router/test.route.js';
import userRouter from './router/user.router.js';

app.use('/api/v1/users', userRouter);
app.use('/api/v1', testRoute);

export default app;
