import dotenv from "dotenv"

// 🔥 FORCE ENV BEFORE ANYTHING
if (process.env.NODE_ENV === "test" || process.env.VITEST) {
  dotenv.config({ path: ".env.test", override: true })
} else {
  dotenv.config()
}

import { PrismaClient } from "@prisma/client"

console.log("Using DB:", process.env.DATABASE_URL)

const prisma = new PrismaClient()

export default prisma