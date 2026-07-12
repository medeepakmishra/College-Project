







// import jwt from "jsonwebtoken";

// import User from "../models/user.model.js";
// import PendingRegistration from "../models/pendingRegistration.model.js";


// // ==========================================
// // GENERATE JWT
// // ==========================================

// const generateToken = (userId) => {

//   return jwt.sign(
//     {
//       id: userId,
//     },
//     process.env.JWT_SECRET,
//     {
//       expiresIn: "7d",
//     }
//   );

// };


// // ==========================================
// // VERIFY EMAIL OTP
// // ==========================================

// export const verifyEmailOTP = async (req, res) => {

//   try {

//     const { email, otp } = req.body;


//     if (!email || !otp) {

//       return res.status(400).json({

//         success: false,

//         message: "Email and OTP are required",

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

//         message: "Invalid or expired OTP",

//       });

//     }


//     // ==========================================
//     // CHECK EXISTING USER
//     // ==========================================

//     const existingUser = await User.findOne({

//       $or: [

//         {
//           email: pendingUser.email,
//         },

//         {
//           number: pendingUser.number,
//         },

//       ],

//     });


//     if (existingUser) {

//       await PendingRegistration.deleteOne({

//         _id: pendingUser._id,

//       });


//       return res.status(409).json({

//         success: false,

//         message: "User already exists",

//       });

//     }


//     // ==========================================
//     // CREATE VERIFIED USER
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
//     // GENERATE JWT TOKEN
//     // ==========================================

//     const token = generateToken(
//       result.insertedId
//     );


//     // ==========================================
//     // REMOVE PENDING REGISTRATION
//     // ==========================================

//     await PendingRegistration.deleteOne({

//       _id: pendingUser._id,

//     });


//     // ==========================================
//     // RESPONSE
//     // ==========================================

//     return res.status(201).json({

//       success: true,

//       message:
//         "Email verified and account created successfully",

//       token,

//       user: {

//         id: result.insertedId,

//         name: pendingUser.name,

//         number: pendingUser.number,

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







// import jwt from "jsonwebtoken";

// import bcrypt from "bcrypt";

// import User from "../models/user.model.js";
// import PendingRegistration from "../models/pendingRegistration.model.js";




















// // ==========================================
// // VERIFY EMAIL OTP
// // ==========================================


// export const verifyEmailOTP = async(req,res)=>{


// try{


// const {
// email,
// otp
// }=req.body;



// if(!email || !otp){

// return res.status(400).json({

// success:false,

// message:
// "Email and OTP are required"

// });

// }



// const normalizedEmail =
// email.toLowerCase().trim();




// // ==========================================
// // FIND PENDING USER
// // ==========================================


// const pendingUser =
// await PendingRegistration.findOne({

// email:normalizedEmail

// });



// if(!pendingUser){


// return res.status(400).json({

// success:false,

// message:
// "Registration request not found"

// });


// }





// // ==========================================
// // CHECK OTP EXPIRY
// // ==========================================


// if(
// new Date() > pendingUser.otpExpiry
// ){

// return res.status(400).json({

// success:false,

// message:
// "OTP expired"

// });

// }




// // ==========================================
// // VERIFY OTP
// // ==========================================


// if(
// pendingUser.otp !== otp
// ){

// return res.status(400).json({

// success:false,

// message:
// "Invalid OTP"

// });

// }





// // ==========================================
// // CHECK USER AGAIN
// // ==========================================


// const existingUser =
// await User.findOne({

// $or:[

// {
// email:pendingUser.email
// },

// {
// number:pendingUser.number
// }

// ]

// });



// if(existingUser){


// await PendingRegistration.deleteOne({

// _id:pendingUser._id

// });


// return res.status(409).json({

// success:false,

// message:
// "User already exists"

// });


// }





// // ==========================================
// // CREATE USER
// // ==========================================


// const user =
// await User.create({

// name:
// pendingUser.name,


// email:
// pendingUser.email,


// number:
// pendingUser.number,


// password:
// pendingUser.password,


// role:"student",


// isVerified:true

// });




// // ==========================================
// // DELETE PENDING DATA
// // ==========================================


// await PendingRegistration.deleteOne({

// _id:pendingUser._id

// });




// // ==========================================
// // TOKEN
// // ==========================================


// const token =
// generateToken(user);




// // ==========================================
// // RESPONSE
// // ==========================================


// return res.status(201).json({

// success:true,

// message:
// "Email verified and account created successfully",


// token,


// user:{

// id:user._id,

// name:user.name,

// email:user.email,

// number:user.number,

// role:user.role

// }

// });



// }
// catch(error){


// console.error(
// "OTP Verification Error:",
// error
// );



// return res.status(500).json({

// success:false,

// message:
// "Server error during OTP verification"

// });


// }


// };













import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import PendingRegistration from "../models/pendingRegistration.model.js";



// ==========================================
// GENERATE JWT TOKEN
// ==========================================

const generateToken = (user) => {

    return jwt.sign(
        {
            id: user._id.toString(),
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

};




// ==========================================
// VERIFY EMAIL OTP
// ==========================================

export const verifyEmailOTP = async (req, res) => {

    try {


        const {
            email,
            otp
        } = req.body;



        if (!email || !otp) {

            return res.status(400).json({

                success:false,

                message:
                "Email and OTP are required"

            });

        }



        const normalizedEmail =
            email.toLowerCase().trim();



        const cleanOtp =
            otp.toString().trim();



        console.log(
            "Searching pending user:",
            normalizedEmail
        );



        // ==========================================
        // FIND PENDING REGISTRATION
        // ==========================================


        const pendingUser =
            await PendingRegistration.findOne({

                email: normalizedEmail

            });



        console.log(
            "Pending User:",
            pendingUser
        );



        if (!pendingUser) {

            return res.status(400).json({

                success:false,

                message:
                "Registration request not found"

            });

        }





        // ==========================================
        // CHECK OTP EXPIRY
        // ==========================================


        if (
            new Date() > pendingUser.otpExpiry
        ) {


            return res.status(400).json({

                success:false,

                message:
                "OTP expired"

            });


        }





        // ==========================================
        // VERIFY OTP
        // ==========================================


        if (
            pendingUser.otp !== cleanOtp
        ) {


            return res.status(400).json({

                success:false,

                message:
                "Invalid OTP"

            });


        }





        // ==========================================
        // CHECK EXISTING USER
        // ==========================================


        const existingUser =
            await User.findOne({

                $or:[

                    {
                        email:
                        pendingUser.email
                    },

                    {
                        number:
                        pendingUser.number
                    }

                ]

            });



        if(existingUser){


            await PendingRegistration.deleteOne({

                _id:
                pendingUser._id

            });


            return res.status(409).json({

                success:false,

                message:
                "User already exists"

            });


        }






        // ==========================================
        // CREATE VERIFIED USER
        // ==========================================


        const user =
            new User({

                name:
                pendingUser.name,


                email:
                pendingUser.email,


                number:
                pendingUser.number,


                password:
                pendingUser.password,


                role:
                "student",


                isVerified:
                true

            });



        await user.save();





        console.log(
            "User created:",
            user.email
        );





        // ==========================================
        // DELETE PENDING USER
        // ==========================================


        await PendingRegistration.deleteOne({

            _id:
            pendingUser._id

        });






        // ==========================================
        // GENERATE TOKEN
        // ==========================================


        const token =
            generateToken(user);






        // ==========================================
        // RESPONSE
        // ==========================================


        return res.status(201).json({

            success:true,


            message:
            "Email verified and account created successfully",


            token,


            user:{


                id:
                user._id,


                name:
                user.name,


                email:
                user.email,


                number:
                user.number,


                role:
                user.role


            }


        });



    }
    catch(error){


        console.error(
            "OTP Verification Error:",
            error
        );


        return res.status(500).json({

            success:false,

            message:
            error.message

        });


    }


};