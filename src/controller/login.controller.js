// import User from "../models/User.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const emailNormalized = email.toLowerCase();
    const user = await User.findOne({ email: emailNormalized }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }
      if (!user.isVerified) {
  return res.status(403).json({
    message: "Please verify your email using OTP"
  });
}

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        number:user.number
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error form login controller" });
  }
};
 