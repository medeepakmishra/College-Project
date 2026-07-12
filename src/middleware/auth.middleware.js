import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const protect = async (req, res, next) => {

  try {

    let token;


    // Get token from header

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {

      token =
        req.headers.authorization.split(" ")[1];

    }



    if (!token) {

      return res.status(401).json({

        success:false,

        message:
        "User is not authenticated"

      });

    }



    // Verify token

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );



    console.log(
      "Decoded JWT:",
      decoded
    );



    // IMPORTANT FIX HERE

    req.user =
      await User.findById(
        decoded.id
      );



    if(!req.user){

      return res.status(401).json({

        success:false,

        message:
        "User not found"

      });

    }



    next();



  }
  catch(error){


    console.error(
      "Auth Error:",
      error
    );


    return res.status(401).json({

      success:false,

      message:
      "Invalid token"

    });


  }

};



// import jwt from "jsonwebtoken";
// import User from "../models/user.model.js";

// export const protect = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (
//       !authHeader ||
//       !authHeader.startsWith("Bearer ")
//     ) {
//       return res.status(401).json({
//         success: false,
//         message: "Not authorized, token missing",
//       });
//     }

//     const token = authHeader.split(" ")[1];

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET
//     );

//     // Your JWT contains userId
//     const user = await User.findById(
//       decoded.userId
//     ).select("-password");

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User associated with this token no longer exists",
//       });
//     }

//     req.user = user;

//     next();

//   } catch (error) {
//     console.error("Auth Middleware Error:", error.message);

//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired token",
//     });
//   }
// };