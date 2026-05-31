import express from "express"

import {
  getCoffees,
  getCoffeeById,
  createCoffee,
  updateCoffee,
  deleteCoffee
} from "../controllers/coffeeController.js"

import {
  authenticateToken,
  checkAdmin
} from "../middleware/authMiddleware.js"

const router = express.Router()

// PUBLIC ROUTES
router.get("/", getCoffees)
router.get("/:id", getCoffeeById)

// ADMIN ONLY ROUTES
router.post(
  "/",
  authenticateToken,
  checkAdmin,
  createCoffee
)

router.put(
  "/:id",
  authenticateToken,
  checkAdmin,
  updateCoffee
)

router.delete(
  "/:id",
  authenticateToken,
  checkAdmin,
  deleteCoffee
)

export default router