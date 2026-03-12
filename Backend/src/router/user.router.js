import router from 'express';
import verifyJwt from '../middlewares/auth.middleware.js';
import {
  createUser,
  verifyEmail,
  resendVerificationEmail,
  loginUser,
  logoutAllSessions,
  logoutUser,
  killSession,
  listSessions,
  forgotPassword,
  resetPassword,
  changePassword,
  getUser,
} from '../controllers/user.controller.js';

const userRouter = router.Router();

// Public
userRouter.post('/register', createUser);
userRouter.get('/verify-email', verifyEmail);
userRouter.post('/resend-verification-email', resendVerificationEmail);
userRouter.post('/login', loginUser);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);

// Protected
userRouter.get('/me', verifyJwt, getUser);
userRouter.post('/change-password', verifyJwt, changePassword);
userRouter.get('/sessions', verifyJwt, listSessions);
userRouter.delete('/sessions/:sessionId', verifyJwt, killSession);
userRouter.post('/logout', verifyJwt, logoutUser);
userRouter.delete('/logout-all', verifyJwt, logoutAllSessions);

export default userRouter;
