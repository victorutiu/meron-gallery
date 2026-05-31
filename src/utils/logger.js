import prisma from "../../data/prisma.js"

export async function logAction(user, action) {
  if (!user) return

  try {
    await prisma.log.create({
      data: {
        userId: user.id,
        role: user.role,
        action
      }
    })
  } catch (err) {
    console.error("Logging error:", err)
  }
}