// @ts-nocheck
import nodemailer from "nodemailer";
import ApiError from "./apiError.js";

const sendMail = async ({ to, subject, text, html }) => {
  try {
    //  Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,       // e.g., smtp.gmail.com
      port: process.env.MAIL_PORT || 465,
      secure: true,                     // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USER,     // your email
        pass: process.env.MAIL_PASS      // email app password
      },
    });

    // Prepare mail options
    const mailOptions = {
      from: `"Support" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    //  Send email
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (err) {
    console.error("Error sending email:", err);
    throw new ApiError(500, "Failed to send email", [], err.stack);
  }
};

export default sendMail;