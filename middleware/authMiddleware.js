import jwt from "jsonwebtoken"

export function authenticateToken(
  req,
  res,
  next
) {

  const authHeader =
    req.headers.authorization

  const token =
    authHeader &&
    authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({
      message: "Token required"
    })
  }

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    req.user = decoded

    next()

  } catch {

    return res.status(403).json({
      message: "Invalid token"
    })
  }
}

import prisma from "../data/prisma.js"

export const checkAdmin = async (
  req,
  res,
  next
) => {

  try {

    const email =
      req.headers["user-email"]

    const user =
      await prisma.user.findFirst({
        where: {
          email
        },
        include: {
          role: true
        }
      })

    if(
      !user ||
      user.role.name !== "admin"
    ){

      // suspicious action
      await prisma.log.create({
        data: {
          userId: user?.id,
          email: email || "unknown",
          role:
            user?.role?.name ||
            "guest",
          action:
            "ADMIN_ACCESS_DENIED",
          ipAddress: req.ip
        }
      })

      return res
        .status(403)
        .json({
          message:
            "Only admins allowed"
        })
    }

    req.user = user

    next()

  } catch(err){

    console.log(err)

    return res.status(500).json({
      message:
        "Auth error"
    })
  }
}