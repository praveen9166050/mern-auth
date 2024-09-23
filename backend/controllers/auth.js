import User from "../models/User.js";
import CustomError from "../utils/CustomError.js";
import bcryptjs from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationMail } from "../utils/emails.js";

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
    res.status(200).json({
      success: true,
      message: "Signup successful",
      user: userDoc
    });
  } catch (error) {
    next(error);
  }
}

export const login = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Login successful"
    });
  } catch (error) {
    next(error);
  }
}

export const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    next(error);
  }
}