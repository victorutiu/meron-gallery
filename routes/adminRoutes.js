import express from "express"
import {
  getSuspiciousUsers
} from "../controllers/adminController.js"

import {
  authenticateToken,
  checkAdmin
} from "../middleware/authMiddleware.js"

const router = express.Router()

router.get(
  "/suspicious",
  authenticateToken,
  checkAdmin,
  getSuspiciousUsers
)

export default router