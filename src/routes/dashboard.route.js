import express from "express";

import {
  getStudentDashboard,
  getAdminDashboard,
} from "../controller/dashboard.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();


/* =====================================================
   STUDENT DASHBOARD
===================================================== */

router.get(
  "/student",
  protect,
  authorizeRoles("student"),
  getStudentDashboard
);


/* =====================================================
   ADMIN DASHBOARD
===================================================== */

router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  getAdminDashboard
);


export default router;