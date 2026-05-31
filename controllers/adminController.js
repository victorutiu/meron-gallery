import prisma from "../data/prisma.js"
import Message from "../chat/chatModel.js"

export const getSuspiciousUsers = async (req, res) => {

  try {

    const observations = []

    // --------------------
    // FAILED LOGIN SPAM
    // --------------------

    const failedLogins =
      await prisma.log.groupBy({
        by:["email"],
        where:{
          action:"FAILED_LOGIN"
        },
        _count:{
          _all:true
        }
      })

    for(const entry of failedLogins){

      if(
        entry.email &&
        entry._count._all >= 5
      ){

        observations.push({
          user: entry.email,
          type:"security",
          reason:
            `Brute force attack (${entry._count._all} failed logins)`
        })
      }
    }

    // --------------------
    // LOGIN SPAM
    // --------------------

    const loginSpam =
      await prisma.log.groupBy({
        by:["userId"],
        where:{
          action:"LOGIN"
        },
        _count:{
          _all:true
        }
      })

    for(const entry of loginSpam){

      const user =
        await prisma.user.findUnique({
          where:{
            id: entry.userId
          },
          include:{
            role:true
          }
        })

      if(!user) continue
      if(user.role.name === "admin")
        continue

      if(entry._count._all > 5){

        observations.push({
          user:user.email,
          type:"login",
          reason:
            `Login spam (${entry._count._all} logins)`
        })
      }
    }

    // --------------------
    // CHAT SPAM
    // --------------------

    const chatSpam =
      await Message.aggregate([
        {
          $group:{
            _id:"$user",
            count:{
              $sum:1
            }
          }
        }
      ])

    for(const entry of chatSpam){

      if(
        entry.count > 10
      ){

        observations.push({
          user: entry._id,
          type:"chat",
          reason:
            `Chat spam (${entry.count} messages)`
        })
      }
    }

    const adminAbuse =
  await prisma.log.groupBy({
    by:["email"],
    where:{
      action:
        "ADMIN_ACCESS_DENIED"
    },
    _count:{
      _all:true
    }
  })

for(const entry of adminAbuse){

  if(
    entry._count._all >= 2
  ){

    observations.push({
      user: entry.email,
      type:"security",
      reason:
        `Admin abuse (${entry._count._all} forbidden attempts)`
    })
  }
}

    res.json(observations)

  } catch(err){

    console.error(err)

    res.status(500).json({
      message:
        "Failed to detect suspicious users"
    })
  }
}