import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmailFun from "../config/sendEamil.js";
import userModel from "../models/usersModel.js";
import VerificationEmail from "../utils/verifyEmailTemplate.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";

/** ----------------- REGISTER ----------------- */
export async function registerController(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Provide name, email, and password",
        error: true,
        success: false,
      });
    }

    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already registered with this email",
        error: true,
        success: false,
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    user = new userModel({
      name,
      email,
      password: hashPassword,
      otp,
      verify_email: false,
      otpExpires: Date.now() + 5 * 60 * 1000,
      status: "Active",
    });
    await user.save();

    await sendEmailFun({
      sendTo: email,
      subject: "Verify email from UniQbd",
      text: "",
      html: VerificationEmail(name, otp),
    });

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JSON_WEB_TOKEN_SECRET_KEY,
      { expiresIn: "24h" },
    );

    return res.status(200).json({
      message: "User registered successfully! Please verify your email",
      token,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

/** ----------------- VERIFY EMAIL ----------------- */
export async function verifyEmailController(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Provide email and OTP",
        success: false,
        error: true,
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    const isCodeValid = user.otp === otp;
    const isNotExpired = user.otpExpires > Date.now();

    if (!isCodeValid) {
      return res.status(400).json({
        message: "Invalid OTP",
        success: false,
        error: true,
      });
    }

    if (!isNotExpired) {
      return res.status(400).json({
        message: "OTP expired",
        success: false,
        error: true,
      });
    }

    user.verify_email = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return res.status(200).json({
      message: "Email verified successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

/** ----------------- LOGIN ----------------- */
export async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    user.last_login_date = new Date();
    await user.save();

    const cookieOptions = {
      httpOnly: true,   // 🔥 IMPORTANT
      secure: false,    // production হলে true (https)
      sameSite: "lax",
    };

    // 🔥 cookies set (ONLY SERVER)
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(200).json({
      message: "Login successful",
      success: true,
      data: {
        userEmail: user.email,
        userName: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
/** ----------------- LOGOUT ----------------- */
export async function logoutController(req, res) {
  try {
    const userId = req.userId;

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    await userModel.findByIdAndUpdate(userId, { refreshToken: "" });

    return res.status(200).json({
      message: "Logout successful",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

/** ----------------- FORGOT PASSWORD ----------------- */
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Provide email",
        success: false,
        error: true,
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendEmailFun({
      sendTo: email,
      subject: "OTP for password reset",
      text: "",
      html: VerificationEmail(user.name, otp),
    });

    return res.status(200).json({
      message: "OTP sent to email",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

/** ----------------- VERIFY FORGOT PASSWORD OTP ----------------- */
export async function verifyForgotPassword(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Provide email and OTP",
        success: false,
        error: true,
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        success: false,
        error: true,
      });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
        success: false,
        error: true,
      });
    }

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return res.status(200).json({
      message: "OTP verified successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

/** ----------------- CHANGE PASSWORD ----------------- */
export async function changePasswordController(req, res) {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
        error: true,
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
        success: false,
        error: true,
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    // check current password
    const isMatch = await bcryptjs.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is wrong",
        success: false,
        error: true,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(newPassword, salt);

    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
}
// RESEND OPT
export async function resendOtpController(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        error: true,
        success: false,
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not registered with this email",
        error: true,
        success: false,
      });
    }

    // generate new OTP
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // update existing user
    user.otp = verifyCode;
    user.otpExpires = Date.now() + 2 * 60 * 1000; // 2 min

    await user.save();

    // send email
    await sendEmailFun({
      sendTo: email,
      subject: "Verify email from UniQbd",
      text: "",
      html: VerificationEmail(user?.name, verifyCode),
    });

    console.log(`Resent OTP ${verifyCode} to ${email}`);

    return res.status(200).json({
      message: "OTP sent successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.log("resendOtpController error:", error);

    return res.status(500).json({
      message: "Server error, failed to resend OTP",
      success: false,
      error: true,
    });
  }
}
// getUserProfile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel
      .findById(userId)
      .select("-password -otp -otpExpires -refreshToken");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "User profile fetched successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};

// updateProfileController
export const updateProfileController = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, mobile, avatar } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    // update only provided fields
    if (name !== undefined) user.name = name;
    if (mobile !== undefined) user.mobile = mobile;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      data: {
        name: user.name,
        mobile: user.mobile,
        avatar: user.avatar,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};

export const updateUserRoleController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const allowedRoles = ["ADMIN", "USER", "AUTHOR", "EDITOR"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
        success: false,
        error: true,
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      message: "User role updated successfully",
      success: true,
      data: {
        userId: user._id,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel
      .find()
      .select("-password -otp -otpExpires -refreshToken");

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    if (user.role === "ADMIN") {
      return res.status(400).json({
        message: "You cannot delete an admin user",
        success: false,
        error: true,
      });
    }

    await userModel.findByIdAndDelete(userId);

    return res.status(200).json({
      message: "User deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};
