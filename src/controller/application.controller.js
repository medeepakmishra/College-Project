import Application from "../models/application.model.js";
import StudentProfile from "../models/studentProfile.model.js";
import PlacementDrive from "../models/placementDrive.model.js";


/* =====================================================
   APPLY TO PLACEMENT DRIVE - STUDENT
===================================================== */

export const applyToDrive = async (req, res) => {
  try {
    const { driveId } = req.body;

    if (!driveId) {
      return res.status(400).json({
        success: false,
        message: "Drive ID is required",
      });
    }

    // Find student profile
    const studentProfile = await StudentProfile.findOne({
      user: req.user._id,
    });

    if (!studentProfile) {
      return res.status(404).json({
        success: false,
        message: "Please create your student profile before applying",
      });
    }

    // Check profile completion
    if (!studentProfile.isProfileCompleted) {
      return res.status(400).json({
        success: false,
        message: "Please complete your profile before applying",
      });
    }

    // Find drive
    const drive = await PlacementDrive.findOne({
      _id: driveId,
      isActive: true,
    });

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: "Placement drive not found",
      });
    }

    // Check drive status
    if (drive.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "This placement drive is not open for applications",
      });
    }

    // Check deadline
    if (new Date() > new Date(drive.applicationDeadline)) {
      return res.status(400).json({
        success: false,
        message: "Application deadline has passed",
      });
    }

    // Check duplicate application
    const existingApplication = await Application.findOne({
      student: studentProfile._id,
      drive: drive._id,
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this placement drive",
      });
    }

    // CGPA eligibility
    if (studentProfile.cgpa < drive.minCGPA) {
      return res.status(403).json({
        success: false,
        message: `Minimum CGPA required is ${drive.minCGPA}`,
      });
    }

    // Department eligibility
    if (
      !drive.eligibleDepartments.includes(
        studentProfile.department
      )
    ) {
      return res.status(403).json({
        success: false,
        message: "Your department is not eligible for this drive",
      });
    }

    // Batch eligibility
    if (
      !drive.eligibleBatches.includes(studentProfile.batch)
    ) {
      return res.status(403).json({
        success: false,
        message: "Your batch is not eligible for this drive",
      });
    }

    // Backlog eligibility
    if (studentProfile.backlogs > drive.maxBacklogs) {
      return res.status(403).json({
        success: false,
        message: `Maximum ${drive.maxBacklogs} backlog(s) allowed`,
      });
    }

    // Create application
    const application = await Application.create({
      student: studentProfile._id,
      drive: drive._id,
    });

    const populatedApplication = await Application.findById(
      application._id
    )
      .populate({
        path: "student",
        populate: {
          path: "user",
          select: "name email number",
        },
      })
      .populate({
        path: "drive",
        populate: {
          path: "company",
          select: "companyName logo",
        },
      });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application: populatedApplication,
    });
  } catch (error) {
    console.error("Apply to drive error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this drive",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while submitting application",
    });
  }
};


/* =====================================================
   GET MY APPLICATIONS - STUDENT
===================================================== */

export const getMyApplications = async (req, res) => {
  try {
    const studentProfile = await StudentProfile.findOne({
      user: req.user._id,
    });

    if (!studentProfile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    const applications = await Application.find({
      student: studentProfile._id,
    })
      .populate({
        path: "drive",
        populate: {
          path: "company",
          select: "companyName website logo",
        },
      })
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      totalApplications: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get my applications error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching applications",
    });
  }
};


/* =====================================================
   GET ALL APPLICATIONS - ADMIN
===================================================== */

export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate({
        path: "student",
        populate: {
          path: "user",
          select: "name email number",
        },
      })
      .populate({
        path: "drive",
        populate: {
          path: "company",
          select: "companyName logo",
        },
      })
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      totalApplications: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get applications error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching applications",
    });
  }
};


/* =====================================================
   GET APPLICATIONS FOR ONE DRIVE - ADMIN
===================================================== */

export const getApplicationsByDrive = async (req, res) => {
  try {
    const applications = await Application.find({
      drive: req.params.driveId,
    })
      .populate({
        path: "student",
        populate: {
          path: "user",
          select: "name email number",
        },
      })
      .populate("drive", "title jobRole status");

    return res.status(200).json({
      success: true,
      totalApplications: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get drive applications error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching drive applications",
    });
  }
};


/* =====================================================
   UPDATE APPLICATION STATUS - ADMIN
===================================================== */

export const updateApplicationStatus = async (req, res) => {
  try {
    const {
      status,
      interviewDate,
      interviewVenue,
      adminRemark,
    } = req.body;

    const allowedStatuses = [
      "applied",
      "shortlisted",
      "interview",
      "selected",
      "rejected",
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status",
      });
    }

    const application = await Application.findById(
      req.params.id
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    application.status = status;

    if (interviewDate !== undefined) {
      application.interviewDate = interviewDate;
    }

    if (interviewVenue !== undefined) {
      application.interviewVenue = interviewVenue;
    }

    if (adminRemark !== undefined) {
      application.adminRemark = adminRemark;
    }

    await application.save();

    // If selected, mark student as placed
    if (status === "selected") {
      const drive = await PlacementDrive.findById(
        application.drive
      ).populate("company", "companyName");

      if (drive) {
        await StudentProfile.findByIdAndUpdate(
          application.student,
          {
            isPlaced: true,
            placedCompany:
              drive.company?.companyName || "",
            placedPackage: drive.ctc,
          }
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    console.error("Update application error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating application",
    });
  }
};