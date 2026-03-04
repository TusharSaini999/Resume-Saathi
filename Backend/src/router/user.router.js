import router from 'express';

import {createUser,verifyEmail, resendVerificationEmail} from '../controllers/user.controller.js';

const userRouter = router.Router();

userRouter.post('/register', createUser);
userRouter.get('/verify-email', verifyEmail);
userRouter.post('/resend-verification-email', resendVerificationEmail);

export default userRouter;