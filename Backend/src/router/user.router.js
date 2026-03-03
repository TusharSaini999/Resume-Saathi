import router from 'express';

import {createUser} from '../controllers/user.controller.js';

const userRouter = router.Router();

userRouter.post('/register', createUser);

export default userRouter;