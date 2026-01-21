import express from "express";
import { registerUser } from "../controller/auth.controller.js";
import { loginUser } from "../controller/login.controller.js";

const router = express.Router();

// registration route
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;





