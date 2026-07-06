import express from "express";

import {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controller/announcement.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

/* ===============================
   STUDENT + ADMIN
================================ */

router.get(
  "/",
  protect,
  authorizeRoles("student", "admin"),
  getAllAnnouncements
);

router.get(
  "/:id",
  protect,
  authorizeRoles("student", "admin"),
  getAnnouncementById
);

/* ===============================
   ADMIN ONLY
================================ */

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createAnnouncement
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateAnnouncement
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteAnnouncement
);

export default router;