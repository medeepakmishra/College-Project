import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Email, old password and new password are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() })
      .select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Old password is incorrect",
      });
    }

    // validate new password strength
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters with uppercase, lowercase and special character",
      });
    }

    // update password
    user.password = newPassword; // bcrypt pre-save will hash
    await user.save();

    res.json({
      message: "Password changed successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
