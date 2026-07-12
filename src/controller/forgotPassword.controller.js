// import User from "../models/user.model.js";
// import { sendEmail } from "../utils/email.service.js";



// export const forgotPassword = async(req,res)=>{

// console.log("🔥 Forgot password API called");

// console.log(req.body);



// // your existing code

//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     const user = await User.findOne({ email: email.toLowerCase() });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     user.emailOTP = otp;
//     user.emailOTPExpiry = Date.now() + 10 * 60 * 1000;
//     await user.save();

//     await sendEmail.sendMail({
//       from: `"Placement Cell" <${process.env.EMAIL_USER}>`,
//       to: user.email,
//       subject: "Password Reset OTP",
//       html: `<h2>Your OTP: ${otp}</h2><p>Valid for 10 minutes</p>`,
//     });

//     res.json({
//       message: "OTP sent to email",
//     });

//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };




// export const resetPassword = async (req, res) => {
//   try {
//     const { email, otp, newPassword } = req.body;

//     if (!email || !otp || !newPassword) {
//       return res.status(400).json({
//         message: "Email, OTP and new password are required",
//       });
//     }

//     const user = await User.findOne({
//       email: email.toLowerCase(),
//       emailOTP: otp,
//       emailOTPExpiry: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(400).json({
//         message: "Invalid or expired OTP",
//       });
//     }

//     user.password = newPassword;
//     user.emailOTP = undefined;
//     user.emailOTPExpiry = undefined;

//     await user.save();

//     res.json({
//       message: "Password reset successfully",
//     });

//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };





import User from "../models/user.model.js";
import { sendEmail } from "../utils/email.service.js";



// ==========================================
// FORGOT PASSWORD
// ==========================================

export const forgotPassword = async (req, res) => {

  console.log("🔥 Forgot password API called");
  console.log(req.body);


  try {

    const { email } = req.body;


    if (!email) {

      return res.status(400).json({

        success:false,

        message:
        "Email is required"

      });

    }



    const normalizedEmail =
      email.toLowerCase().trim();



    const user =
      await User.findOne({
        email: normalizedEmail
      });



    if (!user) {

      return res.status(404).json({

        success:false,

        message:
        "User not found"

      });

    }




    // Generate OTP

    const otp =
      Math.floor(
        100000 +
        Math.random()*900000
      ).toString();



    user.emailOTP = otp;

    user.emailOTPExpiry =
      new Date(
        Date.now()+10*60*1000
      );



    await user.save();



    console.log(
      "OTP saved:",
      otp
    );





    // Send email using Brevo

    await sendEmail({

      to:user.email,


      subject:
      "Placement Portal Password Reset OTP",


      html:`

      <div style="font-family:Arial">

      <h2>
      Placement Portal
      </h2>


      <p>
      Your password reset OTP is:
      </p>


      <h1>
      ${otp}
      </h1>


      <p>
      This OTP is valid for 10 minutes.
      </p>


      </div>

      `

    });



    return res.status(200).json({

      success:true,

      message:
      "Password reset OTP sent successfully"

    });



  }
  catch(error){


    console.error(
      "Forgot Password Error:",
      error
    );


    return res.status(500).json({

      success:false,

      message:
      error.message

    });


  }

};







// ==========================================
// RESET PASSWORD
// ==========================================


export const resetPassword = async(req,res)=>{


try{


const {
email,
otp,
newPassword
}=req.body;




if(!email || !otp || !newPassword){


return res.status(400).json({

success:false,

message:
"Email, OTP and new password are required"

});


}





const normalizedEmail =
email.toLowerCase().trim();





const user =
await User.findOne({

email:normalizedEmail,

emailOTP:otp,

emailOTPExpiry:{
$gt:new Date()
}

});




if(!user){


return res.status(400).json({

success:false,

message:
"Invalid or expired OTP"

});


}





// Password validation

const passwordRegex =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;



if(!passwordRegex.test(newPassword)){


return res.status(400).json({

success:false,

message:
"Password must contain uppercase, lowercase, special character and minimum 8 characters"

});


}




// Update password

user.password =
newPassword;


// remove OTP

user.emailOTP = undefined;

user.emailOTPExpiry = undefined;



await user.save();





return res.status(200).json({

success:true,

message:
"Password reset successfully"

});




}
catch(error){


console.error(
"Reset Password Error:",
error
);



return res.status(500).json({

success:false,

message:
error.message

});


}


};