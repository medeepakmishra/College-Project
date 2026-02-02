import User from "../models/user.model.js";

export const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      emailOTP: otp,
      emailOTPExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired OTP"
      });
    }

    user.isVerified = true;
    user.emailOTP = undefined;
    user.emailOTPExpiry = undefined;

    await user.save();

    res.json({ message: "Email verified successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
