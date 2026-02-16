import User from "../models/user.model.js";
import transporter from "../config/email.js";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.emailOTP = otp;
    user.emailOTPExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: `"Placement Cell" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset OTP",
      html: `<h2>Your OTP: ${otp}</h2><p>Valid for 10 minutes</p>`,
    });

    res.json({
      message: "OTP sent to email",
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};




export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email, OTP and new password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      emailOTP: otp,
      emailOTPExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    user.password = newPassword;
    user.emailOTP = undefined;
    user.emailOTPExpiry = undefined;

    await user.save();

    res.json({
      message: "Password reset successfully",
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
