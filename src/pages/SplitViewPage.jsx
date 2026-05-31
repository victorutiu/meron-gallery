import { useNavigate } from "react-router-dom"
import { useState, useContext, useEffect } from "react"
import { CoffeeContext } from "../context/CoffeeContext"
import "../styles/SplitViewPage.css"

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

function SplitViewPage() {

  const { coffees, addCoffee } = useContext(CoffeeContext)

  const navigate = useNavigate()

  const itemsPerPage = 6
  const [page,setPage] = useState(1)

  const start = (page - 1) * itemsPerPage
  const current = coffees.slice(start, start + itemsPerPage)

  const totalPages = Math.ceil(coffees.length / itemsPerPage)


  const quantityOrder = ["250g","500g","1000g"]

  const quantityCounts = {
    "250g":0,
    "500g":0,
    "1000g":0
  }

  coffees.forEach(c => {
    if(quantityCounts[c.quantity] !== undefined){
      quantityCounts[c.quantity]++
    }
  })

  const quantityData = {
    labels: quantityOrder,
    datasets:[
      {
        data: quantityOrder.map(q => quantityCounts[q]),
        backgroundColor:"#c9bea9"
      }
    ]
  }

  const barOptions = {
    responsive:true,
    maintainAspectRatio:false,
    plugins:{ legend:{display:false} }
  }


  const originCounts = {}

  coffees.forEach(c => {

    const origin = c.origin

    if(!originCounts[origin]){
      originCounts[origin] = 0
    }

    originCounts[origin]++

  })

  const originData = {
    labels:Object.keys(originCounts),
    datasets:[
      {
        data:Object.values(originCounts),
        backgroundColor:[
          "#c9bea9",
          "#b8ad97",
          "#a79c86",
          "#8f8572",
          "#7a7261",
          "#d8d2c5",
          "#bdb4a3",
          "#9f9687"
        ]
      }
    ]
  }

  const pieOptions = {
    responsive:true,
    maintainAspectRatio:false,
    plugins:{ legend:{position:"right"} }
  }


  const [generating,setGenerating] = useState(false)

  function generateRandomCoffee(){

    const names = ["Ethiopia","Colombia","Kenya","Brazil","Panama","Guatemala"]
    const processes = ["Natural","Washed","Honey","Double Fermentation"]
    const quantities = ["250g","500g","1000g"]
    const statuses = ["Available","Limited","Out"]

    const newCoffee = {
      id: Math.max(...coffees.map(c=>c.id),0) + 1,
      name: names[Math.floor(Math.random()*names.length)],
      origin: names[Math.floor(Math.random()*names.length)],
      process: processes[Math.floor(Math.random()*processes.length)],
      price: Math.floor(Math.random()*120 + 40) + " RON",
      quantity: quantities[Math.floor(Math.random()*quantities.length)],
      status: statuses[Math.floor(Math.random()*statuses.length)]
    }

  addCoffee(newCoffee)
  }

  useEffect(()=>{

        if(!generating) return

        const interval = setInterval(()=>{

          generateRandomCoffee()

        },1500)

        return ()=>clearInterval(interval)

  },[generating, coffees])

  
  function toggleGenerator(){
    setGenerating(prev => !prev)
  }

  return(

    <div className="split-page page-transition">

      <h1 className="split-logo">
        Meron Gallery.
      </h1>

      <div className="split-container">

        <div className="split-table">

          <table>

            <thead>
              <tr>
                <th>Name</th>
                <th>Process</th>
                <th>Price</th>
                <th>Quantity</th>
                <th></th>
                <th></th>
              </tr>
            </thead>

            <tbody>

              {current.map(coffee => (

                <tr key={coffee.id}>

                  <td>{coffee.name}</td>
                  <td>{coffee.process}</td>
                  <td>{coffee.price}</td>
                  <td>{coffee.quantity}</td>

                  <td className="action-cell">
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/edit/${coffee.id}`, { state: { from: "/splitview" } })}
                    >
                      ✏️
                    </button>
                  </td>

                  <td className="action-cell">
                    <button
                      className="delete-btn"
                      onClick={() => navigate(`/delete/${coffee.id}`, { state: { from: "/splitview" } })}
                    >
                      🗑️
                    </button>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          <div className="split-pagination">

            <button
              disabled={page === 1}
              onClick={()=>setPage(page - 1)}
            >
              Prev
            </button>

            {Array.from({length:totalPages},(_,i)=>(

              <button
                key={i}
                onClick={()=>setPage(i + 1)}
              >
                {i + 1}
              </button>

            ))}

            <button
              disabled={page === totalPages}
              onClick={()=>setPage(page + 1)}
            >
              Next
            </button>

          </div>

        </div>

        <div className="split-charts">

          <div className="split-chart">
            <Bar data={quantityData} options={barOptions}/>
          </div>

          <div className="split-chart">
            <Pie data={originData} options={pieOptions}/>
          </div>

        </div>

      </div>

      <div className="split-buttons">

        <button onClick={()=>navigate("/statistics")}>
          Back
        </button>

        <button onClick={()=>navigate("/add", { state: { from: "/splitview" } })}>
          Add Coffee
        </button>

        <button onClick={toggleGenerator}>
          {generating ? "Stop generating" : "Add random coffees"}
        </button>

      </div>

    </div>

  )

}

export default SplitViewPage