import User from "../models/user.model.js";
import StudentProfile from "../models/studentProfile.model.js";
import Company from "../models/company.model.js";
import PlacementDrive from "../models/placementDrive.model.js";
import Application from "../models/application.model.js";


/* =====================================================
   STUDENT DASHBOARD
===================================================== */

export const getStudentDashboard = async (req, res) => {
  try {
    // Find logged-in student's profile
    const profile = await StudentProfile.findOne({
      user: req.user._id,
    });

    // User may have logged in but not created profile yet
    if (!profile) {
      return res.status(200).json({
        success: true,
        profileCompleted: false,
        message: "Complete your profile to apply for placement drives",
        stats: {
          totalApplications: 0,
          shortlisted: 0,
          interviews: 0,
          selected: 0,
          rejected: 0,
        },
      });
    }

    // Get student's applications
    const applications = await Application.find({
      student: profile._id,
    })
      .populate({
        path: "drive",
        populate: {
          path: "company",
          select: "companyName logo",
        },
      })
      .sort({ createdAt: -1 });

    // Calculate statistics
    const totalApplications = applications.length;

    const shortlisted = applications.filter(
      (application) => application.status === "shortlisted"
    ).length;

    const interviews = applications.filter(
      (application) => application.status === "interview"
    ).length;

    const selected = applications.filter(
      (application) => application.status === "selected"
    ).length;

    const rejected = applications.filter(
      (application) => application.status === "rejected"
    ).length;

    // Get currently open placement drives
    const openDrives = await PlacementDrive.countDocuments({
      isActive: true,
      status: "open",
      applicationDeadline: {
        $gte: new Date(),
      },
    });

    return res.status(200).json({
      success: true,

      profileCompleted: profile.isProfileCompleted,

      placementStatus: {
        isPlaced: profile.isPlaced,
        placedCompany: profile.placedCompany,
        placedPackage: profile.placedPackage,
      },

      stats: {
        totalApplications,
        shortlisted,
        interviews,
        selected,
        rejected,
        openDrives,
      },

      recentApplications: applications.slice(0, 5),
    });
  } catch (error) {
    console.error("Student dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while loading student dashboard",
    });
  }
};


/* =====================================================
   ADMIN DASHBOARD
===================================================== */

export const getAdminDashboard = async (req, res) => {
  try {
    // Basic counts
    const [
      totalStudents,
      totalCompanies,
      totalDrives,
      totalApplications,
      selectedApplications,
      openDrives,
    ] = await Promise.all([
      User.countDocuments({
        role: "student",
      }),

      Company.countDocuments({
        isActive: true,
      }),

      PlacementDrive.countDocuments({
        isActive: true,
      }),

      Application.countDocuments(),

      Application.countDocuments({
        status: "selected",
      }),

      PlacementDrive.countDocuments({
        isActive: true,
        status: "open",
        applicationDeadline: {
          $gte: new Date(),
        },
      }),
    ]);

    // Number of unique placed students
    const totalPlacedStudents =
      await StudentProfile.countDocuments({
        isPlaced: true,
      });

    // Placement percentage
    const placementPercentage =
      totalStudents > 0
        ? Number(
            (
              (totalPlacedStudents / totalStudents) *
              100
            ).toFixed(2)
          )
        : 0;

    // Package statistics
    const packageStats = await StudentProfile.aggregate([
      {
        $match: {
          isPlaced: true,
          placedPackage: {
            $gt: 0,
          },
        },
      },

      {
        $group: {
          _id: null,
          highestPackage: {
            $max: "$placedPackage",
          },
          averagePackage: {
            $avg: "$placedPackage",
          },
        },
      },
    ]);

    const highestPackage =
      packageStats.length > 0
        ? packageStats[0].highestPackage
        : 0;

    const averagePackage =
      packageStats.length > 0
        ? Number(packageStats[0].averagePackage.toFixed(2))
        : 0;

    // Application status breakdown
    const applicationStatusStats =
      await Application.aggregate([
        {
          $group: {
            _id: "$status",
            count: {
              $sum: 1,
            },
          },
        },
      ]);

    // Recent applications
    const recentApplications = await Application.find()
      .populate({
        path: "student",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .populate({
        path: "drive",
        populate: {
          path: "company",
          select: "companyName",
        },
      })
      .sort({
        createdAt: -1,
      })
      .limit(5);

    // Upcoming drives
    const upcomingDrives = await PlacementDrive.find({
      isActive: true,
      driveDate: {
        $gte: new Date(),
      },
    })
      .populate(
        "company",
        "companyName logo"
      )
      .sort({
        driveDate: 1,
      })
      .limit(5);

    return res.status(200).json({
      success: true,

      overview: {
        totalStudents,
        totalCompanies,
        totalDrives,
        openDrives,
        totalApplications,
        selectedApplications,
        totalPlacedStudents,
        placementPercentage,
        highestPackage,
        averagePackage,
      },

      applicationStatusStats,

      recentApplications,

      upcomingDrives,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while loading admin dashboard",
    });
  }
};