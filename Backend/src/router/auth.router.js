import { Router } from 'express';
import passport from 'passport';
import authController from '../controllers/auth.controller';
const authRouter = Router();

/* ---------- GOOGLE AUTH ---------- */
/* Start Google Login */
authRouter.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

/* Google Callback */
authRouter.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  authController
);

/********** LINKEDIN AUTH **********/
/* Start LinkedIn Login */
authRouter.get(
  '/linkedin',
  passport.authenticate('linkedin', {
    scope: ['r_liteprofile', 'r_emailaddress'],
    session: false,
  })
);

/* LinkedIn Callback */
authRouter.get(
  '/linkedin/callback',
  passport.authenticate('linkedin', {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  authController
);

export default authRouter;
