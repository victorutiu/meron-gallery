import express from "express"
import {
  getOriginStats,
  getQuantityStats
} from "../controllers/statisticsController.js"

const router = express.Router()

router.get("/origins", getOriginStats)
router.get("/quantities", getQuantityStats)

export default router