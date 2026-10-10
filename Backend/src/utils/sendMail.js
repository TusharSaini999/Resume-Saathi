import nodemailer from "nodemailer";
import ApiError from "./ApiError.js";

const {
  MAIL_HOST,
  MAIL_PORT,
  MAIL_SECURE,
  MAIL_USER,
  MAIL_PASS,
  MAIL_FROM,
} = process.env;

// Validate required mail configuration at startup
if (!MAIL_HOST || !MAIL_PORT || !MAIL_USER || !MAIL_PASS || !MAIL_FROM) {
  throw new Error("Missing required mail environment variables");
}

const port = Number(MAIL_PORT);

if (!Number.isInteger(port)) {
  throw new Error("MAIL_PORT must be a valid number");
}

// Create transporter once and reuse it
const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port,
  secure: MAIL_SECURE === "true", // 465 = true, 587 = false (STARTTLS)
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

const sendMail = async ({ to, subject, text, html }) => {
  try {
    const fromAddress = MAIL_FROM.includes("<")
      ? MAIL_FROM
      : `"Resume Saathi" <${MAIL_FROM}>`;

    const mailOptions = {
      from: fromAddress,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    return info;
  } catch (err) {
    console.error("Error sending email:", err);

    throw new ApiError(
      500,
      "Failed to send email",
      [],
      err instanceof Error ? err.stack : undefined
    );
  }
};

export default sendMail;