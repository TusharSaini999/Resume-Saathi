export const DB_NAME = 'ResumeSaathiDB';
export const SIZE_LIMIT = 16 * 1024; //16KB
export const URL_LIMIT = 1 * 1024 * 1024; //1MB
export const PARAMETER_LIMIT = 1000;
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 365 * 24 * 60 * 60 * 1000, //1 year
};
export const EMAIL_VERIFICATION_TTL = 15 * 60 * 1000; //15 minutes
export const PASSWORD_RESET_TTL = 10 * 60 * 1000; //10 minutes
export const JWT_EXPIRATION = 365 * 24 * 60 * 60 * 1000; //1 year

