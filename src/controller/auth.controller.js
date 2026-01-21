import User from "../models/user.model.js";

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

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // 3. Create new user
    const user = new User({
      email,
      password,
      role, // optional, default handled in model
      number,
      name,
    });

    // 4. Save user (password hashes automatically)
    await user.save();

    // 5. Send response (never send password)
    res.status(201).json({
      message: "User registered successfully",
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
      message: "Server error in regestation",
    });
  }

  console.log(req.body);
};