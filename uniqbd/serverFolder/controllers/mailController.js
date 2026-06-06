import smtpModel from "../models/smtpModel.js";
import nodemailer from "nodemailer";

export const testSMTPConnection = async (req, res) => {
  try {
    const { host, email, password, port } = req.body;

    const transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465,
      auth: {
        user: email,
        pass: password,
      },
    });

    await transporter.verify();

    return res.json({
      success: true,
      message: "SMTP connection successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "SMTP connection failed",
      error: error.message,
    });
  }
};

export const saveSMTPSettings = async (req, res) => {
  try {
    const { host, email, password, port } = req.body;

    if (!host || !email || !password || !port) {
      return res.status(400).json({ message: "All fields required" });
    }

    let config = await smtpModel.findOne();

    if (!config) {
      config = new smtpModel({ host, email, password, port });
    } else {
      config.host = host;
      config.email = email;
      config.password = password;
      config.port = port;
    }

    await config.save();

    return res.json({
      success: true,
      message: "SMTP settings saved",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getEnvSettings = async (req, res) => {
  const config = await smtpModel.findOne();

  return res.json({
    success: true,
    data: config,
  });
};