//import { coffees } from "../data/store.js"
import prisma from "../data/prisma.js"

//paginated list of coffee
export const getCoffees = async (req, res) => {

  try {

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 6

    const { origin, quantity } = req.query

    const data = await prisma.coffee.findMany({
      where: {
        ...(origin && { origin }),
        ...(quantity && { quantity })
      },
      skip: (page - 1) * limit,
      take: limit
    })

    const total = await prisma.coffee.count({
      where: {
        ...(origin && { origin }),
        ...(quantity && { quantity })
      }
    })

    res.json({
      page,
      limit,
      total,
      data
    })

  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }

}

export const getCoffeeById = async (req, res) => {

  try {

    const id = parseInt(req.params.id)

    const coffee = await prisma.coffee.findUnique({
      where: { id }
    })

    if (!coffee) {
      return res.status(404).json({ message: "Coffee not found" })
    }

    res.json(coffee)

  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }

}

export const createCoffee = async (req, res) => {

  try {

    const { name, origin, process, price, quantity, status } = req.body

    if (!name || !origin || !process || !price || !quantity || !status) {
      return res.status(400).json({ message: "All fields required" })
    }

    const coffee = await prisma.coffee.create({
      data: {
        name,
        origin,
        process,
        price,
        quantity,
        status
      }
    })

    res.status(201).json(coffee)

  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }

}


export const updateCoffee = async (req, res) => {

  try {

    const id = parseInt(req.params.id)

    // FIRST check if exists
    const existing = await prisma.coffee.findUnique({
      where: { id }
    })

    if (!existing) {
      return res.status(404).json({ message: "Coffee not found" })
    }

    const coffee = await prisma.coffee.update({
      where: { id },
      data: req.body
    })

    res.json(coffee)

  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }

}

export const deleteCoffee = async (req, res) => {

  try {

    const id = parseInt(req.params.id)

    // FIRST check if exists
    const existing = await prisma.coffee.findUnique({
      where: { id }
    })

    if (!existing) {
      return res.status(404).json({ message: "Coffee not found" })
    }

    await prisma.coffee.delete({
      where: { id }
    })

    res.json({ message: "Coffee deleted" })

  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }

}