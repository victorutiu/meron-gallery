import prisma
from "../data/prisma.js"

export async function
getHeavyStatistics(
  req,
  res
){

  try {

    const start =
      performance.now()

    const coffees =
      await prisma.coffee.findMany({

        include: {
          reviews: {
            include: {
              user: true
            }
          }
        }
      })

    const statistics =
      coffees.map(
        coffee => {

          const reviews =
            coffee.reviews

          const totalRating =
            reviews.reduce(
              (sum, r) =>
                sum + r.rating,
              0
            )

          const avgRating =
            reviews.length
              ? totalRating /
                reviews.length
              : 0

          const uniqueUsers =
            new Set(
              reviews.map(
                r => r.userId
              )
            ).size

          return {

            coffee:
              coffee.name,

            origin:
              coffee.origin,

            reviewCount:
              reviews.length,

            averageRating:
              avgRating
                .toFixed(2),

            uniqueUsers
          }
        }
      )

    // expensive sort
    statistics.sort(
      (a, b) =>
        b.reviewCount -
        a.reviewCount
    )

    const end =
      performance.now()

    res.json({

      executionTime:
        `${(
          end - start
        ).toFixed(2)} ms`,

      data:
        statistics
    })

  } catch(err){

    console.error(err)

    res.status(500).json({
      message:
        "Heavy statistics failed"
    })
  }
}

/*
import prisma
from "../data/prisma.js"

import NodeCache
from "node-cache"

const cache =
  new NodeCache({
    stdTTL: 60
  })

export async function
getHeavyStatistics(
  req,
  res
){

  try {

    const cached =
      cache.get(
        "heavy_stats"
      )

    if(cached){

      return res.json({
        cached:true,
        ...cached
      })
    }

    const start =
      performance.now()

    const stats =
      await prisma.review.groupBy({

        by:["coffeeId"],

        _avg:{
          rating:true
        },

        _count:{
          id:true,
          userId:true
        }
      })

    const coffeeIds =
      stats.map(
        s => s.coffeeId
      )

    const coffees =
      await prisma.coffee.findMany({

        where:{
          id:{
            in: coffeeIds
          }
        },

        select:{
          id:true,
          name:true,
          origin:true
        }
      })

    const coffeeMap =
      {}

    coffees.forEach(c => {
      coffeeMap[c.id] = c
    })

    const result =
      stats.map(stat => ({

        coffee:
          coffeeMap[
            stat.coffeeId
          ]?.name,

        origin:
          coffeeMap[
            stat.coffeeId
          ]?.origin,

        reviewCount:
          stat._count.id,

        averageRating:
          stat._avg.rating
            ?.toFixed(2),

        uniqueUsers:
          stat._count.userId
      }))

    result.sort(
      (a,b)=>
        b.reviewCount -
        a.reviewCount
    )

    const end =
      performance.now()

    const response = {

        cached:false,

        executionTime:
            `${(
            end - start
            ).toFixed(2)} ms`,

        data: result
        }

    cache.set(
      "heavy_stats",
      response
    )

    res.json(response)

  } catch(err){

    console.error(err)

    res.status(500).json({
      message:
        "Heavy statistics failed"
    })
  }
}
  */