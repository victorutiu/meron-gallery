import { useNavigate } from "react-router-dom"
import { useContext, useState } from "react"
import { CoffeeContext } from "../context/CoffeeContext"
import "../styles/StatisticsPage.css"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js"

import { Bar, Pie } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
)

function StatisticsPage() {

  const { coffees } = useContext(CoffeeContext)

  const navigate = useNavigate()

  const [generating, setGenerating] = useState(false)
  

  // ------------------------------
  // GENERATOR TOGGLE
  // ------------------------------

  async function toggleGenerator(){

  const user = JSON.parse(
    localStorage.getItem("user")
  )

  const token =
    localStorage.getItem("token")

  if(user?.role !== "admin"){
    alert(
      "Only admins can use generator"
    )
    return
  }

  try {

    if(!generating){

      await fetch(
        "https://172.20.10.2:3000/generator/start",
        {
          method:"POST",

          headers:{
            Authorization:
              `Bearer ${token}`
          }
        }
      )

      console.log(
        "Generator started"
      )

      setGenerating(true)

    } else {

      await fetch(
        "https://172.20.10.2:3000/generator/stop",
        {
          method:"POST",

          headers:{
            Authorization:
              `Bearer ${token}`
          }
        }
      )

      console.log(
        "Generator stopped"
      )

      setGenerating(false)

    }

  } catch(err){

    console.log(
      "Generator error",
      err
    )
  }
}

  // ------------------------------
  // QUANTITY CHART
  // ------------------------------

  const quantityCounts = {}

  coffees.forEach(c => {

    const quantity = c.quantity

    if (!quantityCounts[quantity]) {
      quantityCounts[quantity] = 0
    }

    quantityCounts[quantity]++

  })

  const quantityData = {
    labels: Object.keys(quantityCounts),
    datasets: [
      {
        data: Object.values(quantityCounts),
        backgroundColor: "#c9bea9"
      }
    ]
  }

  // ------------------------------
  // ORIGIN CHART
  // ------------------------------

  const originCounts = {}

  coffees.forEach(c => {

    const origin = c.origin

    if (!originCounts[origin]) {
      originCounts[origin] = 0
    }

    originCounts[origin]++

  })

  const originData = {
    labels: Object.keys(originCounts),
    datasets: [
      {
        data: Object.values(originCounts),
        backgroundColor: [
          "#c9bea9",
          "#b8ad97",
          "#a79c86",
          "#8f8572",
          "#7a7261",
          "#d8d2c5",
          "#bdb4a3",
          "#9f9687",
          "#6e6658",
          "#e5dfd3"
        ]
      }
    ]
  }

  const pieOptions = {
    responsive:true,
    maintainAspectRatio:false,
    plugins:{
      legend:{position:"right"}
    }
  }

  return (

    <div className="statistics-page page-transition">

      <h1 className="statistics-logo">
        Meron Gallery.
      </h1>

      <div className="chart-container">
        <Bar data={quantityData} />
      </div>

      <div className="statistics-text">
        <p>
          This visualization shows the distribution of coffee quantities
          available in the Meron Gallery inventory and the geographic
          origins of the coffees currently offered.
        </p>
      </div>

      <div className="chart-container">
        <Pie data={originData} options={pieOptions} />
      </div>

      <div className="statistics-buttons">

        <button onClick={() => navigate("/coffees")}>
          Back
        </button>

        <button onClick={() => navigate("/splitview")}>
          Split View
        </button>

        <button
          onClick={() =>
            navigate(
              "/heavy-statistics"
            )
          }
        >
          Heavy Stats
        </button>

        <button onClick={toggleGenerator}>
          {generating ? "Stop Generating" : "Start Generating"}
        </button>

      </div>

    </div>

  )

}

export default StatisticsPage