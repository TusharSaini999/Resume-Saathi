import User from '../models/user.model.js';
import Session from '../models/session.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { UAParser } from 'ua-parser-js';
import { COOKIE_OPTIONS } from '../constants.js';

const genrateSession = async (user, req) => {
  const token = user.generateToken();

  const ip =
    req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || '0.0.0.0';

  const uaParser = new UAParser(req.headers['user-agent']);
  const userData = uaParser.getResult();

  const sessionData = {
    user_id: user._id,
    token: token,
    browser: userData.browser.name || 'Unknown',
    os: userData.os.name || 'Unknown',
    device_name: userData.device.model || userData.device.type || 'Desktop',
    ip_address: ip,
    is_active: true,
    expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  };

  const session = await Session.create(sessionData);
  if (!session) {
    throw new ApiError(500, 'Failed to create session');
  }
  return token;
};

//create user
const createUser = asyncHandler(async (req, res) => {
  let { name, email, password } = req.body;
  name = name.trim();
  email = email.trim().toLowerCase();
  password = password.trim();

  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email and password are required');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, 'Invalid email format');
  }

  if (password.length < 8) {
    throw new ApiError(400, 'Password must be at least 8 characters');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'Account already exist!');
  }

  if (!req.headers['user-agent']) {
    throw new ApiError(400, 'User-Agent not provided');
  }

  if (req.headers['user-agent'].length > 1000) {
    throw new ApiError(400, 'User-Agent header is too long');
  }

  const user = await User.create({ name, email, password });

  user.password = undefined;

  const token = await genrateSession(user, req);

  res
    .status(201)
    .cookie('token', token, COOKIE_OPTIONS)
    .json(new ApiResponse(true, 200, 'User created successfully', { ...user._doc, token }));
});

export { createUser };
