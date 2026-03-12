import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';

/* ---------- GOOGLE STRATEGY ---------- */

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.HOST_SERVER}/api/v1/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userData = {
          provider: 'GOOGLE',
          providerId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value,
        };

        return done(null, userData);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

/* ---------- LINKEDIN STRATEGY ---------- */

passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: `${process.env.HOST_SERVER}/api/v1/auth/linkedin/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userData = {
          provider: 'LINKEDIN',
          providerId: profile.id,
          name: profile.displayName,
          email: profile.email,
        };

        return done(null, userData);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;
