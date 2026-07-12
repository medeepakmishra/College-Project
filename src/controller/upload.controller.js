import StudentProfile from "../models/studentProfile.model.js";

export const uploadResume = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume.",
      });
    }

    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user._id },
      {
        resume: req.file.path,
      },
      {
        new: true,
      }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      resume: profile.resume,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};