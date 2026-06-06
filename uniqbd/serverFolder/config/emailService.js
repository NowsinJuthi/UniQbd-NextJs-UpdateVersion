import nodemailer from "nodemailer";
import smtpModel from "../models/smtpModel.js";

export const sendEmail = async (to, subject, text, html) => {
  try {
    const config = await smtpModel.findOne();

    if (!config) {
      throw new Error("SMTP config not found in DB");
    }

    const transporter = nodemailer.createTransport({
      host: config.host,
      port: Number(config.port),
      secure: Number(config.port) === 465,
      auth: {
        user: config.email,
        pass: config.password,
      },
    });

    const info = await transporter.sendMail({
      from: config.email,
      to,
      subject,
      text,
      html,
    });

    console.log("EMAIL SENT:", info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.log("EMAIL ERROR:", error.message);
    return { success: false, error: error.message };
  }
};