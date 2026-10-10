import Contact from '../models/contact.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const submitContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json(new ApiResponse(400, null, 'All fields are required.'));
  }

  const contact = await Contact.create({
    name,
    email,
    subject,
    message,
  });

  return res.status(201).json(
    new ApiResponse(201, contact, 'Your message has been sent successfully.')
  );
});
