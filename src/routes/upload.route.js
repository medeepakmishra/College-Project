import express from "express";

import { protect } from "../middleware/auth.middleware.js";

import upload from "../middleware/upload.middleware.js";

import { uploadResume } from "../controller/upload.controller.js";

const router = express.Router();

router.post(
  "/resume",
  protect,
  upload.single("resume"),
  uploadResume
);

export default router;