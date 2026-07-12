import StudentProfile from "../models/studentProfile.model.js";

/* =====================================================
   CREATE STUDENT PROFILE
===================================================== */

export const createStudentProfile = async (req, res) => {
  try {
    // Check whether this student already has a profile
    const existingProfile = await StudentProfile.findOne({
      user: req.user._id,
    });

    if (existingProfile) {
      return res.status(400).json({
        message: "Profile already exists",
      });
    }

    // Take only fields that student is allowed to provide
    const {
      rollNumber,
      enrollmentNumber,
      department,
      course,
      batch,
      semester,
      cgpa,
      backlogs,
      skills,
      projects,
      internships,
      certifications,
      github,
      linkedin,
      portfolio,
      resume,
    } = req.body;

    // Create profile

    if (
      !rollNumber ||
      !enrollmentNumber ||
      !department ||
      !course ||
      !batch ||
      !semester ||
      cgpa === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const profile = await StudentProfile.create({
      // Automatically taken from logged-in user
      user: req.user._id,

      rollNumber,
      enrollmentNumber,
      department,
      course,
      batch,
      semester,
      cgpa,

      backlogs: backlogs ?? 0,

      skills: skills ?? [],
      projects: projects ?? [],
      internships: internships ?? [],
      certifications: certifications ?? [],

      github: github ?? "",
      linkedin: linkedin ?? "",
      portfolio: portfolio ?? "",
      resume: {
        url: typeof resume === "string" ? resume : resume?.url || "",
        publicId: resume?.publicId || "",
      },

      // Student cannot control these values
      isPlaced: false,
      placedCompany: "",
      placedPackage: 0,

      // Calculated below
      isProfileCompleted: false,
    });

    // Check profile completion
    const requiredFields = [
      profile.rollNumber,
      profile.enrollmentNumber,
      profile.department,
      profile.course,
      profile.batch,
      profile.semester,
      profile.cgpa,
      profile.resume,
    ];

    profile.isProfileCompleted = requiredFields.every(
      (field) => field !== undefined && field !== null && field !== "",
    );

    await profile.save();

    return res.status(201).json({
      success: true,
      message: "Student profile created successfully",
      profileCompleted: profile.isProfileCompleted,
      profile,
    });
  } catch (error) {
    console.error("Create student profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating student profile",
    });
  }
};

/* =====================================================
   GET MY PROFILE
===================================================== */

export const getMyProfile = async (req, res) => {
  console.log("Logged user:", req.user._id);

  const profile = await StudentProfile.findOne({
    user: req.user._id,
  });

  console.log("Profile:", profile);
  try {
    const profile = await StudentProfile.findOne({
      user: req.user._id,
    }).populate("user", "name email number");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get My Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* =====================================================
   UPDATE PROFILE
===================================================== */

export const updateStudentProfile = async (req, res) => {
  try {
    // Fields that a student is allowed to update
    const allowedFields = [
      "rollNumber",
      "enrollmentNumber",
      "department",
      "course",
      "batch",
      "semester",
      "cgpa",
      "backlogs",
      "skills",
      "projects",
      "internships",
      "certifications",
      "github",
      "linkedin",
      "portfolio",
      "resume",
    ];

    // Create safe update object
    const safeUpdates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        safeUpdates[field] = req.body[field];
      }
    });

    const profile = await StudentProfile.findOne({
      user: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // Apply allowed updates
    Object.assign(profile, safeUpdates);

    // Automatically calculate profile completion
    const requiredFields = [
      profile.rollNumber,
      profile.enrollmentNumber,
      profile.department,
      profile.course,
      profile.batch,
      profile.semester,
      profile.cgpa,
      profile.resume,
    ];

    profile.isProfileCompleted = requiredFields.every(
      (field) => field !== undefined && field !== null && field !== "",
    );

    await profile.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profileCompleted: profile.isProfileCompleted,
      profile,
    });
  } catch (error) {
    console.error("Update student profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating profile",
    });
  }
};

/* =====================================================
   GET ALL STUDENT PROFILES
===================================================== */

export const getAllStudentProfiles = async (req, res) => {
  try {
    const students = await StudentProfile.find()
      .populate("user", "name email number")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalStudents: students.length,
      students,
    });
  } catch (error) {
    console.error("Get All Student Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* =====================================================
   GET STUDENT PROFILE BY ID
===================================================== */

export const getStudentProfileById = async (req, res) => {
  try {
    const profile = await StudentProfile.findById(req.params.id).populate(
      "user",
      "name email number",
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get Student Profile By Id Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* =====================================================
   DELETE PROFILE
===================================================== */

export const deleteStudentProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findByIdAndDelete(req.params.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    console.error("Delete Student Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
