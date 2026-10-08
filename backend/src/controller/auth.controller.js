import userModel from "../models/user.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { generateOtp, getOtpHtml } from "../utils/utils.js";
import bcrypt from "bcryptjs";
import sendEmail from "../service/email.service.js";
import otpModel from "../models/otp.model.js";
import config from "../config/config.js";
import sessionModel from "../models/session.model.js";

export async function register(req, res) {
  const { username, email, password } = req.body;

  const isAlreadyRegistered = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isAlreadyRegistered) {
    return res.status(409).json({
      success: false,
      message: "User already registered",
      code: "USER_ALREADY_EXISTS",
      data: {
        username: isAlreadyRegistered.username,
        email: isAlreadyRegistered.email,
        verified: isAlreadyRegistered.verified,
      },
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hashPassword,
  });

  const otp = generateOtp();
  const html = getOtpHtml(otp);

  await sendEmail(user.email, "Verify your email", `Your OTP is ${otp}`, html);

  const otpHash = await bcrypt.hash(otp, 10);

  await otpModel.create({
    email: user.email,
    user_id: user._id,
    otpHash,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    purpose: "EMAIL_VERIFICATION",
  });

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    code: "USER_REGISTERED_SUCCESSFULLY",
    data: {
      id: user._id,
      username: user.username,
      email: user.email,
      verified: user.verified,
    },
  });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
      code: "INVALID_EMAIL_OR_PASSWORD",
      data: null,
    });
  }

  if (!user.verified) {
    return res.status(403).json({
      success: false,
      message: "Please verify your email before logging in",
      code: "EMAIL_NOT_VERIFIED",
      data: null,
    });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
      code: "INVALID_EMAIL_OR_PASSWORD",
      data: null,
    });
  }

  // Create a unique session ID
  const sessionId = new mongoose.Types.ObjectId();

  // Create refresh token
  const refreshToken = jwt.sign(
    {
      user_id: user._id,
      session_id: sessionId,
      purpose: "REFRESH",
    },
    config.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  // Store only the hash in database
  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

  // Create session
  await sessionModel.create({
    _id: sessionId,
    user_id: user._id,
    refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  // Create access token
  const accessToken = jwt.sign(
    {
      user_id: user._id,
      session_id: sessionId,

      purpose: "ACCESS",
    },
    config.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );

  // Store refresh token in HTTP-only cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.IS_PROD,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: "Login successful",
    code: "LOGIN_SUCCESS",
    data: {
      accessToken,
    },
  });
}

export async function verifyEmail(req, res) {
  const { email, otp } = req.body;

  const otpDoc = await otpModel
    .findOne({ email, purpose: "EMAIL_VERIFICATION" })
    .sort({ createdAt: -1 });

  if (!otpDoc) {
    return res.status(404).json({
      success: false,
      message: "OTP not found",
      code: "OTP_NOT_FOUND",
      data: null,
    });
  }

  if (otpDoc.expiresAt < new Date()) {
    return res.status(410).json({
      success: false,
      message: "OTP has expired",
      code: "OTP_EXPIRED",
      data: null,
    });
  }

  const isMatchOtp = await bcrypt.compare(otp, otpDoc.otpHash);

  if (!isMatchOtp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
      code: "INVALID_OTP",
      data: null,
    });
  }

  const user = await userModel.findOneAndUpdate(
    {
      _id: otpDoc.user_id,
      email,
    },
    { verified: true },
    { new: true },
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
      code: "USER_NOT_FOUND",
      data: null,
    });
  }

  // Delete OTP after successful verification
  await otpModel.deleteOne({
    _id: otpDoc._id,
  });

  return res.status(200).json({
    success: true,
    message: "Email verified successfully",
    code: "EMAIL_VERIFIED",
    data: null,
  });
}

export async function resendOtp(req, res) {
  const { email } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
      code: "USER_NOT_FOUND",
      data: null,
    });
  }

  if (user.verified) {
    return res.status(409).json({
      success: false,
      message: "Email is already verified",
      code: "EMAIL_ALREADY_VERIFIED",
      data: null,
    });
  }

  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);

  await otpModel.deleteMany({
    email: user.email,
    purpose: "EMAIL_VERIFICATION",
  });

  await otpModel.create({
    email: user.email,
    user_id: user._id,
    otpHash,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    purpose: "EMAIL_VERIFICATION",
  });

  const html = getOtpHtml(otp);

  await sendEmail(user.email, "Verify your email", `Your OTP is ${otp}`, html);

  return res.status(200).json({
    success: true,
    message: "OTP resent successfully",
    code: "OTP_RESENT_SUCCESSFULLY",
    data: null,
  });
}
export async function logout(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(404).json({
        success: false,
        message: "Refresh token not found",
        code: "REFRESH_TOKEN_NOT_FOUND",
        data: null,
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(refreshToken, config.JWT_SECRET);
    } catch (error) {
      console.error("JWT verification error:", error);

      res.clearCookie("refreshToken");

      return res.status(401).json({
        success: false,
        message: "Refresh token is invalid or expired",
        code: "REFRESH_TOKEN_INVALID_OR_EXPIRED",
        data: null,
      });
    }

    // Make sure this token is actually a refresh token
    if (decoded.purpose !== "REFRESH") {
      res.clearCookie("refreshToken");

      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
        code: "INVALID_REFRESH_TOKEN",
        data: null,
      });
    }

    const session = await sessionModel.findOne({
      _id: decoded.session_id,
      user_id: decoded.user_id,
      revoked: false,
    });

    if (!session) {
      res.clearCookie("refreshToken");

      return res.status(404).json({
        success: false,
        message: "Session not found",
        code: "SESSION_NOT_FOUND",
        data: null,
      });
    }

    const isMatch = await bcrypt.compare(
      refreshToken,
      session.refreshTokenHash,
    );

    if (!isMatch) {
      res.clearCookie("refreshToken");

      return res.status(401).json({
        success: false,
        message: "Refresh token is invalid",
        code: "REFRESH_TOKEN_INVALID",
        data: null,
      });
    }

    session.revoked = true;
    await session.save();

    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "Logout successful",
      code: "LOGOUT_SUCCESS",
      data: null,
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      code: "INTERNAL_SERVER_ERROR",
      data: null,
    });
  }
}

export async function logoutAll(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(404).json({
        success: false,
        message: "Refresh token not found",
        code: "REFRESH_TOKEN_NOT_FOUND",
        data: null,
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(refreshToken, config.JWT_SECRET);
    } catch (error) {
      console.error("JWT verification error:", error);

      res.clearCookie("refreshToken");

      return res.status(401).json({
        success: false,
        message: "Refresh token is invalid or expired",
        code: "REFRESH_TOKEN_INVALID_OR_EXPIRED",
        data: null,
      });
    }

    if (decoded.purpose !== "REFRESH") {
      res.clearCookie("refreshToken");

      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
        code: "INVALID_REFRESH_TOKEN",
        data: null,
      });
    }

    const result = await sessionModel.updateMany(
      {
        user_id: decoded.user_id,
        revoked: false,
      },
      {
        $set: {
          revoked: true,
        },
      },
    );

    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "Logged out from all devices successfully",
      code: "LOGOUT_ALL_SUCCESS",
      data: {
        revokedSessions: result.modifiedCount,
      },
    });
  } catch (error) {
    console.error("Logout All Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      code: "INTERNAL_SERVER_ERROR",
      data: null,
    });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
        code: "USER_NOT_FOUND",
        data: null,
      });
    }

    if (!user.verified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before resetting your password",
        code: "EMAIL_NOT_VERIFIED",
        data: null,
      });
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    await otpModel.findOneAndUpdate(
      { user_id: user._id, purpose: "PASSWORD_RESET" },
      {
        email: user.email,
        user_id: user._id,
        otpHash,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        purpose: "PASSWORD_RESET",
        createdAt: new Date(),
      },
      { upsert: true, new: true },
    );
    const html = getOtpHtml(otp);
    await sendEmail(
      user.email,
      "Reset your password",
      `Your password reset OTP is ${otp}`,
      html,
    );
    return res.status(200).json({
      success: true,
      message: "Password reset OTP sent successfully",
      code: "PASSWORD_RESET_OTP_SENT",
      data: null,
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      code: "INTERNAL_SERVER_ERROR",
      data: null,
    });
  }
}

export async function verifyResetOtp(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
        code: "EMAIL_AND_OTP_REQUIRED",
        data: null,
      });
    }

    const otpDoc = await otpModel
      .findOne({
        email,
        purpose: "PASSWORD_RESET",
      })
      .sort({ createdAt: -1 });

    if (!otpDoc) {
      return res.status(404).json({
        success: false,
        message: "OTP not found",
        code: "OTP_NOT_FOUND",
        data: null,
      });
    }

    if (otpDoc.expiresAt < new Date()) {
      return res.status(410).json({
        success: false,
        message: "OTP has expired",
        code: "OTP_EXPIRED",
        data: null,
      });
    }

    const isMatchOtp = await bcrypt.compare(otp, otpDoc.otpHash);

    if (!isMatchOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
        code: "INVALID_OTP",
        data: null,
      });
    }

    await otpModel.deleteOne({
      _id: otpDoc._id,
    });

    const resetPasswordToken = jwt.sign(
      {
        user_id: otpDoc.user_id,
        purpose: "PASSWORD_RESET",
      },
      config.JWT_SECRET,
      {
        expiresIn: "10m",
      },
    );

    res.cookie("resetPasswordToken", resetPasswordToken, {
      httpOnly: true,
      secure: config.IS_PROD,
      sameSite: "strict",
      maxAge: 10 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      code: "PASSWORD_RESET_OTP_VERIFIED",
      data: null,
    });
  } catch (error) {
    console.error("Verify Reset OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      code: "INTERNAL_SERVER_ERROR",
      data: null,
    });
  }
}

export async function resetPassword(req, res) {
  try {
    const { newPassword, confirmPassword } = req.body;
    const resetPasswordToken = req.cookies.resetPasswordToken;

    if (!resetPasswordToken) {
      return res.status(401).json({
        success: false,
        message: "Reset password token is required",
        code: "RESET_PASSWORD_TOKEN_REQUIRED",
        data: null,
      });
    }

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password are required",
        code: "PASSWORD_FIELDS_REQUIRED",
        data: null,
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
        code: "PASSWORDS_DO_NOT_MATCH",
        data: null,
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(resetPasswordToken, config.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Reset password token is invalid or expired",
        code: "RESET_PASSWORD_TOKEN_INVALID_OR_EXPIRED",
        data: null,
      });
    }

    if (decoded.purpose !== "PASSWORD_RESET") {
      return res.status(401).json({
        success: false,
        message: "Invalid reset password token",
        code: "INVALID_RESET_PASSWORD_TOKEN",
        data: null,
      });
    }

    const user = await userModel.findById(decoded.user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        code: "USER_NOT_FOUND",
        data: null,
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashPassword;
    await user.save();

    await sessionModel.updateMany(
      {
        user_id: user._id,
        revoked: false,
      },
      {
        $set: {
          revoked: true,
        },
      },
    );

    res.clearCookie("resetPasswordToken", {
      httpOnly: true,
      secure: config.IS_PROD,
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
      code: "PASSWORD_RESET_SUCCESSFUL",
      data: null,
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      code: "INTERNAL_SERVER_ERROR",
      data: null,
    });
  }
}

export async function rotateToken(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not found",
        code: "REFRESH_TOKEN_NOT_FOUND",
        data: null,
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(refreshToken, config.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is invalid or expired",
        code: "REFRESH_TOKEN_INVALID_OR_EXPIRED",
        data: null,
      });
    }

    if (decoded.purpose !== "REFRESH") {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
        code: "INVALID_REFRESH_TOKEN",
        data: null,
      });
    }

    const session = await sessionModel.findOne({
      _id: decoded.session_id,
      user_id: decoded.user_id,
      revoked: false,
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session is invalid or revoked",
        code: "SESSION_INVALID_OR_REVOKED",
        data: null,
      });
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      session.refreshTokenHash,
    );

    if (!isRefreshTokenValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
        code: "INVALID_REFRESH_TOKEN",
        data: null,
      });
    }

    const user = await userModel.findById(decoded.user_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        code: "USER_NOT_FOUND",
        data: null,
      });
    }

    // Create new refresh token
    const newRefreshToken = jwt.sign(
      {
        user_id: decoded.user_id,
        session_id: decoded.session_id,
        purpose: "REFRESH",
      },
      config.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);

    session.refreshTokenHash = newRefreshTokenHash;
    await session.save();

    const accessToken = jwt.sign(
      {
        user_id: user._id,
        session_id: session._id,
        purpose: "ACCESS",
      },
      config.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: config.IS_PROD,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      code: "ACCESS_TOKEN_REFRESHED",
      data: {
        accessToken,
      },
    });
  } catch (error) {
    console.error("Refresh Token Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      code: "INTERNAL_SERVER_ERROR",
      data: null,
    });
  }
}

export async function getMe(req, res) {
  try {
    const user = await userModel.findById(req.user.user_id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        code: "USER_NOT_FOUND",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      code: "USER_FETCHED_SUCCESSFULLY",
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Get Me Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      code: "INTERNAL_SERVER_ERROR",
      data: null,
    });
  }
}
