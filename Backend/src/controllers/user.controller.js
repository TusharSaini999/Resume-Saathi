import User from '../models/user.model.js';
import Session from '../models/session.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { UAParser } from 'ua-parser-js';
import { COOKIE_OPTIONS, EMAIL_VERIFICATION_TTL, PASSWORD_RESET_TTL } from '../constants.js';
import sendEmail from '../utils/sendMail.js';
import Token from '../models/token.model.js';
import crypto from 'crypto';

//generate session
const genrateSession = async (user, req) => {
  const token = user.generateToken();

  const ip =
    req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || '0.0.0.0';

  const uaParser = new UAParser(req.headers['user-agent']);
  const userData = uaParser.getResult();

  const response = await fetch(`https://ipapi.co/${ip}/json/`);
  const data = await response.json();

  const sessionData = {
    user_id: user._id,
    token: token,
    browser: userData.browser.name || 'Unknown',
    os: userData.os.name || 'Unknown',
    location: `${data.city || 'Unknown'}, ${data.region || 'Unknown'}, ${data.country_name || 'Unknown'}`,
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

//send varification email
const sendVerificationEmail = async (user) => {
  const existingToken = await Token.findOne({
    user_id: user._id,
    type: 'email_verification',
  }).sort({ createdAt: -1 });

  if (existingToken) {
    const now = Date.now();
    const tokenCreatedTime = new Date(existingToken.createdAt).getTime();

    if (now - tokenCreatedTime < EMAIL_VERIFICATION_TTL) {
      console.log('Verification email already sent recently.');
      return { email_ExpiresAt: existingToken.expires_at, email_Send: true };
    }
  }

  const token = crypto.randomBytes(32).toString('hex');

  const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_TTL);

  await Token.create({
    user_id: user._id,
    token,
    type: 'email_verification',
    expires_at: expiresAt,
  });

  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const subject = 'Verify Your Email Address';

  const text = `Hello ${user.name},

Please verify your email address by clicking the link below:

${verificationLink}

If you did not create an account, please ignore this email.

Thank you!`;

  const html = `
    <p>Hello ${user.name},</p>
    <p>Please verify your email address by clicking the link below:</p>
    <a href="${verificationLink}">Verify Email</a>
    <p>If you did not create an account, please ignore this email.</p>
    <p>Thank you!</p>
  `;

  await sendEmail({
    to: user.email,
    subject,
    text,
    html,
  });

  return { email_ExpiresAt: expiresAt, email_Send: true };
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

  const email_resp = await sendVerificationEmail(user);
  res.status(201).json(
    new ApiResponse(true, 200, 'User created! Verification email sent.', {
      ...user._doc,
      ...email_resp,
    })
  );
});

//verify email
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;
  if (!token) {
    throw new ApiError(400, 'Verification token is required');
  }

  const tokenDoc = await Token.findOne({ token, type: 'email_verification' });
  if (!tokenDoc) {
    throw new ApiError(400, 'Invalid or expired verification token');
  }
  const user = await User.findByIdAndUpdate(
    tokenDoc.user_id,
    { email_verified: true }, // update
    { new: true } // return updated document
  ).select('-password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  if (!user.email_verified) {
    throw new ApiError(400, 'Failed to verify email. Please try again.');
  }
  await Token.deleteMany({ user_id: user._id, type: 'email_verification' });

  const accessToken = await genrateSession(user, req);

  res
    .status(200)
    .cookie('token', accessToken, COOKIE_OPTIONS)
    .json(
      new ApiResponse(true, 200, 'Email verified successfully', {
        ...user._doc,
        token: accessToken,
      })
    );
});

//resend verification email
const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  if (user.email_verified) {
    throw new ApiError(400, 'Email is already verified');
  }
  const email_resp = await sendVerificationEmail(user);
  res
    .status(200)
    .json(new ApiResponse(true, 200, 'Verification email resent successfully', email_resp));
});

//login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(400, 'Invalid email or password');
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(400, 'Invalid email or password');
  }
  if (!user.email_verified) {
    const sendEmail = await sendVerificationEmail(user);
    return res.status(400).json(
      new ApiResponse(true, 400, 'Login Successful but email not verified', {
        ...user._doc,
        ...sendEmail,
      })
    );
  } else {
    const token = await genrateSession(user, req);
    res
      .status(200)
      .cookie('token', token, COOKIE_OPTIONS)
      .json(new ApiResponse(true, 200, 'Login successful', { ...user._doc, token }));
  }
});

//forgot password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!email) {
    throw new ApiError(400, 'Email address is required.');
  }

  const user = await User.findOne({ email });

  // Prevent email enumeration (VERY IMPORTANT)
  if (!user) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          true,
          200,
          'If an account with this email exists, a password reset link has been sent.'
        )
      );
  }

  // Check if active reset token already exists
  const existingToken = await Token.findOne({
    user_id: user._id,
    type: 'password_reset',
    expires_at: { $gt: new Date() },
  });

  if (existingToken) {
    throw new ApiError(
      429,
      'A password reset link has already been sent. Please check your email or wait until it expires.'
    );
  }

  //Generate secure token
  const rawToken = crypto.randomBytes(32).toString('hex');

  // Hash token before saving (SECURE)
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL); // 10 minutes

  await Token.create({
    user_id: user._id,
    token: hashedToken,
    type: 'password_reset',
    expires_at: expiresAt,
  });

  //Create reset link (send RAW token)
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

  const subject = 'Password Reset Request';

  const text = `Hello ${user.name},

We received a request to reset your password.

Reset your password using the link below:
${resetLink}

This link will expire in 10 minutes.

If you did not request this, please ignore this email.

Thank you.`;

  const html = `
    <p>Hello ${user.name},</p>
    <p>We received a request to reset your password.</p>
    <p>
      <a href="${resetLink}" 
         style="padding:10px 15px;background:#2563eb;color:white;text-decoration:none;border-radius:5px;">
         Reset Password
      </a>
    </p>
    <p>This link will expire in 10 minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
    <p>Thank you.</p>
  `;

  await sendEmail({
    to: user.email,
    subject,
    text,
    html,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        true,
        200,
        'If an account with this email exists, a password reset link has been sent.'
      )
    );
});

//reset password
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    throw new ApiError(400, 'Token and new password are required');
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const tokenDoc = await Token.findOne({
    token: hashedToken,
    type: 'password_reset',
  });
  if (!tokenDoc) {
    throw new ApiError(400, 'Invalid or expired password reset token');
  }

  const user = await User.findByIdAndUpdate(
    tokenDoc.user_id,
    { password: newPassword },
    { new: true }
  );
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  await Token.deleteOne({ _id: tokenDoc._id });
  res.status(200).json(new ApiResponse(true, 200, 'Password reset successful'));
});

//chnage password (while logged in)
const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'Current and new password are required');
  }

  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  //Special case: Password is null (OAuth user)
  if (!user.password) {
    throw new ApiError(
      400,
      'No password is set for this account. Please use "Forgot Password" to create a new password first.'
    );
  }

  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    throw new ApiError(400, 'Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json(new ApiResponse(true, 200, 'Password changed successfully'));
});

//logout user
const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');
  await Session.updateMany(
    { user_id: userId, token: token, is_active: true },
    { is_active: false }
  );
  res
    .status(200)
    .clearCookie('token', COOKIE_OPTIONS)
    .json(new ApiResponse(true, 200, 'Logout successful'));
});

//logout all sessions
const logoutAllSessions = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  await Session.updateMany({ user_id: userId, is_active: true }, { is_active: false });
  res
    .status(200)
    .clearCookie('token', COOKIE_OPTIONS)
    .json(new ApiResponse(true, 200, 'All sessions logged out successfully'));
});

//List All Sessions for a user
const listSessions = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const sessions = await Session.find({ user_id: userId }).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(true, 200, 'Sessions retrieved successfully', sessions));
});

//Kill a specific session
const killSession = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { sessionId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw new ApiError(400, 'Invalid session id');
  }

  const session = await Session.findOneAndUpdate(
    { _id: sessionId, user_id: userId, is_active: true },
    { is_active: false },
    { new: true }
  );

  if (!session) {
    throw new ApiError(404, 'Session not found');
  }

  return res.status(200).json(new ApiResponse(200, null, 'Session killed successfully'));
});

export {
  createUser,
  verifyEmail,
  resendVerificationEmail,
  loginUser,
  logoutAllSessions,
  logoutUser,
  changePassword,
  listSessions,
  killSession,
  forgotPassword,
  resetPassword,
};
