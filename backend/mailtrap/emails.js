import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { VERIFICATION_EMAIL_TEMPLATE, SUCCESSFUL_VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplate.js";

dotenv.config();

// Configure the SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // SMTP server 
  port: process.env.SMTP_PORT, // SMTP port 
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER, //SMTP username
    pass: process.env.SMTP_PASS, //SMTP password
  },
});

// Sender information
const sender = {
  email: "info@navicodes.com",
  name: "Lasith Chamika Viduranga",
};

// Send Verification Email
export const sendVerificationEmail = async (email, verificationToken, user) => {
  const mailOptions = {
    from: `"${sender.name}" <${sender.email}>`,
    to: email,
    subject: "Verify Your Email",
    html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken).replace("{user}", user),
  };

  try {
    const response = await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully", response);
  } catch (error) {
    console.error("Error sending verification email", error);
    throw new Error("Error sending verification email");
  }
};

// Send Welcome Email
export const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: `"${sender.name}" <${sender.email}>`,
    to: email,
    subject: "Successful Verification of Your Email",
    html: SUCCESSFUL_VERIFICATION_EMAIL_TEMPLATE.replace("{user}", name),
  };

  try {
    const response = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.error("Error sending welcome email", error);
    throw new Error("Error sending welcome email");
  }
};

// Send Password Reset Email
export const sendPasswordResetEmail = async (email, resetURL, user) => {
  const mailOptions = {
    from: `"${sender.name}" <${sender.email}>`,
    to: email,
    subject: "Reset Your Password",
    html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL).replace("{user}", user),
  };

  try {
    const response = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully", response);
  } catch (error) {
    console.error("Error sending password reset email", error);
    throw new Error("Error sending password reset email");
  }
};

// Send Reset Success Email
export const sendResetSuccessEmail = async (email, user) => {
  const mailOptions = {
    from: `"${sender.name}" <${sender.email}>`,
    to: email,
    subject: "Password Reset Successfully",
    html: PASSWORD_RESET_SUCCESS_TEMPLATE.replace("{user}", user),
  };

  try {
    const response = await transporter.sendMail(mailOptions);
    console.log("Password reset success email sent successfully", response);
  } catch (error) {
    console.error("Error sending password reset success email", error);
    throw new Error("Error sending password reset success email");
  }
};
