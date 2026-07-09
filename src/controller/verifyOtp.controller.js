// import User from "../models/user.model.js";
// import PendingRegistration from "../models/pendingRegistration.model.js";

// export const verifyEmailOTP = async (req, res) => {
//   try {

//     const { email, otp } = req.body;


//     if (!email || !otp) {

//       return res.status(400).json({

//         success: false,

//         message:
//           "Email and OTP are required",

//       });

//     }


//     const normalizedEmail =
//       email.toLowerCase().trim();


//     // ==========================================
//     // FIND PENDING REGISTRATION
//     // ==========================================

//     const pendingUser =
//       await PendingRegistration.findOne({

//         email: normalizedEmail,

//         otp,

//         otpExpiry: {
//           $gt: new Date(),
//         },

//       });


//     if (!pendingUser) {

//       return res.status(400).json({

//         success: false,

//         message:
//           "Invalid or expired OTP",

//       });

//     }


//     // ==========================================
//     // DOUBLE CHECK USER DOES NOT EXIST
//     // ==========================================

//     const existingUser = await User.findOne({

//       $or: [
//         { email: pendingUser.email },
//         { number: pendingUser.number },
//       ],

//     });


//     if (existingUser) {

//       await PendingRegistration.deleteOne({
//         _id: pendingUser._id,
//       });


//       return res.status(409).json({

//         success: false,

//         message:
//           "User already exists",

//       });

//     }


//     // ==========================================
//     // CREATE VERIFIED USER
//     // ==========================================
//     //
//     // Using collection.insertOne intentionally
//     // because pendingUser.password is already hashed.
//     // This avoids hashing the password twice.
//     // ==========================================

//     const now = new Date();

//     const result =
//       await User.collection.insertOne({

//         name: pendingUser.name,

//         number: pendingUser.number,

//         email: pendingUser.email,

//         password: pendingUser.password,

//         role: "student",

//         isVerified: true,

//         createdAt: now,

//         updatedAt: now,

//       });


//     // ==========================================
//     // REMOVE TEMPORARY REGISTRATION
//     // ==========================================

//     await PendingRegistration.deleteOne({

//       _id: pendingUser._id,

//     });


//     return res.status(201).json({

//       success: true,

//       message:
//         "Email verified and account created successfully",

//       user: {

//         id: result.insertedId,

//         name: pendingUser.name,

//         email: pendingUser.email,

//         role: "student",

//       },

//     });


//   } catch (error) {

//     console.error(
//       "Verify Registration OTP Error:",
//       error
//     );


//     return res.status(500).json({

//       success: false,

//       message:
//         "Server error during OTP verification",

//     });

//   }

// };









import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import PendingRegistration from "../models/pendingRegistration.model.js";


// ==========================================
// GENERATE JWT
// ==========================================

const generateToken = (userId) => {

  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

};


// ==========================================
// VERIFY EMAIL OTP
// ==========================================

export const verifyEmailOTP = async (req, res) => {

  try {

    const { email, otp } = req.body;


    if (!email || !otp) {

      return res.status(400).json({

        success: false,

        message: "Email and OTP are required",

      });

    }


    const normalizedEmail =
      email.toLowerCase().trim();


    // ==========================================
    // FIND PENDING REGISTRATION
    // ==========================================

    const pendingUser =
      await PendingRegistration.findOne({

        email: normalizedEmail,

        otp,

        otpExpiry: {
          $gt: new Date(),
        },

      });


    if (!pendingUser) {

      return res.status(400).json({

        success: false,

        message: "Invalid or expired OTP",

      });

    }


    // ==========================================
    // CHECK EXISTING USER
    // ==========================================

    const existingUser = await User.findOne({

      $or: [

        {
          email: pendingUser.email,
        },

        {
          number: pendingUser.number,
        },

      ],

    });


    if (existingUser) {

      await PendingRegistration.deleteOne({

        _id: pendingUser._id,

      });


      return res.status(409).json({

        success: false,

        message: "User already exists",

      });

    }


    // ==========================================
    // CREATE VERIFIED USER
    // ==========================================

    const now = new Date();


    const result =
      await User.collection.insertOne({

        name: pendingUser.name,

        number: pendingUser.number,

        email: pendingUser.email,

        password: pendingUser.password,

        role: "student",

        isVerified: true,

        createdAt: now,

        updatedAt: now,

      });


    // ==========================================
    // GENERATE JWT TOKEN
    // ==========================================

    const token = generateToken(
      result.insertedId
    );


    // ==========================================
    // REMOVE PENDING REGISTRATION
    // ==========================================

    await PendingRegistration.deleteOne({

      _id: pendingUser._id,

    });


    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(201).json({

      success: true,

      message:
        "Email verified and account created successfully",

      token,

      user: {

        id: result.insertedId,

        name: pendingUser.name,

        number: pendingUser.number,

        email: pendingUser.email,

        role: "student",

      },

    });


  } catch (error) {

    console.error(
      "Verify Registration OTP Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Server error during OTP verification",

    });

  }

};







