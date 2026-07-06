import express from "express";

import {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from "../controller/company.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

/* =====================================================
   ADMIN ROUTES
===================================================== */

// Create Company
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createCompany
);

// Update Company
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateCompany
);

// Soft Delete Company
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteCompany
);

/* =====================================================
   STUDENT + ADMIN ROUTES
===================================================== */

// Get All Companies
router.get(
  "/",
  protect,
  authorizeRoles("student", "admin"),
  getAllCompanies
);

// Get Company By ID
router.get(
  "/:id",
  protect,
  authorizeRoles("student", "admin"),
  getCompanyById
);

export default router;