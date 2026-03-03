export const DB_NAME = 'ResumeSaathiDB';
export const SIZE_LIMIT = 16 * 1024; //16KB
export const URL_LIMIT = 1 * 1024 * 1024; //1MB
export const PARAMETER_LIMIT = 1000;
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 365 * 24 * 60 * 60 * 1000, //1 year
};
