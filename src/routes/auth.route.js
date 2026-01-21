import express from "express";
import { registerUser } from "../controller/auth.controller.js";

const router = express.Router();

// registration route
router.post("/register", registerUser);

export default router;
