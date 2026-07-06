import User from "../models/user.model.js";
import PendingRegistration from "../models/pendingRegistration.model.js";
import transporter from "../config/email.js";


export const registerUser = async (req, res) => {
  try {

    const {
      email,
      password,
      number,
      name
    } = req.body;


    // ==========================================
    // 1. VALIDATE INPUT
    // ==========================================

    if (!email || !password || !number || !name) {

      return res.status(400).json({
        success: false,
        message:
          "Name, email, password and number are required",
      });

    }


    const normalizedEmail =
      email.toLowerCase().trim();


    // ==========================================
    // 2. PASSWORD VALIDATION
    // ==========================================

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;


    if (!passwordRegex.test(password)) {

      return res.status(400).json({
        success: false,

        message:
          "Password must contain uppercase, lowercase, special character and minimum 8 characters",
      });

    }


    // ==========================================
    // 3. CHECK REAL USER
    // ==========================================

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });


    if (existingUser) {

      return res.status(409).json({
        success: false,
        message: "User already exists",
      });

    }


    // Also check phone number
    const existingNumber = await User.findOne({
      number,
    });


    if (existingNumber) {

      return res.status(409).json({
        success: false,
        message: "Mobile number already registered",
      });

    }


    // ==========================================
    // 4. GENERATE OTP
    // ==========================================

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();


    const otpExpiry =
      Date.now() + 10 * 60 * 1000;


    // ==========================================
    // 5. REMOVE OLD PENDING REQUEST
    // ==========================================

    await PendingRegistration.deleteOne({
      email: normalizedEmail,
    });


    // ==========================================
    // 6. CREATE PENDING REGISTRATION
    // ==========================================

    const pendingUser =
      new PendingRegistration({

        name,

        number,

        email: normalizedEmail,

        password,

        otp,

        otpExpiry,

      });


    await pendingUser.save();


    // ==========================================
    // 7. SEND OTP
    // ==========================================

    try {

      await transporter.sendMail({

        from:
          `"Placement Cell" <${process.env.EMAIL_USER}>`,

        to: normalizedEmail,

        subject: "Email Verification OTP",

        html: `
          <h2>Placement Portal</h2>

          <p>Your verification OTP is:</p>

          <h1>${otp}</h1>

          <p>
            This OTP is valid for 10 minutes.
          </p>
        `,

      });


    } catch (emailError) {

      // Email failed, remove pending registration
      await PendingRegistration.deleteOne({
        email: normalizedEmail,
      });


      console.error(
        "OTP Email Error:",
        emailError.message
      );


      return res.status(500).json({

        success: false,

        message:
          "Unable to send OTP. Please try again.",

      });

    }


    // ==========================================
    // 8. RESPONSE
    // ==========================================

    return res.status(200).json({

      success: true,

      message:
        "OTP sent successfully. Verify OTP to complete registration.",

    });


  } catch (error) {

    console.error(
      "Registration Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Server error during registration",

    });

  }
};