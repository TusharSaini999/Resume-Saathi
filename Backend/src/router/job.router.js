import { Router } from 'express';
import verifyJwt from '../middlewares/auth.middleware.js';
import { check, get, search } from '../controllers/job.controller.js';

const jobRouter = Router();

jobRouter.get('/search', verifyJwt, search);

jobRouter.get('/get', verifyJwt, get);

jobRouter.post('/check', verifyJwt, check);

export default jobRouter;
