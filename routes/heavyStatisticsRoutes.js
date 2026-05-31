import express
from "express"

import {
  getHeavyStatistics
}
from "../controllers/heavyStatisticsController.js"

const router =
  express.Router()

router.get(
  "/heavy",
  getHeavyStatistics
)

export default
router