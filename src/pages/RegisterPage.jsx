import { useNavigate } from "react-router-dom"
import { useState } from "react"
import "../styles/RegisterPage.css"

function RegisterPage(){

  const navigate = useNavigate()

  const [firstName,setFirstName] = useState("")
  const [lastName,setLastName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [confirmPassword,setConfirmPassword] = useState("")

  const [error,setError] = useState("")

  async function handleRegister(){

  if(!firstName || !lastName || !email || !password || !confirmPassword){
    setError("All fields are required")
    return
  }

  if(!email.includes("@")){
    setError("Invalid email")
    return
  }

  if(password !== confirmPassword){
    setError("Passwords do not match")
    return
  }

  try{

    const res = await fetch("https://172.20.10.2:3000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email.trim(),
        password: password.trim()
      })
    })

    // 🔥 SAFELY handle response
    let data = null
    try {
      data = await res.json()
    } catch {
      data = {}
    }

    if(!res.ok){
      throw new Error(data.message || "Register failed")
    }

    navigate("/login")

  }catch(err){
    console.error(err)
    setError(err.message || "Something went wrong")
  }
}

  return(

    <div className="register-page">

      <h1 className="title">Meron Gallery.</h1>

      <div className="register-card">

        <h2>Register</h2>

        <input placeholder="First name" onChange={(e)=>setFirstName(e.target.value)} />
        <input placeholder="Last name" onChange={(e)=>setLastName(e.target.value)} />
        <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />
        <input type="password" placeholder="Confirm password" onChange={(e)=>setConfirmPassword(e.target.value)} />

        {error && <p style={{color:"red"}}>{error}</p>}

        <button className="register-btn" onClick={handleRegister}>
          Register
        </button>

        <p className="login-link">
          Already have an account?
          <span onClick={()=>navigate("/login")}> Login</span>
        </p>

      </div>

    </div>
  )
}

export default RegisterPage