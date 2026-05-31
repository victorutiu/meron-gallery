import express from "express"
import { register, login, verifyCode, forgotPassword, resetPassword } from "../controllers/authController.js"


const router = express.Router()

router.post(
  "/verify",
  verifyCode
)

router.post(
  "/forgot-password",
  forgotPassword
)

router.post(
  "/reset-password",
  resetPassword
)

router.post("/register", register)
router.post("/login", login)

export default router