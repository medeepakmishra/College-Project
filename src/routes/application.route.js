import express from "express";

import {
  applyToDrive,
  getMyApplications,
  getAllApplications,
  getApplicationsByDrive,
  updateApplicationStatus,
} from "../controller/application.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();


/* =====================================================
   STUDENT ROUTES
===================================================== */

// Apply to placement drive
router.post(
  "/apply",
  protect,
  authorizeRoles("student"),
  applyToDrive
);

// Get logged-in student's applications
router.get(
  "/my-applications",
  protect,
  authorizeRoles("student"),
  getMyApplications
);


/* =====================================================
   ADMIN ROUTES
===================================================== */

// Get all applications
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllApplications
);

// Get applications of one placement drive
router.get(
  "/drive/:driveId",
  protect,
  authorizeRoles("admin"),
  getApplicationsByDrive
);

// Update application status
router.put(
  "/:id/status",
  protect,
  authorizeRoles("admin"),
  updateApplicationStatus
);

export default router;