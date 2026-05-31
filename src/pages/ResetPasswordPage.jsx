import { useState }
from "react"
import "../styles/AuthExtraPages.css"

import {
  useLocation,
  useNavigate
} from "react-router-dom"

function ResetPasswordPage(){

  const [code, setCode]
    = useState("")

  const [
    newPassword,
    setNewPassword
  ] = useState("")

  const navigate =
    useNavigate()

  const location =
    useLocation()

  const email =
    location.state?.email

  async function handleReset(){

    try {

      const res =
        await fetch(
          "/api/auth/reset-password",
          {
            method:"POST",

            headers:{
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify({

                email,

                code,

                newPassword
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
        "Password changed"
      )

      navigate("/login")

    } catch(err){

      console.log(err)

      alert(
        "Reset failed"
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
        Reset Password
      </h2>

      <p>
        Email:
      </p>

      <b>{email}</b>

      <input
        placeholder="Reset code"
        value={code}
        onChange={(e)=>
          setCode(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e)=>
          setNewPassword(
            e.target.value
          )
        }
      />

      <div className="auth-buttons">

        <button
          onClick={handleReset}
        >
          Reset
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
ResetPasswordPage