import { Router } from 'express';
import verifyJwt from '../middlewares/auth.middleware.js';
import { chat, history, clearHistory } from '../controllers/chat.controller.js';
const chatRouter = Router();

chatRouter.post('/chat/:query', verifyJwt, chat);
chatRouter.get('/chat/history', verifyJwt, history);
chatRouter.get('/chat/history/:id', verifyJwt, history);
chatRouter.delete('/chat/history/:id', verifyJwt, clearHistory);

export default chatRouter;
