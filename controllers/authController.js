import prisma from "../data/prisma.js"
import { logAction } from "../src/utils/logger.js"

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import { sendCodeEmail }
from "../src/services/mailer.js"

import {
  sendResetEmail
} from "../src/services/mailer.js"
// ----------------------
// REGISTER
// ----------------------

export const register = async (req, res) => {
  try {

    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: "Missing fields"
      })
    }

    // role assignment
    const roleName =
      email.includes("@merongallery.com")
        ? "admin"
        : "user"

    const role = await prisma.role.findUnique({
      where: { name: roleName }
    })

    if (!role) {
      return res.status(500).json({
        message: "Role not found"
      })
    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        roleId: role.id
      },
      include: {
        role: true
      }
    })

    res.status(201).json({
      message: "User registered successfully"
    })

  } catch (err) {

    console.error(err)

    if (err.code === "P2002") {
      return res.status(400).json({
        message: "Email already exists"
      })
    }

    res.status(500).json({
      message: "Server error"
    })
  }
}

// ----------------------
// LOGIN
// ----------------------
export const login = async (
  req,
  res
) => {

  try {

    const {
      email,
      password
    } = req.body

    const user =
      await prisma.user.findFirst({
        where: { email },

        include: {
          role: true
        }
      })

    if (!user) {

      await prisma.log.create({
      data: {
        email,
        role: "guest",
        action: "FAILED_LOGIN",
        ipAddress: req.ip
      }
    })
      return res.status(401).json({
        message:
          "Invalid credentials"
      })
    }

    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      )

    if (!validPassword) {

      await prisma.log.create({
    data: {
      email,
      role: "guest",
      action: "FAILED_LOGIN",
      ipAddress: req.ip
    }
  })
  
      return res.status(401).json({
        message:
          "Invalid credentials"
      })
    }

    // generate 6 digit code
    const code =
      Math.floor(
        100000 +
        Math.random() * 900000
      ).toString()

    // expires in 10 min
    const expiry =
      new Date(
        Date.now() +
        10 * 60 * 1000
      )

    await prisma.user.update({

      where: {
        id: user.id
      },

      data: {
        verificationCode:
          code,

        verificationExpiry:
          expiry
      }
    })

    // send email
    await sendCodeEmail(
      user.email,
      code
    )

    res.json({

      message:
        "Verification code sent",

      requiresVerification:
        true,

      email: user.email
    })

  } catch (err) {

    console.error(err)

    res.status(500).json({
      message:
        "Server error"
    })
  }
}


export const verifyCode =
async (req, res) => {

  try {

    const {
      email,
      code
    } = req.body

    const user =
      await prisma.user.findFirst({

        where: {
          email
        },

        include: {
          role: true
        }
      })

    if (
      !user ||
      user.verificationCode
        !== code
    ) {
      return res.status(400).json({
        message:
          "Invalid code"
      })
    }

    if (
      new Date() >
      user.verificationExpiry
    ) {
      return res.status(400).json({
        message:
          "Code expired"
      })
    }

    const token =
      jwt.sign(
        {
          id: user.id,
          email: user.email,
          role:
            user.role.name
        },

        process.env.JWT_SECRET,

        {
          expiresIn:
            process.env
              .JWT_EXPIRES_IN
        }
      )

    await prisma.user.update({

      where: {
        id: user.id
      },

      data: {
        verificationCode:
          null,

        verificationExpiry:
          null
      }
    })

    res.json({

      token,

      user: {
        id: user.id,
        email: user.email,
        role:
          user.role.name
      }
    })

  } catch (err) {

    console.error(err)

    res.status(500).json({
      message:
        "Verification failed"
    })
  }
}

export const forgotPassword =
async (req, res) => {

  try {

    const { email } =
      req.body

    const user =
      await prisma.user.findUnique({
        where: { email }
      })

    if(!user){
      return res.status(404).json({
        message:
          "User not found"
      })
    }

    const code =
      Math.floor(
        100000 +
        Math.random() *
        900000
      ).toString()

    const expiry =
      new Date(
        Date.now() +
        10 * 60 * 1000
      )

    await prisma.user.update({

      where: {
        id: user.id
      },

      data: {
        resetCode:
          code,

        resetCodeExpiry:
          expiry
      }
    })

    await sendResetEmail(
      user.email,
      code
    )

    res.json({
      message:
        "Reset code sent"
    })

  } catch(err){

    console.error(err)

    res.status(500).json({
      message:
        "Server error"
    })
  }
}


export const resetPassword =
async (req, res) => {

  try {

    const {
      email,
      code,
      newPassword
    } = req.body

    const user =
      await prisma.user.findUnique({

        where: {
          email
        }
      })

    if(
      !user ||
      user.resetCode
        !== code
    ){
      return res.status(400).json({
        message:
          "Invalid code"
      })
    }

    if(
      new Date() >
      user.resetCodeExpiry
    ){
      return res.status(400).json({
        message:
          "Code expired"
      })
    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      )

    await prisma.user.update({

      where: {
        id: user.id
      },

      data: {

        password:
          hashedPassword,

        resetCode:
          null,

        resetCodeExpiry:
          null
      }
    })

    res.json({
      message:
        "Password reset successful"
    })

  } catch(err){

    console.error(err)

    res.status(500).json({
      message:
        "Reset failed"
    })
  }
}