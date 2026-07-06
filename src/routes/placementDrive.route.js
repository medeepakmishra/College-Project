import express from "express";

import {
  createPlacementDrive,
  getAllPlacementDrives,
  getPlacementDriveById,
  updatePlacementDrive,
  deletePlacementDrive,
  getEligiblePlacementDrives,
} from "../controller/placementDrive.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

/* =====================================================
   STUDENT + ADMIN
===================================================== */

// Get all drives
router.get(
  "/",
  protect,
  authorizeRoles("student", "admin"),
  getAllPlacementDrives
);

// Student Eligible Drives
router.get(
  "/eligible",
  protect,
  authorizeRoles("student"),
  getEligiblePlacementDrives
);

// Get single drive
router.get(
  "/:id",
  protect,
  authorizeRoles("student", "admin"),
  getPlacementDriveById
);


/* =====================================================
   ADMIN ONLY
===================================================== */

// Create drive
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createPlacementDrive
);

// Update drive
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updatePlacementDrive
);

// Soft delete drive
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deletePlacementDrive
);

export default router;