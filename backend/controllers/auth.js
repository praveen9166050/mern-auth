import User from "../models/User.js";
import CustomError from "../utils/CustomError.js";
import bcryptjs from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetSuccessMail, sendResetPasswordMail, sendVerificationMail, sendWelcomeMail } from "../utils/emails.js";
import crypto from "node:crypto";

export const signup = async (req, res, next) => {
  try {
    const {email, password, name} = req.body;
    if (!email || !password || !name) {
      throw new CustomError(400, "All fields are required");
    }
    const existingUser = await User.findOne({email});
    if (existingUser) {
      throw new CustomError(400, "User with this email already exists");
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
    });
    generateTokenAndSetCookie(res, user._id);
    await sendVerificationMail(email, verificationToken);
    const userDoc = user._doc;
    delete userDoc.password;
    res.status(201).json({
      success: true,
      message: "Signup successful",
      user: userDoc
    });
  } catch (error) {
    next(error);
  }
}

export const verifyEmail = async (req, res, next) => {
  try {
    const {code} = req.body;
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: {$gt: Date.now()}
    });
    if (!user) {
      throw new CustomError(400, "Invalid or expired verification code");
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    await sendWelcomeMail(user.email, user.name);
    const userDoc = user._doc;
    delete userDoc.password;
    res.status(200).json({
      success: true,
      message: "Email verification successful",
      user: userDoc
    })
  } catch (error) {
    next(error);
  }
}

export const login = async (req, res, next) => {
  try {
    const {email, password} = req.body;
    if (!email || !password) {
      throw new CustomError(400, "Both email and password are required");
    }
    const user = await User.findOne({email});
    if (!user) {
      throw new CustomError(401, "Invalid credentials");
    }
    const matched = await bcryptjs.compare(password, user.password);
    if (!matched) {
      throw new CustomError(401, "Invalid credentials");
    }
    generateTokenAndSetCookie(res, user._id);
    user.lastLogin = Date.now();
    const loggedInUser = await user.save();
    const userDoc = loggedInUser._doc;
    delete userDoc.password;
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: userDoc
    });
  } catch (error) {
    next(error);
  }
}

export const logout = async (req, res, next) => {
  try {
    res.clearCookie('token');
    res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    next(error);
  }
}

export const forgotPassword = async (req, res, next) => {
  try {
    const {email} = req.body;
    if (!email) {
      throw new CustomError(400, "Email is required");
    }
    const user = await User.findOne({email});
    if (!user) {
      throw new CustomError(404, "User with this email does not exist");
    }
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();
    await sendResetPasswordMail(email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
    res.status(200).json({
      success: true,
      message: "Reset password mail sent successfully"
    })
  } catch (error) {
    next(error);
  }
}

export const resetPassword = async (req, res, next) => {
  try {
    const {token} = req.params;
    const {password} = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: {$gt: Date.now()}
    });
    if (!user) {
      throw new CustomError(400, "Invalied or expired reset token");
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();
    await sendPasswordResetSuccessMail(user.email);
    res.status(200).json({
      success: true,
      message: "Password reset successful"
    });
  } catch (error) {
    next(error);
  }
}