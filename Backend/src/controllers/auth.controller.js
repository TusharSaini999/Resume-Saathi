import User from '../models/user.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import { genrateSession } from './user.controller.js';
import { COOKIE_OPTIONS } from '../constants.js';

const authController = asyncHandler(async (req, res) => {
  const userData = req.user;

  let user = await User.findOne({ email: userData.email });

  // Signup flow
  if (!user) {
    user = await User.create({
      name: userData.name,
      email: userData.email,
      email_verified: true,
      auth_service: [
        {
          auth_provider: userData.provider,
          provider_id: userData.providerId,
          linked_at: new Date(),
        },
      ],
    });
  }
  // Login flow
  else {
    const existingProvider = user.auth_service.find(
      (service) => service.auth_provider === userData.provider
    );

    if (!existingProvider) {
      user.auth_service.push({
        auth_provider: userData.provider,
        provider_id: userData.providerId,
        linked_at: new Date(),
      });

      await user.save();
    }
  }

  // Generate session token
  const token = await genrateSession(user, req);

  // Set cookie
  res.cookie('token', token, COOKIE_OPTIONS);

  // Redirect to frontend dashboard
  return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
});

export default authController;
