import dotenv from "dotenv"
dotenv.config()

import {
  authenticateToken,
  checkAdmin
} from "./middleware/authMiddleware.js"

import heavyStatisticsRoutes
from "./routes/heavyStatisticsRoutes.js"

import express from "express"
import cors from "cors"

import coffeeRoutes from "./routes/coffeeRoutes.js"
import statisticsRoutes from "./routes/statisticsRoutes.js"

import { WebSocketServer } from "ws"
import { generateCoffee } from "./src/utils/fakeGenerator.js"

import { ApolloServer } from "apollo-server-express"
import { typeDefs, resolvers } from "./graphql/schema.js"

import prisma from "./data/prisma.js"

import authRoutes from "./routes/authRoutes.js"

import mongoose from "mongoose"
import Message from "./chat/chatModel.js"

import chatRoutes from "./routes/chatRoutes.js"

import adminRoutes from "./routes/adminRoutes.js"

// --------------------
// MongoDB connection
// --------------------
async function connectMongo() {

  try {

    await mongoose.connect(
      process.env.MONGO_URI
    )

    console.log(
      "MongoDB connected"
    )

  } catch (err) {

    console.error(
      "MongoDB error:",
      err
    )
  }
}

const app = express()

// --------------------
// CORS
// --------------------
app.use(cors({

  origin: [
    "https://meron-gallery.vercel.app",
    "http://localhost:5173"
  ],

  methods: [
    "GET",
    "POST",
    "PUT",
    "DELETE"
  ],

  credentials: true

}))

// --------------------
// API ROUTES
// --------------------
app.use(
  "/api/coffees",
  express.json(),
  coffeeRoutes
)

app.use(
  "/api/statistics",
  statisticsRoutes
)

app.use(
  "/api/auth",
  express.json(),
  authRoutes
)

app.use(
  "/api/chat",
  chatRoutes
)

app.use(
  "/api/admin",
  adminRoutes
)

app.use(
  "/statistics",
  heavyStatisticsRoutes
)

const PORT =
  process.env.PORT || 3000

// --------------------
// WebSocket generator
// --------------------
let wss = null
let generator = null

function broadcast(data) {

  if (!wss) return

  wss.clients.forEach(client => {

    if (client.readyState === 1) {

      client.send(
        JSON.stringify(data)
      )
    }
  })
}

// --------------------
// START GENERATOR
// --------------------
function startGenerator() {

  if (generator) return

  console.log(
    "Fake coffee generator started"
  )

  generator = setInterval(
    async () => {

      try {

        const coffee =
          generateCoffee()

        console.log(
          "Generated coffee:",
          coffee
        )

        const savedCoffee =
          await prisma.coffee.create({
            data: coffee
          })

        console.log(
          "Saved coffee:",
          savedCoffee
        )

        broadcast({
          type: "new-coffee",
          data: savedCoffee
        })

      } catch (err) {

        console.error(
          "Generator error:",
          err
        )
      }

    },
    2000
  )
}

// --------------------
// STOP GENERATOR
// --------------------
function stopGenerator() {

  if (!generator) return

  clearInterval(generator)

  generator = null

  console.log(
    "Fake coffee generator stopped"
  )
}

// --------------------
// Generator endpoints
// --------------------
app.post(
  "/generator/start",
  authenticateToken,
  checkAdmin,
  (req, res) => {

    startGenerator()

    res.json({
      message:
        "Generator started"
    })
  }
)

app.post(
  "/generator/stop",
  authenticateToken,
  checkAdmin,
  (req, res) => {

    stopGenerator()

    res.json({
      message:
        "Generator stopped"
    })
  }
)

// --------------------
// GraphQL
// --------------------
async function startGraphQL() {

  const server =
    new ApolloServer({

      typeDefs,
      resolvers,
      introspection: true
    })

  await server.start()

  server.applyMiddleware({
    app,
    path: "/graphql"
  })

  console.log(
    `GraphQL running at http://localhost:${PORT}/graphql`
  )
}

// --------------------
// Start server
// --------------------
async function startServer() {

  await connectMongo()

   await startGraphQL()

  const server = app.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log(
      `Server running on port ${PORT}`
    )
  }
)

wss = new WebSocketServer({
  server
})


  wss.on(
    "connection",
    (ws) => {

      console.log(
        "Client connected"
      )

      ws.on(
        "message",
        async (data) => {

          try {

            const parsed =
              JSON.parse(data)

            // CHAT MESSAGE
            if (
              parsed.type ===
              "chat"
            ) {

              const savedMessage =
                await Message.create({
                  user:
                    parsed.user,

                  text:
                    parsed.text
                })

              wss.clients.forEach(
                client => {

                  if (
                    client.readyState === 1
                  ) {

                    client.send(
                      JSON.stringify({
                        type:
                          "chat",

                        data:
                          savedMessage
                      })
                    )
                  }
                }
              )
            }

          } catch (err) {

            console.error(
              "WebSocket message error:",
              err
            )
          }
        }
      )

      ws.on(
        "close",
        () => {

          console.log(
            "Client disconnected"
          )
        }
      )
    }
  )

}

if (
  !process.env.VITEST
) {
  startServer()
}

export default app
