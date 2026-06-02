import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/ChatPage.css"

function ChatPage(){

  const [messages, setMessages] =
    useState([])

  const [text, setText] =
    useState("")

  const [socket, setSocket] =
    useState(null)

  const navigate =
    useNavigate()

  const user =
    JSON.parse(
      localStorage.getItem("user")
    )

  const API =
    import.meta.env.PROD
      ? "https://meron-gallery-api.onrender.com"
      : "http://localhost:3000"

  const WS_URL =
    import.meta.env.PROD
      ? "wss://meron-gallery-api.onrender.com"
      : "ws://localhost:8080"

  useEffect(() => {

    if(!user){
      navigate("/login")
    }

  }, [])

  useEffect(() => {

    const ws =
      new WebSocket(
        WS_URL
      )

    ws.onopen = () => {
      console.log(
        "Connected to WebSocket server"
      )
    }

    ws.onmessage = (
      event
    ) => {

      const msg =
        JSON.parse(
          event.data
        )

      if(
        msg.type ===
        "chat"
      ){

        setMessages(
          prev => [
            ...prev,
            msg.data
          ]
        )
      }
    }

    ws.onerror = (
      err
    ) => {

      console.log(
        "WebSocket error:",
        err
      )
    }

    ws.onclose = () => {

      console.log(
        "WebSocket disconnected"
      )
    }

    setSocket(ws)

    return () =>
      ws.close()

  }, [])

  useEffect(() => {

    async function loadMessages(){

      try {

        const res = await fetch(
  `${API}/api/chat/messages`
)

        const data =
          await res.json()

        setMessages(
          data
        )

      } catch(err){

        console.log(
          "Failed to load messages",
          err
        )
      }
    }

    loadMessages()

  }, [])

  useEffect(() => {

    const box =
      document.getElementById(
        "chat-box"
      )

    if(box){
      box.scrollTop =
        box.scrollHeight
    }

  }, [messages])

  function sendMessage(){

    if(
      !text.trim()
    ) return

    if(
      !socket
    ) return

    socket.send(
      JSON.stringify({
        type: "chat",

        user:
          user?.user?.email ||
          user?.email ||
          "anonymous",

        text
      })
    )

    setText("")

  }

  return (

    <div className="chat-page">

      <h2 className="chat-title">
        Meron Gallery.
      </h2>

      <div
        id="chat-box"
        className="chat-box"
      >

        {messages.map(
          (m, i) => (

          <p
            key={i}
            className="chat-message"
          >

            <b>
              {m.user}:
            </b>

            {" "}
            {m.text}

          </p>
        ))}
      </div>

      <div>

        <input
          className="chat-input"

          value={text}

          onChange={(e)=>
            setText(
              e.target.value
            )
          }

          placeholder="Type a message..."
        />

        <button
          className="chat-send-btn"
          onClick={
            sendMessage
          }
        >
          Send
        </button>

      </div>

      <div className="chat-buttons">

        <button
          onClick={() =>
            navigate("/")
          }
        >
          Back
        </button>

      </div>

    </div>
  )
}

export default ChatPage