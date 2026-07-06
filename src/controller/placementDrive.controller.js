import PlacementDrive from "../models/placementDrive.model.js";
import Company from "../models/company.model.js";

/* =====================================================
   CREATE PLACEMENT DRIVE - ADMIN
===================================================== */

export const createPlacementDrive = async (req, res) => {
  try {
    const {
      company,
      title,
      jobRole,
      jobType,
      ctc,
      internshipStipend,
      jobLocation,
      description,
      minCGPA,
      maxBacklogs,
      eligibleDepartments,
      eligibleBatches,
      applicationDeadline,
      driveDate,
      venue,
      driveMode,
      status,
    } = req.body;

    if (
      !company ||
      !title ||
      !jobRole ||
      !jobType ||
      ctc === undefined ||
      !jobLocation ||
      minCGPA === undefined ||
      !eligibleDepartments ||
      !eligibleBatches ||
      !applicationDeadline ||
      !driveDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Required placement drive fields are missing",
      });
    }

    // Check company exists and is active
    const companyExists = await Company.findOne({
      _id: company,
      isActive: true,
    });

    if (!companyExists) {
      return res.status(404).json({
        success: false,
        message: "Company not found or inactive",
      });
    }

    // Basic date validation
    if (new Date(applicationDeadline) >= new Date(driveDate)) {
      return res.status(400).json({
        success: false,
        message: "Application deadline must be before drive date",
      });
    }

    const drive = await PlacementDrive.create({
      company,
      title,
      jobRole,
      jobType,
      ctc,
      internshipStipend,
      jobLocation,
      description,
      minCGPA,
      maxBacklogs,
      eligibleDepartments,
      eligibleBatches,
      applicationDeadline,
      driveDate,
      venue,
      driveMode,
      status,
      createdBy: req.user._id,
    });

    const populatedDrive = await PlacementDrive.findById(
      drive._id
    ).populate("company", "companyName website logo");

    res.status(201).json({
      success: true,
      message: "Placement drive created successfully",
      drive: populatedDrive,
    });
  } catch (error) {
    console.error("Create drive error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while creating placement drive",
    });
  }
};


/* =====================================================
   GET ALL ACTIVE DRIVES - STUDENT + ADMIN
===================================================== */

export const getAllPlacementDrives = async (req, res) => {
  try {
    const drives = await PlacementDrive.find({
      isActive: true,
    })
      .populate("company", "companyName website logo")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalDrives: drives.length,
      drives,
    });
  } catch (error) {
    console.error("Get drives error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching placement drives",
    });
  }
};


/* =====================================================
   GET DRIVE BY ID - STUDENT + ADMIN
===================================================== */

export const getPlacementDriveById = async (req, res) => {
  try {
    const drive = await PlacementDrive.findOne({
      _id: req.params.id,
      isActive: true,
    })
      .populate("company", "companyName website logo description")
      .populate("createdBy", "name email");

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: "Placement drive not found",
      });
    }

    res.status(200).json({
      success: true,
      drive,
    });
  } catch (error) {
    console.error("Get drive error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching placement drive",
    });
  }
};


/* =====================================================
   UPDATE DRIVE - ADMIN
===================================================== */

export const updatePlacementDrive = async (req, res) => {
  try {
    // Prevent changing ownership
    delete req.body.createdBy;

    if (
      req.body.applicationDeadline &&
      req.body.driveDate &&
      new Date(req.body.applicationDeadline) >=
        new Date(req.body.driveDate)
    ) {
      return res.status(400).json({
        success: false,
        message: "Application deadline must be before drive date",
      });
    }

    const drive = await PlacementDrive.findOneAndUpdate(
      {
        _id: req.params.id,
        isActive: true,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("company", "companyName website logo");

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: "Placement drive not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Placement drive updated successfully",
      drive,
    });
  } catch (error) {
    console.error("Update drive error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while updating placement drive",
    });
  }
};


/* =====================================================
   SOFT DELETE DRIVE - ADMIN
===================================================== */

export const deletePlacementDrive = async (req, res) => {
  try {
    const drive = await PlacementDrive.findById(req.params.id);

    if (!drive || !drive.isActive) {
      return res.status(404).json({
        success: false,
        message: "Placement drive not found",
      });
    }

    drive.isActive = false;

    await drive.save();

    res.status(200).json({
      success: true,
      message: "Placement drive deleted successfully",
    });
  } catch (error) {
    console.error("Delete drive error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while deleting placement drive",
    });
  }
};  


/* =====================================================
   GET ELIGIBLE PLACEMENT DRIVES (STUDENT)
===================================================== */

import StudentProfile from "../models/studentProfile.model.js";

export const getEligiblePlacementDrives = async (req, res) => {
  try {

    // Get logged-in student's profile
    const student = await StudentProfile.findOne({
      user: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    if (!student.isProfileCompleted) {
      return res.status(400).json({
        success: false,
        message: "Complete your profile first",
      });
    }

    // Get all active & open drives
    const drives = await PlacementDrive.find({
      isActive: true,
      status: "open",
      applicationDeadline: {
        $gte: new Date(),
      },
    }).populate("company", "companyName logo");

    // Filter eligible drives
    const eligibleDrives = drives.filter((drive) => {

      const cgpaEligible =
        student.cgpa >= drive.minCGPA;

      const departmentEligible =
        drive.eligibleDepartments.includes(
          student.department
        );

      const batchEligible =
        drive.eligibleBatches.includes(
          student.batch
        );

      const backlogEligible =
        student.backlogs <= drive.maxBacklogs;

      return (
        cgpaEligible &&
        departmentEligible &&
        batchEligible &&
        backlogEligible
      );
    });

    return res.status(200).json({
      success: true,
      totalEligibleDrives: eligibleDrives.length,
      drives: eligibleDrives,
    });

  } catch (error) {

    console.error("Eligible Drives Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};