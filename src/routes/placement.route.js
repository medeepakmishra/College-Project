import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
  "/create-drive",
  protect,
  authorizeRoles("teacher"),
  (req, res) => {
    res.json({ message: "Placement drive created by teacher" });
  }
);

export default router;
