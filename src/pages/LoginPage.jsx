import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { CoffeeContext } from "../context/CoffeeContext"
import "../styles/LoginPage.css"

function LoginPage(){

  const { login } = useContext(CoffeeContext)
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleLogin(){

  if(!email || !password){
    setError(
      "All fields are required"
    )
    return
  }

  if(!email.includes("@")){
    setError(
      "Invalid email format"
    )
    return
  }

  try {

    const result =
      await login(
        email,
        password
      )

    if(
      result?.requiresVerification
    ){

      navigate(
        "/verify",
        {
          state: {
            email:
              result.email
          }
        }
      )

      return
    }

  } catch {

    setError(
      "Invalid credentials"
    )
  }
}

  return (

    <div className="login-page">

      {/* 🔥 FIX: use correct class */}
      <h1 className="title">
        Meron Gallery.
      </h1>

      <div className="login-card">

        <h2>Staff Login</h2>

        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* 🔥 FIX: use correct class */}
        <button className="login-btn" onClick={handleLogin}>
          login
        </button>
        

        <button
          className="login-btn"
          style={{ marginTop: "10px" }}
          onClick={() => navigate("/")}
        >
          back
        </button>

        <p
          style={{
            cursor:"pointer",
            color:"dark brown"
          }}

          onClick={() =>
            navigate(
              "/forgot-password"
            )
          }
        >
          Forgot password?
        </p>

        {/* 🔥 FIX: use correct class */}
        <p className="register-link">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>
            Register
          </span>
        </p>

      </div>

    </div>

  )
}

export default LoginPage