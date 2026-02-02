import User from "../models/user.model.js";
import transporter from "../config/email.js";
import { verifyEmailOTP } from "./verifyOtp.controller.js";



export const registerUser = async (req, res) => {
  try {
    const { email, password, role, number, name } = req.body;

    // 1. Validate input
    if (!email || !password || !number || !name) {
      return res.status(400).json({
        message: "Name, email, password, and number are required",
      });
    }

    // 2. Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, and a special character",
      });
    }

    // 3. Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // ============================
    // ✅ NEW: Generate OTP
    // ============================
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 4. Create new user (NO existing logic removed)
    const user = new User({
      email: email.toLowerCase(),
      password,
      role,          // unchanged
      number,        // unchanged
      name,          // unchanged
      emailOTP: otp,
      emailOTPExpiry: Date.now() + 10 * 60 * 1000, // 10 minutes
      isVerified: false,
    });

    // 5. Save user (password hashing still works)
    await user.save();

    // ============================
    // ✅ NEW: Send OTP Email
    // ============================
    await transporter.sendMail({
      from: `"Placement Cell" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Verify your email (OTP)",
      html: `
        <h3>Email Verification</h3>
        <p>Your OTP is:</p>
        <h2>${otp}</h2>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    });

    // 6. Response (safe)
    res.status(201).json({
      message: "User registered successfully. OTP sent to email.",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        number: user.number,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error in registration",
    });
  }
};
