import { useState } from "react"
import {
  useNavigate,
  useLocation
} from "react-router-dom"

import "../styles/AuthExtraPages.css"

import {
  verifyCode
} from "../services/api"// adjust path if needed

function VerifyCodePage(){

  const [code, setCode] =
    useState("")

  const navigate =
    useNavigate()

  const location =
    useLocation()

  const email =
    location.state?.email

  async function handleVerify(){

    try {

      const data =
        await verifyCode(
          email,
          code
        )

      localStorage.setItem(
        "user",
        JSON.stringify(
          data.user
        )
      )

      localStorage.setItem(
        "token",
        data.token
      )

      navigate("/")

    } catch(err){

      console.log(err)

      alert(
        err.message ||
        "Verification failed"
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
          Verify Login
        </h2>

        <p>
          We sent a verification
          code to:
        </p>

        <b>{email}</b>

        <input
          value={code}
          onChange={(e)=>
            setCode(
              e.target.value
            )
          }
          placeholder=
            "6-digit code"
        />

        <div
          className=
            "auth-buttons"
        >

          <button
            onClick={
              handleVerify
            }
          >
            Verify
          </button>

          <button
            onClick={() =>
              navigate(
                "/login"
              )
            }
          >
            Back
          </button>

        </div>

      </div>

    </div>
  )
}

export default VerifyCodePage