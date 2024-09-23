import { Router } from "express";
import { forgotPassword, login, logout, signup, verifyEmail } from "../controllers/auth.js";

const router = Router();

router.route('/signup')
.post(signup);

router.route('/login')
.post(login);

router.route('/logout')
.post(logout);

router.route('/verify-email')
.post(verifyEmail);

router.route('/forgot-password')
.post(forgotPassword);

export default router;