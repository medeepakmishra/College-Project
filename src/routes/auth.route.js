import express from "express";
import { registerUser } from "../controller/auth.controller.js";
import { loginUser } from "../controller/login.controller.js";
import { verifyEmailOTP } from "../controller/verifyOtp.controller.js";
import { changePassword } from "../controller/changePassword.controller.js";
import { forgotPassword,resetPassword } from "../controller/forgotPassword.controller.js";

const router = express.Router();

// registration route
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyEmailOTP);
router.post("/change-password", changePassword);

// forgot password (OTP)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


export default router;
