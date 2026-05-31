import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function ObservationPage(){

  const [data, setData] = useState([])
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem("user"))

  // 🔐 only admin allowed
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login")
    }
  }, [])

  useEffect(() => {

  const token =
    localStorage.getItem("token")

  fetch(
    "https://172.20.10.2:3000/admin/suspicious",
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  )
    .then(res => res.json())
    .then(setData)
    .catch(err =>
      console.log(
        "Failed to load observations",
        err
      )
    )

}, [])

  return (
    <div style={{ padding: "20px" }}>

      <h2>Observation List</h2>

      <div style={{
        background: "#f5e9d8",
        padding: "20px",
        borderRadius: "20px",
        maxWidth: "700px",
        margin: "auto"
      }}>

        {data.length === 0 && <p>No suspicious users</p>}

        {data.map((item, i) => (
          <p key={i}>
            <b>{item.user}</b> — {item.reason}
          </p>
        ))}

      </div>

      <br />

      <button onClick={() => navigate("/")}>
        Back
      </button>

    </div>
  )
}

export default ObservationPage