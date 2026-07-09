// import express from "express";

// import {
//   createStudentProfile,
//   getMyProfile,
//   updateStudentProfile,
//   getAllStudentProfiles,
//   getStudentProfileById,
//   deleteStudentProfile,
// } from "../controller/studentProfile.controller.js";

// import { protect } from "../middleware/auth.middleware.js";
// import { authorizeRoles } from "../middleware/role.middleware.js";

// const router = express.Router();

// /* ===========================================
//    STUDENT ROUTES
// =========================================== */

// // Create Profile
// router.post(
//   "/",
//   protect,
//   authorizeRoles("student"),
//   createStudentProfile
// );

// // Get Logged In Student Profile
// router.get(
//   "/me",
//   protect,
//   authorizeRoles("student"),
//   getMyProfile
// );

// // Update Profile
// router.put(
//   "/",
//   protect,
//   authorizeRoles("student"),
//   updateStudentProfile
// );

// /* ===========================================
//    ADMIN ROUTES
// =========================================== */

// // Get All Students
// router.get(
//   "/all",
//   protect,
//   authorizeRoles("admin"),
//   getAllStudentProfiles
// );

// // Get Student By Id
// router.get(
//   "/:id",
//   protect,
//   authorizeRoles("admin"),
//   getStudentProfileById
// );

// // Delete Student
// router.delete(
//   "/:id",
//   protect,
//   authorizeRoles("admin"),
//   deleteStudentProfile
// );

// export default router;










import express from "express";

import {
  createStudentProfile,
  getMyProfile,
  updateStudentProfile,
  getAllStudentProfiles,
  getStudentProfileById,
  deleteStudentProfile,
} from "../controller/studentProfile.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();


/* ===========================================
   STUDENT ROUTES
=========================================== */


// Create Student Profile
// POST /api/profile

router.post(
  "/",
  protect,
  authorizeRoles("student"),
  createStudentProfile
);


// Get Logged-in Student Profile
// GET /api/profile/me

router.get(
  "/me",
  protect,
  authorizeRoles("student"),
  getMyProfile
);


// Update Logged-in Student Profile
// PUT /api/profile

router.put(
  "/",
  protect,
  authorizeRoles("student"),
  updateStudentProfile
);



/* ===========================================
   ADMIN ROUTES
=========================================== */


// Get All Student Profiles
// GET /api/profile/all

router.get(
  "/all",
  protect,
  authorizeRoles("admin"),
  getAllStudentProfiles
);


// Get Student Profile By ID
// GET /api/profile/:id

router.get(
  "/:id",
  protect,
  authorizeRoles("admin"),
  getStudentProfileById
);


// Delete Student Profile
// DELETE /api/profile/:id

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteStudentProfile
);


export default router;