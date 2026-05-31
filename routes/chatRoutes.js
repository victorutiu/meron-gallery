import express from "express"
import Message from "../chat/chatModel.js"

const router = express.Router()

router.get("/messages", async (req, res) => {
  const messages = await Message.find().sort({ createdAt: 1 })
  res.json(messages)
})

export default router