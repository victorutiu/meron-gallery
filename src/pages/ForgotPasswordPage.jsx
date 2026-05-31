import { useState }
from "react"
import "../styles/AuthExtraPages.css"

import {
  useNavigate
} from "react-router-dom"

function ForgotPasswordPage(){

  const [email, setEmail]
    = useState("")

  const navigate =
    useNavigate()

  async function handleSend(){

    try {

      const res =
        await fetch(
          "/api/auth/forgot-password",
          {
            method:"POST",

            headers:{
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify({
                email
              })
          }
        )

      const data =
        await res.json()

      if(!res.ok){
        alert(
          data.message
        )
        return
      }

      alert(
        "Reset code sent"
      )

      navigate(
        "/reset-password",
        {
          state: {
            email
          }
        }
      )

    } catch(err){

      console.log(err)

      alert(
        "Something went wrong"
      )
    }
  }

 return (

  <div className="auth-page">

    <h1 className="auth-logo">
      Meron Gallery.
    </h1>

    <div className="auth-card">

      <h2>
        Forgot Password
      </h2>

      <p>
        Enter your email
      </p>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e)=>
          setEmail(e.target.value)
        }
      />

      <div className="auth-buttons">

        <button
          onClick={handleSend}
        >
          Send Code
        </button>

        <button
          onClick={() =>
            navigate("/login")
          }
        >
          Back
        </button>

      </div>

    </div>

  </div>
)
}

export default
ForgotPasswordPage