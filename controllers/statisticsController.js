//import { coffees } from "../data/store.js"
import prisma from "../data/prisma.js"
//nr of coffees per origins
export const getOriginStats = async (req,res)=>{

  try {

    const coffees = await prisma.coffee.findMany()

    const result = {}

    coffees.forEach(c=>{
      if(!result[c.origin]){
        result[c.origin] = 0
      }
      result[c.origin]++
    })

    res.json(result)

  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }

}

//nr of coffees per quantity 
export const getQuantityStats = async (req,res)=>{

  try {

    const coffees = await prisma.coffee.findMany()

    const result = {}

    coffees.forEach(c=>{
      if(!result[c.quantity]){
        result[c.quantity] = 0
      }
      result[c.quantity]++
    })

    res.json(result)

  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }

}