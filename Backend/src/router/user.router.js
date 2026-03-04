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
} from '../controllers/user.controller.js';

const userRouter = router.Router();

userRouter.post('/register', createUser);
userRouter.get('/verify-email', verifyEmail);
userRouter.post('/resend-verification-email', resendVerificationEmail);
userRouter.post('/login', loginUser);
userRouter.post('forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);
userRouter.post('/change-password', verifyJwt, changePassword);
userRouter.get('/sessions', verifyJwt, listSessions);
userRouter.post('/logout', verifyJwt, logoutUser);
userRouter.post('/logout-all', verifyJwt, logoutAllSessions);
userRouter.get('/kill-specific-session', verifyJwt, killSession);

export default userRouter;
