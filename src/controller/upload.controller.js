// import StudentProfile from "../models/studentProfile.model.js";

// export const uploadResume = async (req, res) => {
//   console.log("USER:", req.user);

//   console.log("FILE:", req.file);
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "Please upload a resume.",
//       });
//     }

//     const profile = await StudentProfile.findOneAndUpdate(
//       { user: req.user._id },
//       {
//         resume: req.file.path,
//       },
//       {
//         new: true,
//       },
//     );

//     if (!profile) {
//       return res.status(404).json({
//         success: false,
//         message: "Student profile not found",
//       });
//     }
    

//     return res.status(200).json({
//  "success":true,
//  "message":"Resume uploaded successfully",
//  "resume":{
//     "url":result.secure_url,
//     "publicId":result.public_id
//  }
// });
//   } catch (error) {
//     console.error(error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


import StudentProfile from "../models/studentProfile.model.js";


export const uploadResume = async (req,res)=>{

    try {


        console.log("USER:", req.user);

        console.log("FILE:", req.file);



        if(!req.file){

            return res.status(400).json({

                success:false,
                message:"Please upload resume"

            });

        }



        const profile = await StudentProfile.findOne({

            user:req.user._id

        });



        if(!profile){

            return res.status(404).json({

                success:false,
                message:"Student profile not found"

            });

        }



        // Cloudinary data from multer

        profile.resume = {

            url:req.file.path,

            publicId:req.file.filename

        };



        await profile.save();



        return res.status(200).json({

            success:true,

            message:"Resume uploaded successfully",

            resume:profile.resume

        });



    }
    catch(error){

        console.error(
            "Resume Upload Error:",
            error
        );


        return res.status(500).json({

            success:false,

            message:"Resume upload failed"

        });

    }

};