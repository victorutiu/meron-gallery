import { useLocation, useNavigate } from "react-router-dom"
import { useContext } from "react"
import { CoffeeContext } from "../context/CoffeeContext"
import "../styles/BlendDetailPage.css"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js"

import { Pie, Bar } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
)

function PreviewBlendPage() {

  const navigate = useNavigate()
  const location = useLocation()

  const { addBlend } = useContext(CoffeeContext)

  const blend = location.state?.blend

  if (!blend) {
    return <h2>No blend data</h2>
  }

  /* PIE CHART */

  const pieData = {
    labels: blend.coffees.map(c => c.name),
    datasets: [
      {
        data: blend.coffees.map(c => c.percentage),
        backgroundColor: [
          "#c9bea9",
          "#b8ad97",
          "#a79c86",
          "#8f8572",
          "#7a7261"
        ]
      }
    ]
  }

  /* RANDOM BAR CHART */

  function randomValue() {
    return Math.floor(Math.random() * 10) + 1
  }

  const barData = {
    labels: ["Body", "Acidity", "Sweetness", "Aroma"],
    datasets: [
      {
        data: [
          randomValue(),
          randomValue(),
          randomValue(),
          randomValue()
        ],
        backgroundColor: "#9e9485"
      }
    ]
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        max: 10
      }
    }
  }

  /* CREATE BLEND */

  function handleCreateBlend() {

    const newBlend = {
      id: Date.now(),
      ...blend
    }

    addBlend(newBlend)

    navigate("/blends")
  }

  return (

    <div className="blend-detail-page">

      <h1 className="blend-detail-logo">
        Meron Gallery.
      </h1>

      <div className="blend-detail-container">

        {/* LEFT */}

        <div className="blend-detail-left">

          <div className="blend-card">

            <h3>{blend.name}</h3>

            <p>
              {blend.coffees.map(c => c.origin).join(" / ")}
            </p>

            <p>{blend.quantity}</p>

          </div>

          <div className="blend-description">

            <h3>description</h3>

            <p>
              Body, acidity, and sweetness are key components in
              sensory evaluation, defining the flavor profile
              and balance of the product.
            </p>

          </div>

          <div className="blend-preview-buttons">

            <button
              onClick={handleCreateBlend}
            >
              create blend
            </button>

            <button
              onClick={() => navigate(-1)}
            >
              back
            </button>

          </div>

        </div>


        {/* RIGHT */}

        <div className="blend-detail-right">

          <div className="blend-pie">
            <Pie data={pieData} />
          </div>

          <div className="blend-bar">
            <Bar data={barData} options={barOptions} />
          </div>

        </div>

      </div>

    </div>

  )
}

export default PreviewBlendPage